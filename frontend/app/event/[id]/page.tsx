'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import CustomNavbar from '@/components/CustomNavbar';
import CustomFooter from '@/components/CustomFooter';
import TicketQR from '@/components/TicketQR';
import Confetti from '@/components/Confetti';
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    Ticket,
    Share2,
    Heart,
    Award,
    ArrowRight,
    CheckCircle,
    ExternalLink,
} from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { useAccount } from 'wagmi';
import { formatUnits, encodeFunctionData } from 'viem';
import {
    Transaction,
    TransactionButton,
    TransactionStatus,
    TransactionStatusLabel,
    TransactionStatusAction,
    TransactionToast,
    TransactionToastIcon,
    TransactionToastLabel,
    TransactionToastAction
} from '@coinbase/onchainkit/transaction';
import {
    useBuyTicket,
    useEventDetails,
    useTokenAllowance,
    useApproveToken,
    CONTRACTS,
    ERC20_ABI,
    EVENT_FACTORY_ABI
} from '@/hooks/useContracts';
import TransactionModal from '@/components/TransactionModal';
import { useToast } from '@/context/ToastContext';
import WalletWrapper from '@/components/WalletWrapper';

export default function EventDetailPage() {
    const params = useParams();
    const eventIdParam = params.id as string;
    const eventIdNumber = useMemo(
        () => Number(eventIdParam || 0),
        [eventIdParam],
    );

    const [hasPurchased, setHasPurchased] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const [showConfetti, setShowConfetti] = useState(false);
    const { showToast } = useToast();
    const { address } = useAccount();
    const { event, isLoading: isEventLoading, error: eventError } = useEventDetails(eventIdNumber);
    const {
        buyTicket,
        isLoading: isPurchasing,
        isSuccess: isPurchaseSuccess,
        error: purchaseError,
        txHash,
    } = useBuyTicket();

    const {
        allowance,
        refetch: refetchAllowance
    } = useTokenAllowance(
        CONTRACTS.idrxToken,
        address as `0x${string}`,
        CONTRACTS.eventFactory
    );

    const {
        approve,
        isLoading: isApproving,
        isSuccess: isApproveSuccess,
        error: approveError
    } = useApproveToken();

    const gradientColors = {
        primary: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)',
    };

    const effectiveEventName = event?.name ?? 'Loading Event...';

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handlePurchase = async () => {
        if (!address) {
            showToast('Connection Required', 'error', 'Please connect your wallet first.');
            return;
        }

        if (eventIdNumber === undefined || Number.isNaN(eventIdNumber)) {
            showToast('Invalid Event', 'error', 'Event ID is invalid.');
            return;
        }

        if (!event) return;

        try {
            // Check allowance
            const price = BigInt(event.price);
            if (price > BigInt(0)) {
                if (allowance < price) {
                    await approve(CONTRACTS.idrxToken, CONTRACTS.eventFactory, price);
                    return; // Wait for approval tx
                }
            }

            // If approved or free, buy
            await buyTicket(eventIdNumber);
        } catch (err) {
            console.error('Failed to buy ticket', err);
            showToast('Failed to process transaction', 'error', 'Please try again.');
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: effectiveEventName,
                text: (event?.description || 'Check out this event on BaseBond!').slice(0, 100),
                url: window.location.href,
            }).catch(() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link Copied', 'info', 'Event link copied to clipboard.');
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            showToast('Link Copied', 'info', 'Event link copied to clipboard.');
        }
    };

    useEffect(() => {
        if (purchaseError) {
            showToast('Transaction Failed', 'error', purchaseError.message);
        }
    }, [purchaseError, showToast]);

    useEffect(() => {
        if (approveError) {
            showToast('Authorization Failed', 'error', approveError.message);
        }
    }, [approveError, showToast]);

    useEffect(() => {
        if (isApproveSuccess) {
            refetchAllowance();
        }
    }, [isApproveSuccess, refetchAllowance]);

    useEffect(() => {
        if (eventError) {
            showToast('Error Loading Event', 'error', eventError.message);
        }
    }, [eventError, showToast]);

    useEffect(() => {
        if (isPurchaseSuccess) {
            setHasPurchased(true);
            const explorerUrl = txHash ? `https://basescan.org/tx/${txHash}` : undefined;
            showToast('Ticket Purchased!', 'success', explorerUrl ? 'View on BaseScan (Check clipboard)' : 'Welcome to the event!');
            if (explorerUrl) {
                navigator.clipboard.writeText(explorerUrl);
            }
        }
    }, [isPurchaseSuccess, txHash, showToast]);

    const onchainPriceLabel = useMemo(() => {
        if (!event) return null;
        try {
            const formatted = formatUnits(event.price, 18);
            const asNumber = parseFloat(formatted);
            if (asNumber === 0) return 'FREE';
            return `${asNumber.toLocaleString('id-ID')} IDRX`;
        } catch {
            return `${event.price.toString()} IDRX`;
        }
    }, [event]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E6E6E6] to-white dark:from-gray-900 dark:to-gray-950 flex flex-col">
            <Confetti trigger={showConfetti} />
            <CustomNavbar />

            <main className="flex-grow pb-40">
                {/* Hero Image */}
                <div id="event-hero" className="relative h-[40vh] md:h-[50vh]">
                    <img
                        src={event?.imageUri || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200"}
                        alt={effectiveEventName}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Actions */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${isLiked
                                ? 'bg-red-500 text-white'
                                : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        </button>

                        {/* Warpcast Share */}

                        {/* Warpcast Share */}
                        <a
                            href={`https://warpcast.com/~/compose?text=Check out ${encodeURIComponent(effectiveEventName)} on BaseBond! 🛡️🔵&embeds[]=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full bg-[#4C2A9B]/80 backdrop-blur-md text-white hover:bg-[#4C2A9B] transition-all duration-300"
                            title="Share on Warpcast"
                        >
                            <img src="/base-logo-in-button.png" className="w-5 h-5 hidden" alt="Base" /> {/* Placeholder/Hack */}
                            <div className="w-5 h-5 flex items-center justify-center font-bold">W</div>
                        </a>

                        <button
                            onClick={handleShare}
                            className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all duration-300"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Event Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <div className="container mx-auto">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span
                                    className="px-3 py-1 rounded-full text-sm bg-white/20 backdrop-blur-md text-white"
                                >
                                    On-Chain Event
                                </span>
                                {BigInt(event?.price || 0) === BigInt(0) && (
                                    <span className="px-3 py-1 rounded-full text-sm bg-green-500/80 backdrop-blur-md text-white">
                                        Free
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                                {effectiveEventName}
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Event Details */}
                            <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} glareEnable={true} glareMaxOpacity={0.1}>
                                <div id="event-info" className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-[#14279B]/10 dark:bg-blue-900/20">
                                                <Calendar className="w-6 h-6 text-[#14279B] dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Date</p>
                                                <p className="font-semibold">
                                                    {event
                                                        ? formatDate(event.date)
                                                        : 'Loading...'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-[#14279B]/10 dark:bg-blue-900/20">
                                                <Clock className="w-6 h-6 text-[#14279B] dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Time</p>
                                                <p className="font-semibold">
                                                    {event
                                                        ? event.date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                                                        : 'Loading...'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-[#14279B]/10 dark:bg-blue-900/20">
                                                <MapPin className="w-6 h-6 text-[#14279B] dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Location</p>
                                                <p className="font-semibold">{event?.location || 'Loading...'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-[#14279B]/10 dark:bg-blue-900/20">
                                                <Users className="w-6 h-6 text-[#14279B] dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Attendees</p>
                                                <p className="font-semibold">
                                                    {event?.soldTickets ?? 0} / {event?.maxTickets ?? 0}
                                                </p>
                                                <div className="w-32 h-2 mt-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${event ? (event.soldTickets / event.maxTickets) * 100 : 0}%`,
                                                            background: gradientColors.primary,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold mb-4">About This Event</h2>
                                    <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            {event?.description || 'Loading event description...'}
                                        </p>
                                    </div>
                                </div>
                            </Tilt>

                            {/* Benefits */}
                            <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} glareEnable={true} glareMaxOpacity={0.1}>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-xl font-bold mb-6">What You Get</h2>
                                    <div className="space-y-4">
                                        {[
                                            'NFT Ticket with unique artwork',
                                            'Exclusive POAP on check-in',
                                            'IDRX loyalty points reward',
                                            'Access to post-event community'
                                        ].map((benefit, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {benefit}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Tilt>

                            {/* Organizer */}
                            <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} glareEnable={true} glareMaxOpacity={0.1}>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-xl font-bold mb-4">Organizer</h2>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                                            style={{ background: gradientColors.primary }}
                                        >
                                            {event?.organizer?.slice(0, 2) || 'OR'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-xs md:text-base">
                                                    {event?.organizer || 'Loading...'}
                                                </p>
                                                <CheckCircle className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <p className="text-sm text-gray-500 font-mono">
                                                Verified Organizer
                                            </p>
                                        </div>
                                        <a
                                            href={`https://sepolia.basescan.org/address/${event?.organizer}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-auto p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <ExternalLink className="w-5 h-5 text-gray-500" />
                                        </a>
                                    </div>
                                </div>
                            </Tilt>

                        </div>

                        {/* Sidebar - Ticket Purchase */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Purchase Card */}
                                <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} glareEnable={true} glareMaxOpacity={0.2}>
                                    <div id="ticket-purchase" className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-500">Price</span>
                                            <span
                                                className="text-3xl font-bold"
                                                style={{ color: '#14279B' }}
                                            >
                                                {onchainPriceLabel ?? '...'}
                                            </span>
                                        </div>
                                        {isEventLoading && (
                                            <p className="text-xs text-gray-500 mb-4">
                                                Loading onchain event details...
                                            </p>
                                        )}

                                        {!hasPurchased ? (
                                            <>
                                                {/* OnchainKit Transaction Component */}
                                                {!address ? (
                                                    <div className="w-full">
                                                        <WalletWrapper
                                                            className="w-full justify-center py-4 rounded-xl font-semibold !text-white"
                                                            text="Connect Wallet to Buy"
                                                        />
                                                    </div>
                                                ) : (
                                                    <Transaction
                                                        chainId={84532} // Base Sepolia
                                                        calls={async () => {
                                                            if (!event) return [];
                                                            const price = BigInt(event.price);
                                                            const txs = [];
                                                            // Checks allowance
                                                            if (price > BigInt(0) && allowance < price) {
                                                                txs.push({
                                                                    to: CONTRACTS.idrxToken,
                                                                    data: encodeFunctionData({
                                                                        abi: ERC20_ABI,
                                                                        functionName: 'approve',
                                                                        args: [CONTRACTS.eventFactory, price]
                                                                    })
                                                                });
                                                            }
                                                            // Buy Ticket
                                                            txs.push({
                                                                to: CONTRACTS.eventFactory,
                                                                data: encodeFunctionData({
                                                                    abi: EVENT_FACTORY_ABI,
                                                                    functionName: 'buyTicket',
                                                                    args: [BigInt(eventIdNumber)]
                                                                })
                                                            });
                                                            return txs;
                                                        }}
                                                        onStatus={(status) => {
                                                            // Status handled internally by OnchainKit
                                                        }}
                                                        onSuccess={(response) => {
                                                            setHasPurchased(true); // Optimization: Optimistic update
                                                            setShowConfetti(true);
                                                            showToast('Ticket Purchased!', 'success', 'Welcome to the event!');
                                                        }}
                                                    >
                                                        <TransactionButton
                                                            className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                                                            text={
                                                                allowance < BigInt(event?.price || 0) && BigInt(event?.price || 0) > BigInt(0)
                                                                    ? "Approve & Buy Ticket"
                                                                    : "Get NFT Ticket"
                                                            }
                                                        />
                                                        <TransactionStatus>
                                                            <TransactionStatusLabel />
                                                            <TransactionStatusAction />
                                                        </TransactionStatus>
                                                        <TransactionToast>
                                                            <TransactionToastIcon />
                                                            <TransactionToastLabel />
                                                            <TransactionToastAction />
                                                        </TransactionToast>
                                                    </Transaction>
                                                )}

                                                <p className="text-center text-sm text-gray-500 mt-4">
                                                    {(event?.maxTickets || 0) - (event?.soldTickets || 0)} tickets
                                                    remaining
                                                </p>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                                </div>
                                                <p className="font-semibold text-green-600 mb-2">
                                                    Ticket Purchased!
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Show the QR code below at check-in
                                                </p>
                                            </div>
                                        )}


                                    </div>
                                </Tilt>

                                {/* QR Code (shown after purchase) */}
                                {hasPurchased && (
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                        <h3 className="text-lg font-bold mb-4 text-center">
                                            Your Ticket QR
                                        </h3>
                                        <div className="bg-white p-4 rounded-xl flex justify-center">
                                            <TicketQR
                                                eventId={eventIdParam}
                                                ticketId="1" // Placeholder ticket ID, real one from on-chain event later
                                                walletAddress={address || ''}
                                                eventName={effectiveEventName}
                                                size={200}
                                            />
                                        </div>
                                        <p className="text-center text-sm text-gray-500 mt-4">
                                            Scan this at the venue to check-in and receive your POAP
                                        </p>
                                    </div>
                                )}

                                {/* Rewards Info */}
                                <div id="event-rewards" className="bg-gradient-to-r from-[#14279B]/10 to-[#5C7AEA]/10 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-[#5C7AEA]/20 dark:border-blue-700/30">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Award className="w-8 h-8 text-[#14279B] dark:text-blue-400" />
                                        <div>
                                            <p className="font-semibold">Onchain Rewards</p>
                                            <p className="text-sm text-gray-600">
                                                For attending this event
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl">
                                            <span className="text-sm">POAP Badge</span>
                                            <span className="font-semibold text-purple-600">
                                                Soulbound NFT
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl">
                                            <span className="text-sm">Loyalty Points</span>
                                            <span className="font-semibold text-green-600">
                                                +100 IDRX
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spacer to force footer down */}
                <div className="h-32 w-full" />
            </main>

            <div className="relative z-50 mt-auto">
                <CustomFooter />
            </div>
        </div>
    );
}
