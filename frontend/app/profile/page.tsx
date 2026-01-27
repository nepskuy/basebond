'use client';

import React, { useState } from 'react';
import CustomNavbar from '@/components/CustomNavbar';
import WalletWrapper from '@/components/WalletWrapper';
import CustomFooter from '@/components/CustomFooter';
import TicketQR from '@/components/TicketQR';
import EmptyState from '@/components/EmptyState';
import { TicketCardSkeleton } from '@/components/LoadingSkeleton';
import {
    Ticket,
    Award,
    Calendar,
    MapPin,
    ExternalLink,
    AlertCircle,
    User,
    Wallet,
    Copy,
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { base } from 'wagmi/chains';

import Tilt from 'react-parallax-tilt';
import { useProfileCollection } from '@/hooks/useContracts';
import { useToast } from '@/context/ToastContext';

// OnchainKit Identity Components
import { Avatar, Name, Address, Identity, Badge } from '@coinbase/onchainkit/identity';


export default function ProfilePage() {
    const { address, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<'tickets' | 'poaps'>('tickets');
    const { showToast } = useToast();

    const { tickets, poaps, isLoading } = useProfileCollection(address);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

    const handleCopyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            showToast('Copied', 'success', 'Address copied to clipboard');
        }
    };

    const gradientColors = {
        primary: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)',
    };


    if (!isConnected) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <CustomNavbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                    <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center mb-6 mx-auto"
                            style={{ background: gradientColors.primary }}
                        >
                            <Wallet className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
                            Connect Wallet
                        </h1>
                        <p className="text-gray-500 mb-6">
                            Please connect your wallet to view your tickets and POAP collection.
                        </p>
                        <div className="flex justify-center">
                            <WalletWrapper
                                className="justify-center"
                                text="Connect Wallet"
                            />
                        </div>
                    </div>
                </div>
                <CustomFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E6E6E6] to-white dark:from-gray-900 dark:to-gray-950">
            <CustomNavbar />

            <main className="container mx-auto px-4 py-12">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-12 relative overflow-hidden">
                    {/* Modern Clean Header */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-[#F8FAFC] dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                    </div>

                    <div className="relative flex flex-col md:flex-row items-end gap-6 pt-12">
                        {/* Avatar Section */}
                        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center z-10">
                            {address ? (
                                <span className="text-4xl font-bold text-white">
                                    {address.slice(2, 4).toUpperCase()}
                                </span>
                            ) : (
                                <User className="w-12 h-12 text-white" />
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="text-center md:text-left mb-2 flex-1 pt-4">
                            {address ? (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {address.slice(0, 6)}...{address.slice(-4)}
                                        </h1>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-gray-500 font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm">
                                            {address}
                                        </p>
                                        <button
                                            onClick={handleCopyAddress}
                                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-[#14279B] dark:hover:text-blue-400 transition-colors"
                                            title="Copy Address"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-2xl font-bold mb-2">My Profile</h1>
                                    <p className="text-gray-500 font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm inline-block">
                                        Not connected
                                    </p>
                                </>
                            )}
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                                <span>
                                    <Ticket className="w-4 h-4 inline mr-1" />
                                    {tickets.length} Tickets
                                </span>
                                <span>
                                    <Award className="w-4 h-4 inline mr-1" />
                                    {poaps.length} POAPs
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800">
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={`px-6 py-4 font-medium text-lg border-b-2 transition-all duration-300 ${activeTab === 'tickets'
                            ? 'border-[#14279B] text-[#14279B] dark:border-blue-400 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        My Tickets
                    </button>
                    <button
                        onClick={() => setActiveTab('poaps')}
                        className={`px-6 py-4 font-medium text-lg border-b-2 transition-all duration-300 ${activeTab === 'poaps'
                            ? 'border-[#14279B] text-[#14279B] dark:border-blue-400 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        POAP Collection
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'tickets' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                Loading your tickets...
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="col-span-full text-center py-20 bg-white dark:bg-gray-800 rounded-3xl">
                                <Ticket className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-xl font-bold mb-2">No Tickets Yet</h3>
                                <p className="text-gray-500 mb-6">You haven't purchased any tickets yet.</p>
                                <a href="/explore" className="px-6 py-3 bg-[#14279B] text-white rounded-xl hover:bg-[#3D56B2] transition">
                                    Explore Events
                                </a>
                            </div>
                        ) : (
                            tickets.map(ticket => (
                                <Tilt key={ticket.id} tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.3} scale={1.02}>
                                    <div
                                        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full"
                                        onClick={() => setSelectedTicket(ticket)}
                                    >
                                        <div className="h-40 relative">
                                            <img
                                                src={ticket.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                                                alt={ticket.eventName}
                                                className={`w-full h-full object-cover transition-all ${ticket.used ? 'grayscale' : ''}`}
                                            />
                                            <div className="absolute top-4 right-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${ticket.used
                                                        ? 'bg-gray-500 text-white'
                                                        : 'bg-green-500 text-white'
                                                        }`}
                                                >
                                                    {ticket.used ? 'Used' : 'Active'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-bold text-lg mb-2 line-clamp-1">{ticket.eventName}</h3>
                                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(ticket.eventDate).toLocaleDateString('id-ID')}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    {ticket.location}
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                                <span className="font-mono text-xs text-gray-500">
                                                    ID: {ticket.ticketId}
                                                </span>
                                                <span className="text-sm font-medium text-[#14279B] dark:text-blue-400">
                                                    View QR
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Tilt>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'poaps' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {isLoading ? (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                Loading your POAPs...
                            </div>
                        ) : poaps.length === 0 ? (
                            <div className="col-span-full text-center py-20 bg-white dark:bg-gray-800 rounded-3xl">
                                <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-xl font-bold mb-2">No POAPs Yet</h3>
                                <p className="text-gray-500 mb-6">Attend events and check-in to earn POAPs!</p>
                            </div>
                        ) : (
                            poaps.map(poap => (
                                <Tilt key={poap.id} tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.4} scale={1.05}>
                                    <div
                                        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg flex flex-col items-center text-center h-full"
                                    >
                                        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-purple-100 dark:border-purple-900/30">
                                            <img
                                                src={poap.image || 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=400'}
                                                alt={poap.eventName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h3 className="font-bold text-sm mb-1">{poap.eventName}</h3>
                                        <p className="text-xs text-gray-500 mb-2">
                                            {new Date(poap.date).toLocaleDateString('id-ID')}
                                        </p>
                                        <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-[10px] rounded-md">
                                            Token ID: #{poap.tokenId}
                                        </span>
                                    </div>
                                </Tilt>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Ticket QR Modal */}
            {selectedTicket && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setSelectedTicket(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedTicket(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-6">
                            <h3 className="font-bold text-xl mb-1">{selectedTicket.eventName}</h3>
                            <p className="text-sm text-gray-500">{selectedTicket.ticketId}</p>
                        </div>

                        <div className="bg-white p-4 rounded-2xl flex justify-center mb-6">
                            <TicketQR
                                eventId={selectedTicket.eventId}
                                ticketId={selectedTicket.ticketId}
                                walletAddress={address || ''}
                                eventName={selectedTicket.eventName}
                                size={200}
                            />
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                            <p className="text-xs text-blue-800 dark:text-blue-300">
                                Show this QR code at the entrance to check in and mint your POAP.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <CustomFooter />
        </div>
    );
}
