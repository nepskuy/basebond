'use client';

import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import TransactionModal from './TransactionModal';
import { Ticket, ArrowRight, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface BuyTicketTransactionProps {
    eventId: number;
    eventFactoryAddress: `0x${string}`;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    disabled?: boolean;
}

export default function BuyTicketTransaction({
    eventId,
    eventFactoryAddress,
    onSuccess,
    onError,
    disabled = false,
}: BuyTicketTransactionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isConnected } = useAccount();

    // Wagmi hooks
    const {
        data: hash,
        error: writeError,
        isPending: isWritePending,
        writeContractAsync
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        error: receiptError
    } = useWaitForTransactionReceipt({
        hash,
    });

    const isProcessing = isWritePending || isConfirming;

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
                value: BigInt(0), // Assuming free or checking allowance separately
            });
        } catch (err: any) {
            console.error("Mint failed", err);
            // Modal stays open to show error if it wasn't a wallet rejection
            if (err.code === 4001 || err.cause?.code === 4001 || err.message?.includes('User rejected')) { // User rejected
                setIsModalOpen(false);
                return;
            }
        }
    };

    // Effect to handle success/error callbacks
    useEffect(() => {
        if (isConfirmed) {
            onSuccess?.();
            // Optional: Close modal automatically after delay? 
            // Better keep it open until user closes or navigates
        }
        if (writeError || receiptError) {
            onError?.(writeError || receiptError || new Error('Transaction failed'));
        }
    }, [isConfirmed, writeError, receiptError, onSuccess, onError]);

    const getModalStatus = () => {
        if (writeError || receiptError) return 'error';
        if (isConfirmed) return 'success';
        return 'pending';
    };

    const getModalMessage = () => {
        // @ts-ignore
        if (writeError) {
            // @ts-ignore
            if (writeError.cause?.code === 4001 || writeError.message?.includes('User rejected')) return "Transaction cancelled.";
            return writeError.message;
        }
        if (receiptError) return receiptError.message;
        if (isConfirmed) return "NFT Ticket minted successfully! Check your profile.";
        if (isWritePending) return "Please confirm the transaction in your wallet...";
        if (isConfirming) return "Transaction submitted. Waiting for confirmation...";
        return "";
    };

    return (
        <div className="w-full">
            <button
                onClick={handleBuy}
                disabled={disabled || isProcessing}
                className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#14279B] via-[#3D56B2] to-[#5C7AEA] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Ticket className="w-5 h-5" />
                        Get NFT Ticket
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                status={getModalStatus()}
                txHash={hash}
                message={getModalMessage()}
            />
        </div>
    );
}
