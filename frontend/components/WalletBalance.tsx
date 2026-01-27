// Wallet Balance Display Component
'use client';

import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { Wallet } from 'lucide-react';

const IDRX_TOKEN_ABI = [
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ type: 'uint256' }],
    },
] as const;

const IDRX_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_IDRX_TOKEN_ADDRESS || '0x0') as `0x${string}`;

export default function WalletBalance() {
    const { address, isConnected } = useAccount();

    const { data: balance } = useReadContract({
        address: IDRX_TOKEN_ADDRESS,
        abi: IDRX_TOKEN_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address && isConnected },
    });

    if (!isConnected || !balance) return null;

    const formattedBalance = parseFloat(formatEther(balance)).toFixed(2);

    return (
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800">
            <Wallet className="w-4 h-4 text-[#14279B] dark:text-blue-400" />
            <span className="text-sm font-semibold text-[#14279B] dark:text-blue-400">
                {formattedBalance} IDRX
            </span>
        </div>
    );
}
