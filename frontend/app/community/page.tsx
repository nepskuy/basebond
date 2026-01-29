'use client';

import React, { useState, useEffect, useMemo } from 'react';
import CustomNavbar from '@/components/CustomNavbar';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import CustomFooter from '@/components/CustomFooter';
import {
    Wallet,
    Vote,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    Users,
    DollarSign,
    Coins,
    ArrowRight,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import {
    useAllProposals,
    useCreateProposal,
    useVote,
    useWithdrawOrganizerBalance,
    useOrganizerBalance,
    useTreasuryBalance,
    CONTRACTS,
    EVENT_TREASURY_ABI
} from '@/hooks/useContracts';

const TREASURY_ADDRESS = CONTRACTS.eventTreasury;

export default function GovernancePage() {
    const { address, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<'proposals' | 'create' | 'my-balance'>('proposals');
    const [newProposal, setNewProposal] = useState({
        description: '',
        recipient: '',
        amount: '',
    });

    // Read real data via hooks
    const { proposals, isLoading: isLoadingProposals, refetch: refetchProposals } = useAllProposals();
    const { balance: treasuryBalance } = useTreasuryBalance();

    // Fee and threshold still read directly for now as they are simple views
    const { data: platformFee } = useReadContract({
        address: TREASURY_ADDRESS,
        abi: EVENT_TREASURY_ABI,
        functionName: 'platformFeeBps',
    });

    const { data: minThreshold } = useReadContract({
        address: TREASURY_ADDRESS,
        abi: EVENT_TREASURY_ABI,
        functionName: 'minProposalThreshold',
    });

    const { balance: organizerBalance, refetch: refetchOrganizerBalance } = useOrganizerBalance(address);

    // Write hooks
    const { createProposal, isLoading: isCreatePending, isSuccess: isCreateSuccess } = useCreateProposal();
    const { vote, isLoading: isVotePending, isSuccess: isVoteSuccess } = useVote();
    const { withdraw, isLoading: isWithdrawPending, isSuccess: isWithdrawSuccess } = useWithdrawOrganizerBalance();

    const gradientColors = {
        primary: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)',
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

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const getProposalStatus = (proposal: any) => {
        if (!proposal) return { label: 'Error', color: 'bg-gray-500' };
        if (proposal.cancelled) return { label: 'Cancelled', color: 'bg-gray-500' };
        if (proposal.executed) return { label: 'Executed', color: 'bg-green-500' };
        if (new Date() > proposal.deadline) {
            const passed = proposal.votesFor > proposal.votesAgainst;
            return passed
                ? { label: 'Passed', color: 'bg-blue-500' }
                : { label: 'Rejected', color: 'bg-red-500' };
        }
        return { label: 'Active', color: 'bg-yellow-500' };
    };

    const getVotePercentage = (proposal: any) => {
        if (!proposal) return 0;
        const total = proposal.votesFor + proposal.votesAgainst;
        if (total === BigInt(0)) return 50;
        return Number((proposal.votesFor * BigInt(100)) / total);
    };

    const handleCreateProposal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProposal.description || !newProposal.recipient || !newProposal.amount) return;
        await createProposal(newProposal.description, newProposal.recipient, Number(newProposal.amount));
    };

    const handleVote = async (proposalId: number, support: boolean) => {
        await vote(proposalId, support);
    };

    const handleWithdraw = async () => {
        await withdraw();
    };

    useEffect(() => {
        if (isCreateSuccess) {
            setNewProposal({ description: '', recipient: '', amount: '' });
            setActiveTab('proposals');
            alert('Proposal created successfully!');
        }
    }, [isCreateSuccess]);

    useEffect(() => {
        if (isVoteSuccess) {
            alert('Vote submitted successfully!');
        }
    }, [isVoteSuccess]);

    useEffect(() => {
        if (isWithdrawSuccess) {
            alert('Withdrawal successful!');
        }
    }, [isWithdrawSuccess]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E6E6E6] to-white dark:from-gray-900 dark:to-gray-950">
            <CustomNavbar />

            <main className="container mx-auto px-4 py-12">
                {/* Header */}
                <div id="gov-header" className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#14279B]/10 dark:bg-blue-900/20 text-[#14279B] dark:text-blue-400 text-sm font-medium mb-6">
                        <Vote className="w-4 h-4" />
                        Community Treasury
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: gradientColors.primary }}
                        >
                            Community Voice
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Vote on proposals and help shape the future of BaseBond community treasury
                    </p>
                </div>

                {/* Treasury Stats */}
                {/* Treasury Stats */}
                <div id="treasury-stats" className="grid md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ background: gradientColors.primary }}
                            >
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Treasury Balance</p>
                                <p className="text-2xl font-bold">
                                    {treasuryBalance ? formatAmount(treasuryBalance) : '125,000'} IDRX
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ background: gradientColors.primary }}
                            >
                                <Vote className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Active Proposals</p>
                                <p className="text-2xl font-bold">
                                    {proposals.filter((p: any) => p && !p.executed && !p.cancelled && new Date() < p.deadline).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ background: gradientColors.primary }}
                            >
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Platform Fee</p>
                                <p className="text-2xl font-bold">
                                    {platformFee ? Number(platformFee) / 100 : 2.5}%
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ background: gradientColors.primary }}
                            >
                                <Coins className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Your Balance</p>
                                <p className="text-2xl font-bold">
                                    {organizerBalance ? formatAmount(organizerBalance) : '0'} IDRX
                                </p>
                            </div>
                        </div>
                        {organizerBalance && organizerBalance > BigInt(0) && (
                            <button
                                onClick={handleWithdraw}
                                disabled={isWithdrawPending}
                                className="w-full mt-2 py-2 rounded-lg bg-[#14279B] text-white text-sm font-medium hover:bg-[#3D56B2] transition-colors disabled:opacity-50"
                            >
                                {isWithdrawPending ? 'Withdrawing...' : 'Withdraw'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('proposals')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'proposals'
                            ? 'text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                            }`}
                        style={activeTab === 'proposals' ? { background: gradientColors.primary } : {}}
                    >
                        <Vote className="w-4 h-4 inline mr-2" />
                        Proposals
                    </button>
                    <button
                        id="create-proposal-tab"
                        onClick={() => setActiveTab('create')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'create'
                            ? 'text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                            }`}
                        style={activeTab === 'create' ? { background: gradientColors.primary } : {}}
                    >
                        <Plus className="w-4 h-4 inline mr-2" />
                        Create Proposal
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'proposals' && (
                    <div id="proposals-list" className="space-y-6">
                        {/* Filter out any potential nulls although hook handles it */}
                        {proposals.filter((p: any) => p !== null).map((proposal: any) => {
                            if (!proposal) return null; // Extra safety
                            const status = getProposalStatus(proposal);
                            const votePercent = getVotePercentage(proposal);
                            const isActive = !proposal?.executed && !proposal?.cancelled && new Date() < proposal?.deadline;

                            return (
                                <div
                                    key={proposal.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${status.color}`}>
                                                    {status.label}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Proposal #{proposal.id}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{proposal.description}</h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                <span>
                                                    <Users className="w-4 h-4 inline mr-1" />
                                                    By {formatAddress(proposal.proposer)}
                                                </span>
                                                <span>
                                                    <Coins className="w-4 h-4 inline mr-1" />
                                                    {formatAmount(proposal.amount)} IDRX
                                                </span>
                                                <span>
                                                    <Clock className="w-4 h-4 inline mr-1" />
                                                    {proposal.deadline.toLocaleDateString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vote Progress */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-green-600 font-medium">
                                                <CheckCircle className="w-4 h-4 inline mr-1" />
                                                For: {formatAmount(proposal.votesFor)} IDRX
                                            </span>
                                            <span className="text-red-600 font-medium">
                                                <XCircle className="w-4 h-4 inline mr-1" />
                                                Against: {formatAmount(proposal.votesAgainst)} IDRX
                                            </span>
                                        </div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                                            <div
                                                className="h-full bg-green-500 transition-all duration-500"
                                                style={{ width: `${votePercent}%` }}
                                            />
                                            <div
                                                className="h-full bg-red-500 transition-all duration-500"
                                                style={{ width: `${100 - votePercent}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Vote Buttons */}
                                    {isActive && isConnected && (
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => handleVote(proposal.id, true)}
                                                disabled={isVotePending}
                                                className="flex-1 py-3 rounded-xl bg-green-100 text-green-700 font-medium hover:bg-green-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {isVotePending ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4" />
                                                )}
                                                Vote For
                                            </button>
                                            <button
                                                onClick={() => handleVote(proposal.id, false)}
                                                disabled={isVotePending}
                                                className="flex-1 py-3 rounded-xl bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {isVotePending ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <XCircle className="w-4 h-4" />
                                                )}
                                                Vote Against
                                            </button>
                                        </div>
                                    )}

                                    {!isConnected && isActive && (
                                        <div className="flex items-center gap-2 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">
                                            <AlertCircle className="w-5 h-5" />
                                            Connect your wallet to vote on this proposal
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'create' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                            <h2 className="text-2xl font-bold mb-6">Create New Proposal</h2>

                            {!isConnected ? (
                                <ConnectButton.Custom>
                                    {({ openConnectModal }) => (
                                        <div
                                            onClick={openConnectModal}
                                            className="text-center py-12 px-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl hover:border-[#14279B] hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer transition-all group"
                                        >
                                            <div
                                                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                                                style={{ background: gradientColors.primary }}
                                            >
                                                <Wallet className="w-10 h-10 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Wallet Not Connected</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                                Please connect your wallet to create a proposal
                                            </p>
                                            <button
                                                className="px-6 py-3 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                                style={{ background: gradientColors.primary }}
                                            >
                                                Connect Wallet
                                            </button>
                                            <p className="text-sm text-gray-400 mt-4">
                                                You need at least {minThreshold ? formatAmount(minThreshold) : '1,000'} IDRX to create proposals
                                            </p>
                                        </div>
                                    )}
                                </ConnectButton.Custom>
                            ) : (
                                <form onSubmit={handleCreateProposal} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Proposal Description *
                                        </label>
                                        <textarea
                                            value={newProposal.description}
                                            onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Describe what this proposal is for..."
                                            rows={4}
                                            className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-[#5C7AEA] transition-all duration-300 outline-none resize-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Recipient Address *
                                        </label>
                                        <input
                                            type="text"
                                            value={newProposal.recipient}
                                            onChange={(e) => setNewProposal(prev => ({ ...prev, recipient: e.target.value }))}
                                            placeholder="0x..."
                                            className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-[#5C7AEA] transition-all duration-300 outline-none font-mono"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Amount (IDRX) *
                                        </label>
                                        <input
                                            type="number"
                                            value={newProposal.amount}
                                            onChange={(e) => setNewProposal(prev => ({ ...prev, amount: e.target.value }))}
                                            placeholder="1000"
                                            min="1"
                                            step="any"
                                            className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-[#5C7AEA] transition-all duration-300 outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                        <p className="text-sm text-blue-700 dark:text-blue-400">
                                            <AlertCircle className="w-4 h-4 inline mr-2" />
                                            Proposals require a 3-day voting period and 10% quorum to pass.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isCreatePending}
                                        className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                                        style={{ background: gradientColors.primary }}
                                    >
                                        {isCreatePending ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Creating Proposal...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-5 h-5" />
                                                Submit Proposal
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <CustomFooter />
        </div>
    );
}
