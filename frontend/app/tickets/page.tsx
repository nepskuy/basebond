'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import CustomNavbar from '@/components/CustomNavbar';
import CustomFooter from '@/components/CustomFooter';
import { useProfileCollection } from '@/hooks/useContracts';
import {
    Ticket,
    Award,
    Calendar,
    MapPin,
    ArrowRight,
    QrCode,
    Loader2,
    Search,
    Clock,
    CheckCircle
} from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import Link from 'next/link';
import TicketQR from '@/components/TicketQR';
import WalletWrapper from '@/components/WalletWrapper';

export default function MyTicketsPage() {
    const { address, isConnected } = useAccount();
    const { tickets, poaps, isLoading } = useProfileCollection(address);
    const [activeTab, setActiveTab] = useState<'tickets' | 'poaps'>('tickets');
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

    const gradientColors = {
        primary: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)',
        poap: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 50%, #A78BFA 100%)',
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#E6E6E6] to-white dark:from-gray-900 dark:to-gray-950 flex flex-col">
                <CustomNavbar />
                <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-24 h-24 mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-pulse">
                        <Ticket className="w-12 h-12 text-gray-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Connect Wallet</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                        Please connect your wallet to view your purchased tickets and earned badges.
                    </p>
                    <WalletWrapper className="!px-8 !py-3 !text-lg" text="Connect Wallet" />
                </main>
                <CustomFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E6E6E6] to-white dark:from-gray-900 dark:to-gray-950 flex flex-col">
            <CustomNavbar />

            <main className="container mx-auto px-4 py-8 flex-1">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My Collection</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your tickets and view your earned POAP badges
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-1 rounded-xl flex gap-1 border border-white/20 dark:border-white/10">
                        <button
                            onClick={() => setActiveTab('tickets')}
                            className={`px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all duration-300 ${activeTab === 'tickets'
                                ? 'bg-white dark:bg-gray-900 shadow-md text-[#14279B] dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            <Ticket className="w-4 h-4" />
                            Tickets
                            <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">
                                {tickets?.length || 0}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('poaps')}
                            className={`px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all duration-300 ${activeTab === 'poaps'
                                ? 'bg-white dark:bg-gray-900 shadow-md text-purple-600 dark:text-purple-400'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            <Award className="w-4 h-4" />
                            Badges (POAPs)
                            <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">
                                {poaps?.length || 0}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* TICKETS TAB */}
                        {activeTab === 'tickets' && (
                            <>
                                {tickets.length === 0 ? (
                                    <div className="text-center py-20 bg-white/40 dark:bg-gray-900/40 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                            <Ticket className="w-10 h-10 text-blue-400" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">No Tickets Found</h3>
                                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                                            You haven't purchased any tickets yet. Explore upcoming events on BaseBond!
                                        </p>
                                        <Link
                                            href="/explore"
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-transform hover:scale-105"
                                            style={{ background: gradientColors.primary }}
                                        >
                                            Explore Events
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {tickets.map((ticket, idx) => (
                                            <Tilt key={idx} tiltMaxAngleX={3} tiltMaxAngleY={3} glareEnable={true} glareMaxOpacity={0.1}>
                                                <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 group hover:border-blue-500/30 transition-all h-full flex flex-col">
                                                    {/* Image Header */}
                                                    <div className="relative h-48 overflow-hidden">
                                                        <img
                                                            src={ticket.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'}
                                                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${new Date(ticket.eventDate) < new Date() ? 'grayscale' : ''
                                                                }`}
                                                            alt={ticket.eventName}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                                                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                                            <div>
                                                                <span className="inline-block px-2 py-1 rounded bg-blue-600 text-white text-[10px] font-bold tracking-wider mb-2">
                                                                    TICKET {ticket.ticketId}
                                                                </span>
                                                                <h3 className="text-white font-bold text-lg leading-tight line-clamp-1">
                                                                    {ticket.eventName}
                                                                </h3>
                                                            </div>
                                                        </div>

                                                        {ticket.used ? (
                                                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500/80 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3" />
                                                                Used
                                                            </div>
                                                        ) : new Date(ticket.eventDate) < new Date() ? (
                                                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gray-500/80 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                Expired
                                                            </div>
                                                        ) : null}
                                                    </div>

                                                    {/* Details */}
                                                    <div className="p-5 flex-1 flex flex-col">
                                                        <div className="space-y-3 mb-6 flex-1">
                                                            <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                                <Calendar className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
                                                                <span>{formatDate(ticket.eventDate)}</span>
                                                            </div>
                                                            <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                                <MapPin className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
                                                                <span className="line-clamp-1">{ticket.location}</span>
                                                            </div>
                                                        </div>

                                                        {/* Action */}
                                                        <button
                                                            onClick={() => setSelectedTicket(ticket)}
                                                            disabled={new Date(ticket.eventDate) < new Date() && !ticket.used} // Allow viewing used/expired just for history, or disable completely? User asked for "gabisa di apa2in" but "ada historynya".
                                                            // Interpretation: They want to see it but not act on it. So disable the button or change text.
                                                            className={`w-full py-3 rounded-xl font-semibold border-2 transition-all flex items-center justify-center gap-2 ${new Date(ticket.eventDate) < new Date()
                                                                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                                                                : 'border-[#14279B]/10 dark:border-blue-500/20 text-[#14279B] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                                                }`}
                                                        >
                                                            {new Date(ticket.eventDate) < new Date() ? (
                                                                <>
                                                                    <Clock className="w-4 h-4" />
                                                                    Event Ended
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <QrCode className="w-4 h-4" />
                                                                    Show QR Code
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </Tilt>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* POAPS TAB */}
                        {activeTab === 'poaps' && (
                            <>
                                {poaps.length === 0 ? (
                                    <div className="text-center py-20 bg-white/40 dark:bg-gray-900/40 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                                            <Award className="w-10 h-10 text-purple-400" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">No Badges Yet</h3>
                                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                                            Attend events and check-in to earn exclusive soulbound badges!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {poaps.map((poap, idx) => (
                                            <Tilt key={idx} tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.2}>
                                                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/30 text-center relative overflow-hidden group">
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />

                                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full p-1 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                                                        <img
                                                            src={poap.image || 'https://via.placeholder.com/150'}
                                                            className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-800"
                                                            alt="POAP Badge"
                                                        />
                                                    </div>

                                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                                                        {poap.eventName}
                                                    </h3>
                                                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-3">
                                                        ATTENDED
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(poap.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </Tilt>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </main>

            {/* Ticket Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => setSelectedTicket(null)}>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold mb-1">{selectedTicket.eventName}</h3>
                            <p className="text-sm text-gray-500">Scan at entrance</p>
                        </div>

                        <div className="flex justify-center mb-6">
                            <TicketQR
                                ticketId={selectedTicket.ticketId}
                                walletAddress={address || ''}
                                eventId={selectedTicket.eventId}
                            />
                        </div>

                        <button
                            onClick={() => setSelectedTicket(null)}
                            className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <CustomFooter />
        </div>
    );
}
