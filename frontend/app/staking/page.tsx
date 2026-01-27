'use client';

import React, { useState, useEffect, useMemo } from 'react';
import CustomNavbar from '@/components/CustomNavbar';
import CustomFooter from '@/components/CustomFooter';
import {
    Coins,
    TrendingUp,
    Award,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
    Gift,
    Loader2,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useTokenAllowance, useApproveToken, CONTRACTS } from '@/hooks/useContracts';
import { parseEther, formatEther } from 'viem';

// Staking ABI
const STAKING_ABI = [
    {
        name: 'stake',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'amount', type: 'uint256' }],
        outputs: [],
    },
    {
        name: 'unstake',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'amount', type: 'uint256' }],
        outputs: [],
    },
    {
        name: 'claimPoints',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [],
        outputs: [],
    },
    {
        name: 'getStakeInfo',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [
            { name: 'stakedAmount', type: 'uint256' },
            { name: 'stakingStartTime', type: 'uint256' },
            { name: 'claimedPoints', type: 'uint256' },
            { name: 'pendingPointsAmount', type: 'uint256' },
            { name: 'totalPoints', type: 'uint256' },
        ],
    },
    {
        name: 'eventPoints',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'pendingPoints',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'totalStaked',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'pointsPerTokenPerDay',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'minStakeAmount',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint256' }],
    },
] as const;

const STAKING_ADDRESS = (process.env.NEXT_PUBLIC_LOYALTY_STAKING_ADDRESS || '0x0') as `0x${string}`;

// Rewards catalog removed as per user request to avoid mock data

export default function StakingPage() {
    const { address, isConnected } = useAccount();
    const [stakeAmount, setStakeAmount] = useState('');
    const [unstakeAmount, setUnstakeAmount] = useState('');
    // const [activeTab, setActiveTab] = useState<'stake'>('stake'); // Simplified to single view

    // Read staking data
    const { data: stakeInfo, refetch: refetchStakeInfo } = useReadContract({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: 'getStakeInfo',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    const { data: eventPoints } = useReadContract({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: 'eventPoints',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    const { data: totalStaked } = useReadContract({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: 'totalStaked',
    });

    const { data: pointsPerDay } = useReadContract({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: 'pointsPerTokenPerDay',
    });

    const { data: minStake } = useReadContract({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: 'minStakeAmount',
    });

    // Write functions
    const { writeContract: stakeTx, data: stakeHash, isPending: isStakePending } = useWriteContract();
    const { writeContract: unstakeTx, data: unstakeHash, isPending: isUnstakePending } = useWriteContract();
    const { writeContract: claimTx, data: claimHash, isPending: isClaimPending } = useWriteContract();

    const { isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({ hash: stakeHash });
    const { isSuccess: isUnstakeSuccess } = useWaitForTransactionReceipt({ hash: unstakeHash });
    const { isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({ hash: claimHash });

    const {
        allowance,
        refetch: refetchAllowance
    } = useTokenAllowance(
        CONTRACTS.idrxToken,
        address as `0x${string}`,
        CONTRACTS.loyaltyStaking
    );

    const {
        approve,
        isLoading: isApproving,
        isSuccess: isApproveSuccess,
    } = useApproveToken();

    const gradientColors = {
        primary: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)',
        gold: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    };

    const formatAmount = (amount: bigint | undefined) => {
        if (!amount) return '0';
        try {
            const formatted = formatEther(amount);
            return Number(formatted).toLocaleString('id-ID', { maximumFractionDigits: 2 });
        } catch {
            return '0';
        }
    };

    const userStakedAmount = stakeInfo ? stakeInfo[0] : BigInt(0);
    const userPendingPoints = stakeInfo ? stakeInfo[3] : BigInt(0);
    const userTotalPoints = eventPoints || BigInt(0);
    const stakingStartTime = stakeInfo ? new Date(Number(stakeInfo[1]) * 1000) : null;

    const handleStake = async () => {
        if (!stakeAmount || Number(stakeAmount) <= 0) return;

        try {
            const amountWei = parseEther(stakeAmount);

            if (allowance < amountWei) {
                await approve(CONTRACTS.idrxToken, CONTRACTS.loyaltyStaking, amountWei);
                return;
            }

            stakeTx({
                address: STAKING_ADDRESS,
                abi: STAKING_ABI,
                functionName: 'stake',
                args: [amountWei],
            });
        } catch (err) {
            console.error('Failed to stake', err);
        }
    };

    const handleUnstake = async () => {
        if (!unstakeAmount || Number(unstakeAmount) <= 0) return;

        try {
            unstakeTx({
                address: STAKING_ADDRESS,
                abi: STAKING_ABI,
                functionName: 'unstake',
                args: [parseEther(unstakeAmount)],
            });
        } catch (err) {
            console.error('Failed to unstake', err);
        }
    };

    const handleClaim = async () => {
        try {
            claimTx({
                address: STAKING_ADDRESS,
                abi: STAKING_ABI,
                functionName: 'claimPoints',
            });
        } catch (err) {
            console.error('Failed to claim', err);
        }
    };

    useEffect(() => {
        if (isStakeSuccess) {
            setStakeAmount('');
            refetchStakeInfo();
            alert('Staking successful!');
        }
    }, [isStakeSuccess, refetchStakeInfo]);

    useEffect(() => {
        if (isUnstakeSuccess) {
            setUnstakeAmount('');
            refetchStakeInfo();
            alert('Unstaking successful!');
        }
    }, [isUnstakeSuccess, refetchStakeInfo]);

    useEffect(() => {
        if (isClaimSuccess) {
            refetchStakeInfo();
            alert('Points claimed successfully!');
        }
    }, [isClaimSuccess, refetchStakeInfo]);

    useEffect(() => {
        if (isApproveSuccess) {
            refetchAllowance();
            // User can now click stake again
        }
    }, [isApproveSuccess, refetchAllowance]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E6E6E6] to-white dark:from-gray-900 dark:to-gray-950">
            <CustomNavbar />

            <main className="container mx-auto px-4 py-12">
                {/* Header */}
                <div id="staking-header" className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#14279B]/10 dark:bg-blue-900/20 text-[#14279B] dark:text-blue-400 text-sm font-medium mb-6">
                        <Coins className="w-4 h-4" />
                        Loyalty Staking
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Stake{' '}
                        <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: gradientColors.primary }}
                        >
                            IDRX
                        </span>
                        {' '}& Earn Points
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Stake your IDRX tokens to earn Event Points. Redeem points for exclusive rewards and benefits!
                    </p>
                </div>

                {/* Stats Cards */}
                <div id="staking-stats" className="grid md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ background: gradientColors.primary }}
                            >
                                <Coins className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Your Staked</p>
                                <p className="text-2xl font-bold">{formatAmount(userStakedAmount)} IDRX</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ background: gradientColors.gold }}
                            >
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Your Points</p>
                                <p className="text-2xl font-bold">{Number(userTotalPoints).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pending Points</p>
                                <p className="text-2xl font-bold">{Number(userPendingPoints).toLocaleString()}</p>
                            </div>
                        </div>
                        {userPendingPoints > BigInt(0) && (
                            <button
                                id="claim-button"
                                onClick={handleClaim}
                                disabled={isClaimPending}
                                className="w-full mt-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                            >
                                {isClaimPending ? 'Claiming...' : 'Claim Points'}
                            </button>
                        )}
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">APY Rate</p>
                                <p className="text-2xl font-bold">
                                    {pointsPerDay ? Number(pointsPerDay) : 100} pts/day
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs removed - Single View */}

                {/* Content */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Stake Card */}
                    <div id="stake-card" className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <ArrowUpRight className="w-5 h-5 text-green-600" />
                            </div>
                            <h2 className="text-xl font-bold">Stake IDRX</h2>
                        </div>

                        {!isConnected ? (
                            <div className="text-center py-8">
                                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    Connect your wallet to stake IDRX
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Amount to Stake
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={stakeAmount}
                                            onChange={(e) => setStakeAmount(e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="any"
                                            className="w-full px-4 py-4 pr-20 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-green-500 transition-all duration-300 outline-none text-xl"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                            IDRX
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Min stake: {minStake ? formatAmount(minStake) : '1'} IDRX
                                    </p>
                                </div>

                                <button
                                    onClick={handleStake}
                                    disabled={isStakePending || !stakeAmount || isApproving}
                                    className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 bg-green-500 hover:bg-green-600"
                                >
                                    {isStakePending ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Staking...
                                        </>
                                    ) : isApproving ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Approving IDRX...
                                        </>
                                    ) : (
                                        <>
                                            <ArrowUpRight className="w-5 h-5" />
                                            {allowance < parseEther(stakeAmount || '0') && Number(stakeAmount) > 0 ? "Approve IDRX" : "Stake IDRX"}
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Unstake Card */}
                    <div id="unstake-card" className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                <ArrowDownRight className="w-5 h-5 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold">Unstake IDRX</h2>
                        </div>

                        {!isConnected ? (
                            <div className="text-center py-8">
                                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    Connect your wallet to unstake IDRX
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Amount to Unstake
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={unstakeAmount}
                                            onChange={(e) => setUnstakeAmount(e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="any"
                                            className="w-full px-4 py-4 pr-20 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-red-500 transition-all duration-300 outline-none text-xl"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                            IDRX
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Available: {formatAmount(userStakedAmount)} IDRX
                                    </p>
                                </div>

                                <button
                                    onClick={handleUnstake}
                                    disabled={isUnstakePending || !unstakeAmount || userStakedAmount === BigInt(0)}
                                    className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 bg-red-500 hover:bg-red-600"
                                >
                                    {isUnstakePending ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Unstaking...
                                        </>
                                    ) : (
                                        <>
                                            <ArrowDownRight className="w-5 h-5" />
                                            Unstake IDRX
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Staking Info */}
                    <div className="lg:col-span-2 bg-gradient-to-r from-[#14279B]/10 to-[#5C7AEA]/10 rounded-2xl p-8 border border-[#5C7AEA]/20">
                        <h3 className="text-xl font-bold mb-4">How Staking Works</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#14279B] text-white flex items-center justify-center font-bold flex-shrink-0">
                                    1
                                </div>
                                <div>
                                    <p className="font-semibold">Stake IDRX</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Deposit your IDRX tokens into the staking contract
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#14279B] text-white flex items-center justify-center font-bold flex-shrink-0">
                                    2
                                </div>
                                <div>
                                    <p className="font-semibold">Earn Points</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Accumulate Event Points based on staking duration
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#14279B] text-white flex items-center justify-center font-bold flex-shrink-0">
                                    3
                                </div>
                                <div>
                                    <p className="font-semibold">Redeem Rewards</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Use points for exclusive rewards and benefits
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Rewards section removed */}
            </main>

            <CustomFooter />
        </div>
    );
}
