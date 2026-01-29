'use client';

import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import TransactionModal from './TransactionModal';
import { Ticket, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { useTokenAllowance, useApproveToken } from '@/hooks/useContracts';
import { parseEther } from 'viem';

// IDRX Token Address (should be from env or constants, assuming env context or hardcoded if needed)
// For now, fetching from same source as hooks.
const IDRX_ADDRESS = (process.env.NEXT_PUBLIC_IDRX_ADDRESS || '0x0') as `0x${string}`;

interface BuyTicketTransactionProps {
    eventId: number;
    eventFactoryAddress: `0x${string}`;
    ticketPrice: number; // New Prop
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    disabled?: boolean;
}

export default function BuyTicketTransaction({
    eventId,
    eventFactoryAddress,
    ticketPrice,
    onSuccess,
    onError,
    disabled = false,
}: BuyTicketTransactionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { address, isConnected } = useAccount();

    // 1. Check Allowance
    const { allowance, isLoading: isAllowanceLoading, refetch: refetchAllowance } = useTokenAllowance(
        IDRX_ADDRESS,
        address as `0x${string}`,
        eventFactoryAddress
    );

    // 2. Approve Hook
    const {
        approve,
        isLoading: isApproveProcessing,
        isSuccess: isApproveSuccess,
        error: approveError,
        txHash: approveHash
    } = useApproveToken();

    // 3. Buy Ticket Hook
    const {
        data: buyHash,
        error: buyError,
        isPending: isBuyPending,
        writeContractAsync
    } = useWriteContract();

    // 4. Wait for Buy Receipt
    const {
        isLoading: isBuyConfirming,
        isSuccess: isBuyConfirmed,
        error: buyReceiptError
    } = useWaitForTransactionReceipt({
        hash: buyHash,
    });

    const isProcessing = isBuyPending || isBuyConfirming || isApproveProcessing;
    const priceWei = parseEther(ticketPrice.toString());
    const needsApproval = ticketPrice > 0 && allowance < priceWei;

    // Effect: If approval succeeds, refetch allowance (UI update)
    useEffect(() => {
        if (isApproveSuccess) {
            refetchAllowance();
            // Optional: Auto-trigger buy? Better let user click "Buy" for safety/clarity.
            Swal.fire({
                icon: 'success',
                title: 'Approved!',
                text: 'You can now proceed to buy the ticket.',
                timer: 2000,
                showConfirmButton: false
            });
        }
    }, [isApproveSuccess, refetchAllowance]);


    const handleApprove = async () => {
        if (!isConnected) return;
        try {
            // Approve exact amount or max uint256? Exact is safer.
            await approve(IDRX_ADDRESS, eventFactoryAddress, priceWei);
        } catch (e) {
            console.error(e);
        }
    };

    const handleBuy = async () => {
        if (!isConnected) {
            Swal.fire({
                icon: 'warning',
                title: 'Wallet Not Connected',
                text: 'Please connect your wallet to buy a ticket.',
                confirmButtonColor: '#14279B',
            });
            return;
        }

        try {
            setIsModalOpen(true);
            await writeContractAsync({
                address: eventFactoryAddress,
                abi: [
                    {
                        name: 'buyTicket',
                        type: 'function',
                        stateMutability: 'payable',
                        inputs: [{ name: 'eventId', type: 'uint256' }],
                        outputs: []
                    }
                ],
                functionName: 'buyTicket',
                args: [BigInt(eventId)],
                value: BigInt(0),
            });
        } catch (err: any) {
            console.error("Mint failed", err);
            if (err.code === 4001 || err.cause?.code === 4001 || err.message?.includes('User rejected')) {
                setIsModalOpen(false);
                return;
            }
        }
    };

    const handleClick = () => {
        if (needsApproval) {
            handleApprove();
        } else {
            handleBuy();
        }
    };

    // Effect to handle success/error callbacks for BUY
    useEffect(() => {
        if (isBuyConfirmed) {
            onSuccess?.();
        }
        if (buyError || buyReceiptError) {
            onError?.(buyError || buyReceiptError || new Error('Transaction failed'));
        }
    }, [isBuyConfirmed, buyError, buyReceiptError, onSuccess, onError]);

    const getModalStatus = () => {
        if (buyError || buyReceiptError) return 'error';
        if (isBuyConfirmed) return 'success';
        return 'pending';
    };

    const getModalMessage = () => {
        // @ts-ignore
        if (buyError) {
            // @ts-ignore
            if (buyError.cause?.code === 4001 || buyError.message?.includes('User rejected')) return "Transaction cancelled.";
            return buyError.message;
        }
        if (buyReceiptError) return buyReceiptError.message;
        if (isBuyConfirmed) return "NFT Ticket minted successfully! Check your profile.";
        if (isBuyPending) return "Please confirm the transaction in your wallet...";
        if (isBuyConfirming) return "Transaction submitted. Waiting for confirmation...";
        return "";
    };

    // Button Text & State
    const getButtonText = () => {
        if (isProcessing) {
            if (isApproveProcessing) return "Approving IDRX...";
            return "Processing...";
        }
        if (needsApproval) return "Approve IDRX";
        return "Get NFT Ticket";
    };

    return (
        <div className="w-full">
            <button
                onClick={handleClick}
                disabled={disabled || isProcessing || isAllowanceLoading}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2
                    ${needsApproval ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gradient-to-r from-[#14279B] via-[#3D56B2] to-[#5C7AEA] hover:scale-[1.02]'}
                `}
            >
                {isProcessing || isAllowanceLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {getButtonText()}
                    </>
                ) : (
                    <>
                        {needsApproval ? <CheckCircle className="w-5 h-5" /> : <Ticket className="w-5 h-5" />}
                        {getButtonText()}
                        {!needsApproval && <ArrowRight className="w-5 h-5" />}
                    </>
                )}
            </button>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                status={getModalStatus()}
                txHash={buyHash}
                message={getModalMessage()}
            />
        </div>
    );
}
