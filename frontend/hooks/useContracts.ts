'use client';

import { useMemo, useState, useEffect } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from 'wagmi';
import { parseEther } from 'viem';

// Contract ABIs (simplified for core functions)
export const EVENT_FACTORY_ABI = [
    {
        name: 'createEvent',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'name', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'location', type: 'string' },
            { name: 'imageUri', type: 'string' },
            { name: 'badgeUri', type: 'string' },
            { name: 'date', type: 'uint256' },
            { name: 'price', type: 'uint256' },
            { name: 'maxTickets', type: 'uint256' },
        ],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'buyTicket',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'eventId', type: 'uint256' }],
        outputs: [],
    },
    {
        name: 'checkIn',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'eventId', type: 'uint256' },
            { name: 'attendee', type: 'address' },
        ],
        outputs: [],
    },
    {
        name: 'getEventDetails',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'eventId', type: 'uint256' }],
        outputs: [
            { name: 'name', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'location', type: 'string' },
            { name: 'imageUri', type: 'string' },
            { name: 'badgeUri', type: 'string' },
            { name: 'date', type: 'uint256' },
            { name: 'price', type: 'uint256' },
            { name: 'maxTickets', type: 'uint256' },
            { name: 'soldTickets', type: 'uint256' },
            { name: 'organizer', type: 'address' },
            { name: 'isActive', type: 'bool' },
        ],
    },
    {
        name: 'getOrganizerEvents',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'organizer', type: 'address' }],
        outputs: [
            { name: 'eventIds', type: 'uint256[]' },
            { name: 'names', type: 'string[]' },
            { name: 'dates', type: 'uint256[]' },
            { name: 'prices', type: 'uint256[]' },
            { name: 'imageUris', type: 'string[]' },
            { name: 'ticketsSold', type: 'uint256[]' },
            { name: 'maxTickets', type: 'uint256[]' },
            { name: 'activeStatus', type: 'bool[]' },
        ],
    },
    {
        name: 'getActiveEvents',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'offset', type: 'uint256' },
            { name: 'limit', type: 'uint256' },
        ],
        outputs: [
            { name: 'eventIds', type: 'uint256[]' },
            { name: 'names', type: 'string[]' },
            { name: 'locations', type: 'string[]' },
            { name: 'imageUris', type: 'string[]' },
            { name: 'dates', type: 'uint256[]' },
            { name: 'prices', type: 'uint256[]' },
            { name: 'total', type: 'uint256' },
        ],
    },
    {
        name: 'getEventCount',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'hasUserTicket',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'eventId', type: 'uint256' },
            { name: 'user', type: 'address' },
        ],
        outputs: [{ type: 'bool' }],
    },
    {
        name: 'hasUserCheckedIn',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'eventId', type: 'uint256' },
            { name: 'user', type: 'address' },
        ],
        outputs: [{ type: 'bool' }],
    },
] as const;

export const LOYALTY_STAKING_ABI = [
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
] as const;

export const EVENT_TREASURY_ABI = [
    {
        name: 'createProposal',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'description', type: 'string' },
            { name: 'recipient', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'vote',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'proposalId', type: 'uint256' },
            { name: 'support', type: 'bool' },
        ],
        outputs: [],
    },
    {
        name: 'withdrawOrganizerBalance',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [],
        outputs: [],
    },
    {
        name: 'proposalCount',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'getProposal',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'proposalId', type: 'uint256' }],
        outputs: [
            { name: 'proposer', type: 'address' },
            { name: 'description', type: 'string' },
            { name: 'recipient', type: 'address' },
            { name: 'amount', type: 'uint256' },
            { name: 'votesFor', type: 'uint256' },
            { name: 'votesAgainst', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
            { name: 'executed', type: 'bool' },
            { name: 'cancelled', type: 'bool' },
        ],
    },
    {
        name: 'organizerBalances',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'organizer', type: 'address' }],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'getTreasuryBalance',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'platformFeeBps',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'minProposalThreshold',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint256' }],
    },
] as const;

export const ERC20_ABI = [
    {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ type: 'bool' }],
    },
    {
        name: 'allowance',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
        ],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ type: 'uint256' }],
    },
] as const;

// Contract addresses (from .env or hardcoded for development)
const CONTRACTS = {
    eventFactory: (process.env.NEXT_PUBLIC_EVENT_FACTORY_ADDRESS || '0x0') as `0x${string}`,
    ticketNFT: (process.env.NEXT_PUBLIC_TICKET_NFT_ADDRESS || '0x0') as `0x${string}`,
    eventPOAP: (process.env.NEXT_PUBLIC_EVENT_POAP_ADDRESS || '0x0') as `0x${string}`,
    loyaltyStaking: (process.env.NEXT_PUBLIC_LOYALTY_STAKING_ADDRESS || '0x0') as `0x${string}`,
    eventTreasury: (process.env.NEXT_PUBLIC_EVENT_TREASURY_ADDRESS || '0x0') as `0x${string}`,
    idrxToken: (process.env.NEXT_PUBLIC_IDRX_ADDRESS || '0x0') as `0x${string}`,
};

// ==================== EVENT FACTORY HOOKS ====================

export function useCreateEvent() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const createEvent = async (name: string, description: string, location: string, imageUri: string, badgeUri: string, date: Date, priceInIDRX: number, maxTickets: number) => {
        const timestamp = Math.floor(date.getTime() / 1000);
        const priceWei = parseEther(priceInIDRX.toString());

        writeContract({
            address: CONTRACTS.eventFactory,
            abi: EVENT_FACTORY_ABI,
            functionName: 'createEvent',
            args: [
                name,
                description,
                location,
                imageUri,
                badgeUri,
                BigInt(timestamp),
                priceWei,
                BigInt(maxTickets)
            ],
        });
    };

    return {
        createEvent,
        isLoading: isPending || isConfirming,
        isSuccess,
        error,
        txHash: hash,
    };
}

export function useBuyTicket() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const buyTicket = async (eventId: number) => {
        writeContract({
            address: CONTRACTS.eventFactory,
            abi: EVENT_FACTORY_ABI,
            functionName: 'buyTicket',
            args: [BigInt(eventId)],
        });
    };

    return {
        buyTicket,
        isLoading: isPending || isConfirming,
        isSuccess,
        error,
        txHash: hash,
    };
}

export function useCheckIn() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const checkIn = async (eventId: number, attendeeAddress: string) => {
        writeContract({
            address: CONTRACTS.eventFactory,
            abi: EVENT_FACTORY_ABI,
            functionName: 'checkIn',
            args: [BigInt(eventId), attendeeAddress as `0x${string}`],
        });
    };

    return {
        checkIn,
        isLoading: isPending || isConfirming,
        isSuccess,
        error,
        txHash: hash,
    };
}

export function useEventDetails(eventId: number) {
    const result = useReadContract({
        address: CONTRACTS.eventFactory,
        abi: EVENT_FACTORY_ABI,
        functionName: 'getEventDetails',
        args: [BigInt(eventId)],
    });

    return {
        event: result.data ? {
            id: eventId,
            name: result.data[0],
            description: result.data[1],
            location: result.data[2],
            imageUri: result.data[3],
            badgeUri: result.data[4], // New field
            date: new Date(Number(result.data[5]) * 1000),
            price: result.data[6],
            maxTickets: Number(result.data[7]),
            soldTickets: Number(result.data[8]),
            organizer: result.data[9],
            isActive: result.data[10],
        } : null,
        isLoading: result.isLoading,
        error: result.error,
    };
}

export function useActiveEvents(offset = 0, limit = 10) {
    const result = useReadContract({
        address: CONTRACTS.eventFactory,
        abi: EVENT_FACTORY_ABI,
        functionName: 'getActiveEvents',
        args: [BigInt(offset), BigInt(limit)],
    });

    const events = useMemo(() => {
        if (!result.data) return [];
        const [ids, names, locations, imageUris, dates, prices] = result.data;

        return ids.map((id, i) => ({
            id: Number(id),
            name: names[i],
            location: locations[i],
            imageUri: imageUris[i],
            date: new Date(Number(dates[i]) * 1000),
            price: prices[i],
        }));
    }, [result.data]);

    return {
        events,
        total: result.data ? Number(result.data[6]) : 0,
        isLoading: result.isLoading,
        error: result.error,
    };
}

export function useMyEvents(organizerAddress?: `0x${string}`) {
    const result = useReadContract({
        address: CONTRACTS.eventFactory,
        abi: EVENT_FACTORY_ABI,
        functionName: 'getOrganizerEvents',
        args: organizerAddress ? [organizerAddress] : undefined,
        query: {
            enabled: !!organizerAddress,
        }
    });

    const events = useMemo(() => {
        if (!result.data) return [];
        const [ids, names, dates, prices, imageUris, ticketsSold, maxTickets, activeStatus] = result.data;

        return ids.map((id, i) => ({
            id: Number(id),
            name: names[i],
            date: new Date(Number(dates[i]) * 1000),
            price: prices[i],
            imageUri: imageUris[i],
            soldTickets: Number(ticketsSold[i]),
            maxTickets: Number(maxTickets[i]),
            isActive: activeStatus[i],
            location: 'TBA', // Not returned by view function to save stack
        }));
    }, [result.data]);

    return {
        events,
        isLoading: result.isLoading,
        error: result.error,
    };
}

// ==================== LOYALTY STAKING HOOKS ====================

export function useStakeIDRX() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const stake = async (amountInIDRX: number) => {
        writeContract({
            address: CONTRACTS.loyaltyStaking,
            abi: LOYALTY_STAKING_ABI,
            functionName: 'stake',
            args: [parseEther(amountInIDRX.toString())],
        });
    };

    return {
        stake,
        isLoading: isPending || isConfirming,
        isSuccess,
        error,
        txHash: hash,
    };
}

export function useUnstakeIDRX() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const unstake = async (amountInIDRX: number) => {
        writeContract({
            address: CONTRACTS.loyaltyStaking,
            abi: LOYALTY_STAKING_ABI,
            functionName: 'unstake',
            args: [parseEther(amountInIDRX.toString())],
        });
    };

    return {
        unstake,
        isLoading: isPending || isConfirming,
        isSuccess,
        error,
        txHash: hash,
    };
}

export function useClaimPoints() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const claimPoints = async () => {
        writeContract({
            address: CONTRACTS.loyaltyStaking,
            abi: LOYALTY_STAKING_ABI,
            functionName: 'claimPoints',
        });
    };

    return {
        claimPoints,
        isLoading: isPending || isConfirming,
        isSuccess,
        error,
        txHash: hash,
    };
}

export function useStakeInfo(userAddress?: `0x${string}`) {
    if (!userAddress) return { stakeInfo: null, isLoading: false, error: null };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const result = useReadContract({
        address: CONTRACTS.loyaltyStaking,
        abi: LOYALTY_STAKING_ABI,
        functionName: 'getStakeInfo',
        args: [userAddress],
    });

    return {
        stakeInfo: result.data ? {
            stakedAmount: result.data[0],
            stakingStartTime: new Date(Number(result.data[1]) * 1000),
            claimedPoints: result.data[2],
            pendingPoints: result.data[3],
            totalPoints: result.data[4],
        } : null,
        isLoading: result.isLoading,
        error: result.error,
    };
}

export function useUserPoints(userAddress?: `0x${string}`) {
    if (!userAddress) return { points: BigInt(0), isLoading: false, error: null };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const result = useReadContract({
        address: CONTRACTS.loyaltyStaking,
        abi: LOYALTY_STAKING_ABI,
        functionName: 'eventPoints',
        args: [userAddress],
    });

    return {
        points: result.data,
        isLoading: result.isLoading,
        error: result.error,
    };
}

export function useProfileCollection(userAddress?: `0x${string}`) {
    // 1. Get total event count
    const { data: eventCount } = useReadContract({
        address: CONTRACTS.eventFactory,
        abi: EVENT_FACTORY_ABI,
        functionName: 'getEventCount',
        query: {
            enabled: !!userAddress
        }
    });

    const totalEvents = eventCount ? Number(eventCount) : 0;

    // Create arrays of indices [0, 1, ... total-1]
    const eventIds = useMemo(() => {
        if (!totalEvents) return [];
        return Array.from({ length: totalEvents }, (_, i) => BigInt(i));
    }, [totalEvents]);

    // 2. Prepare bulk calls
    const contracts = useMemo(() => {
        if (totalEvents === 0 || !userAddress) return [];
        const calls = [];

        // Push checks for each event
        for (const id of eventIds) {
            // Check Ticket
            calls.push({
                address: CONTRACTS.eventFactory,
                abi: EVENT_FACTORY_ABI,
                functionName: 'hasUserTicket',
                args: [id, userAddress]
            });
            // Check POAP (hasCheckedIn)
            calls.push({
                address: CONTRACTS.eventFactory,
                abi: EVENT_FACTORY_ABI,
                functionName: 'hasUserCheckedIn',
                args: [id, userAddress]
            });
            // Get Event Details
            calls.push({
                address: CONTRACTS.eventFactory,
                abi: EVENT_FACTORY_ABI,
                functionName: 'getEventDetails',
                args: [id]
            });
        }
        return calls;
    }, [totalEvents, userAddress, eventIds]);

    // 3. Execute bulk reads
    // @ts-ignore
    const { data: results, isLoading } = useReadContracts({
        contracts,
        query: {
            enabled: contracts.length > 0 && !!userAddress
        }
    });

    // 4. Parse results
    const collection = useMemo(() => {
        if (!results || results.length === 0) return { tickets: [], poaps: [] };

        const tickets = [];
        const poaps = [];

        // Each event has 3 calls: Ticket, CheckIn, Details
        for (let i = 0; i < totalEvents; i++) {
            const baseIdx = i * 3;
            // Handle potentially undefined results if calls fail partially
            const hasTicket = results[baseIdx]?.status === 'success' ? (results[baseIdx].result as unknown as boolean) : false;
            const hasCheckedIn = results[baseIdx + 1]?.status === 'success' ? (results[baseIdx + 1].result as unknown as boolean) : false;
            const details = results[baseIdx + 2]?.status === 'success' ? results[baseIdx + 2].result as any : null;

            if (details) {
                const eventData = {
                    id: i,
                    eventName: details[0],
                    description: details[1],
                    location: details[2],
                    image: details[3],
                    badgeImage: details[4], // New field
                    eventDate: new Date(Number(details[5]) * 1000).toISOString(), // Shifted index
                };

                if (hasTicket) {
                    tickets.push({
                        ...eventData,
                        ticketId: `#${i.toString().padStart(4, '0')}`,
                        eventId: i,
                        used: hasCheckedIn
                    });
                }

                if (hasCheckedIn) {
                    poaps.push({
                        id: i,
                        eventName: details[0],
                        date: new Date(Number(details[5]) * 1000).toISOString(), // Shifted index
                        image: details[4] || details[3], // Prefer badgeImage, fallback to eventImage
                        tokenId: i,
                    });
                }
            }
        }

        return { tickets, poaps };
    }, [results, totalEvents]);

    return {
        tickets: collection.tickets,
        poaps: collection.poaps,
        isLoading: isLoading && totalEvents > 0,
    };
}

export function useTokenAllowance(tokenAddress: `0x${string}`, owner: `0x${string}`, spender: `0x${string}`) {
    const result = useReadContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [owner, spender],
        query: {
            enabled: !!owner && !!spender && !!tokenAddress,
        }
    });

    return {
        allowance: result.data || BigInt(0),
        isLoading: result.isLoading,
        refetch: result.refetch,
    };
}

export function useApproveToken() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const approve = async (tokenAddress: `0x${string}`, spender: `0x${string}`, amount: bigint) => {
        writeContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [spender, amount],
        });
    };

    return {
        approve,
        isLoading: isPending || isConfirming,
        isSuccess,
        error,
        txHash: hash,
    };
}

// ==================== GOVERNANCE HOOKS ====================

export function useCreateProposal() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const createProposal = async (description: string, recipient: string, amountInIDRX: number) => {
        writeContract({
            address: CONTRACTS.eventTreasury,
            abi: EVENT_TREASURY_ABI,
            functionName: 'createProposal',
            args: [
                description,
                recipient as `0x${string}`,
                parseEther(amountInIDRX.toString())
            ],
        });
    };

    return {
        createProposal,
        isLoading: isPending || isConfirming,
        isSuccess,
        error,
        txHash: hash,
    };
}

export function useVote() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const vote = async (proposalId: number, support: boolean) => {
        writeContract({
            address: CONTRACTS.eventTreasury,
            abi: EVENT_TREASURY_ABI,
            functionName: 'vote',
            args: [BigInt(proposalId), support],
        });
    };

    return {
        vote,
        isLoading: isPending || isConfirming,
        isSuccess,
        error,
        txHash: hash,
    };
}

export function useWithdrawOrganizerBalance() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const withdraw = async () => {
        writeContract({
            address: CONTRACTS.eventTreasury,
            abi: EVENT_TREASURY_ABI,
            functionName: 'withdrawOrganizerBalance',
            args: [],
        });
    };

    return {
        withdraw,
        isLoading: isPending || isConfirming,
        isSuccess,
        error,
        txHash: hash,
    };
}

export function useOrganizerBalance(address?: `0x${string}`) {
    const result = useReadContract({
        address: CONTRACTS.eventTreasury,
        abi: EVENT_TREASURY_ABI,
        functionName: 'organizerBalances',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    return {
        balance: result.data ? result.data : BigInt(0),
        isLoading: result.isLoading,
        error: result.error,
        refetch: result.refetch,
    };
}

export function useTreasuryBalance() {
    const result = useReadContract({
        address: CONTRACTS.eventTreasury,
        abi: EVENT_TREASURY_ABI,
        functionName: 'getTreasuryBalance',
    });

    return {
        balance: result.data ? result.data : BigInt(0),
        isLoading: result.isLoading,
        error: result.error,
    };
}

export function useAllProposals() {
    const { data: countData } = useReadContract({
        address: CONTRACTS.eventTreasury,
        abi: EVENT_TREASURY_ABI,
        functionName: 'proposalCount',
    });

    const proposalCount = countData ? Number(countData) : 0;

    const proposalIds = useMemo(() => {
        if (!proposalCount) return [];
        // Proposal IDs start from 1
        return Array.from({ length: proposalCount }, (_, i) => BigInt(i + 1));
    }, [proposalCount]);

    const contracts = useMemo(() => {
        return proposalIds.map(id => ({
            address: CONTRACTS.eventTreasury,
            abi: EVENT_TREASURY_ABI,
            functionName: 'getProposal',
            args: [id]
        }));
    }, [proposalIds]);

    // @ts-ignore
    const { data: results, isLoading } = useReadContracts({
        contracts,
        query: {
            enabled: proposalIds.length > 0
        }
    });

    const proposals = useMemo(() => {
        if (!results) return [];

        return results
            .map((res: any, index: number) => {
                if (res.status !== 'success' || !res.result) return null;
                const p = res.result;
                // [proposer, description, recipient, amount, votesFor, votesAgainst, deadline, executed, cancelled]
                return {
                    id: Number(proposalIds[index]),
                    proposer: p[0],
                    description: p[1],
                    recipient: p[2],
                    amount: p[3],
                    votesFor: p[4],
                    votesAgainst: p[5],
                    deadline: new Date(Number(p[6]) * 1000),
                    executed: p[7],
                    cancelled: p[8],
                };
            })
            .filter((p: any) => p !== null)
            .reverse(); // Show newest first
    }, [results, proposalIds]);

    return {
        proposals,
        isLoading: isLoading && proposalCount > 0,
        refetch: () => { /* React Query handles refetch automatically on window focus usually, but can expose refetch from useReadContract if needed */ }
    };
}

export { CONTRACTS };
