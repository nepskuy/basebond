'use client';

import React, { useState, useMemo } from 'react';
import CustomNavbar from '@/components/CustomNavbar';
import WalletWrapper from '@/components/WalletWrapper';
import CustomFooter from '@/components/CustomFooter';
import AnimatedCounter from '@/components/AnimatedCounter';
import EmptyState from '@/components/EmptyState';
import { StatCardSkeleton } from '@/components/LoadingSkeleton';
import {
    Calendar, Users, Ticket, DollarSign, TrendingUp,
    QrCode, Award, Settings, Plus, Eye,
    CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { useMyEvents, useCheckIn } from '@/hooks/useContracts';
import { formatEther } from 'viem';

export default function DashboardPage() {
    const { address } = useAccount();
    const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'checkin'>('overview');

    // Check-in State
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [attendeeAddress, setAttendeeAddress] = useState('');
    const [checkInStatus, setCheckInStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Fetch real events owned by this user
    const { events: myEvents, isLoading: isEventsLoading } = useMyEvents(address);

    // Contract Hooks
    const { checkIn, isLoading: isCheckInLoading, isSuccess: isCheckInSuccess, error: checkInError } = useCheckIn();

    // Calculate Stats
    const stats = useMemo(() => {
        if (!myEvents) return { totalEvents: 0, totalAttendees: 0, totalRevenue: 0, totalPOAPs: 0 };

        const totalEvents = myEvents.length;
        // Basic stats aggregation
        const totalAttendees = myEvents.reduce((acc, curr) => acc + (curr.soldTickets || 0), 0);

        // Revenue estimation (rough)
        // Warning: precision loss if we sum formatted strings, but here we just sum sold count for now
        // Or if we want revenue we need Check info.
        // Assuming price is constant per event.
        // Total IDRX potential revenue?
        // Let's keep it simple.

        return {
            totalEvents,
            totalAttendees: totalAttendees,
            totalRevenue: 0, // Placeholder as we shouldn't sum BigInts loosely here without proper handling
            totalPOAPs: totalAttendees, // 1 POAP per attendee check-in ideal
        };
    }, [myEvents]);

    const handleCheckIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setCheckInStatus('idle');

        if (!selectedEventId || !attendeeAddress) return;

        try {
            await checkIn(Number(selectedEventId), attendeeAddress);
        } catch (err) {
            console.error(err);
            setCheckInStatus('error');
        }
    };

    // Watch for success
    React.useEffect(() => {
        if (isCheckInSuccess) {
            setCheckInStatus('success');
            setAttendeeAddress(''); // Reset input
        }
    }, [isCheckInSuccess]);

    const gradientColors = {
        primary: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)',
    };

    if (!address) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <CustomNavbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl transition-all duration-300 text-center max-w-md w-full">
                        <div
                            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
                            style={{ background: gradientColors.primary }}
                        >
                            <Users className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Connect your wallet to manage events and track real-time attendance.
                        </p>

                        <div className="flex justify-center">
                            <WalletWrapper
                                text="Connect Organizer Wallet"
                                className="w-full justify-center"
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

            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <div id="dashboard-header" className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Organizer Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your events and track engagement
                        </p>
                    </div>
                    <a
                        id="create-event-btn"
                        href="/create"
                        className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105"
                        style={{ background: gradientColors.primary }}
                    >
                        <Plus className="w-5 h-5" />
                        Create Event
                    </a>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {[
                        { id: 'overview', label: 'Overview', icon: TrendingUp },
                        { id: 'events', label: 'My Events', icon: Calendar },
                        { id: 'checkin', label: 'Check-in Tool', icon: QrCode },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-300 border-b-2 -mb-[2px] whitespace-nowrap ${activeTab === tab.id
                                ? 'border-[#14279B] text-[#14279B] dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: Calendar, label: 'My Events', value: stats.totalEvents, color: '#14279B' },
                                { icon: Users, label: 'Tickets Sold', value: stats.totalAttendees, color: '#3D56B2' },
                                { icon: DollarSign, label: 'Revenue', value: '-', color: '#5C7AEA' }, // Placeholder
                                { icon: Award, label: 'Possible POAPs', value: stats.totalPOAPs, color: '#7C3AED' },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                        style={{ backgroundColor: `${stat.color}15` }}
                                    >
                                        <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                                    </div>
                                    <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                            <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Note on Dashboard</h3>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                                The dashboard now pulls data directly from your Organizer history on-chain. Revenue stats will require The Graph integration for historical transfers.
                            </p>
                        </div>
                    </div>
                )}

                {/* Events Tab */}
                {activeTab === 'events' && (
                    <div id="events-list" className="space-y-6">
                        {isEventsLoading ? (
                            <div className="text-center py-10">Loading events...</div>
                        ) : myEvents.length === 0 ? (
                            <EmptyState
                                icon={Calendar}
                                title="No Events Created"
                                description="You haven't created any events yet. Start by creating your first event and share it with your community!"
                                actionLabel="Create Your First Event"
                                actionHref="/create"
                            />
                        ) : (
                            myEvents.map(event => (
                                <div
                                    key={event.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                        {/* Image thumbnail if available */}
                                        {event.imageUri ? (
                                            <div className="w-full lg:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                                                <img src={event.imageUri} alt={event.name} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-full lg:w-32 h-32 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                                <Calendar className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold">{event.name}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${event.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {event.isActive ? 'Active' : 'Ended'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {event.date ? event.date.toLocaleDateString() : 'TBA'}
                                                </span>
                                                {/* Note: Price is likely 0 or IDRX amount */}
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    {event.price && BigInt(event.price) > BigInt(0) ? `${formatEther(event.price)} IDRX` : 'Free'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {event.soldTickets}/{event.maxTickets} Sold
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <a
                                                href={`/event/${event.id}`}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </a>
                                            {event.isActive && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedEventId(event.id.toString());
                                                        setActiveTab('checkin');
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all duration-300 hover:scale-105"
                                                    style={{ background: gradientColors.primary }}
                                                >
                                                    <QrCode className="w-4 h-4" />
                                                    Check-in Tool
                                                </button>
                                            )}
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 transition-colors">
                                                <Settings className="w-4 h-4" />
                                                Manage
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-500">Ticket Sales</span>
                                            <span className="font-medium">{event.maxTickets > 0 ? Math.round((event.soldTickets / event.maxTickets) * 100) : 0}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${event.maxTickets > 0 ? (event.soldTickets / event.maxTickets) * 100 : 0}%`,
                                                    background: gradientColors.primary
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Check-in Tab */}
                {activeTab === 'checkin' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                            <div className="text-center mb-8">
                                <div
                                    className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20"
                                >
                                    <QrCode className="w-10 h-10 text-[#14279B] dark:text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Check-in Attendee</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Manually validate tickets by entering attendee wallet address.
                                    (QR Scanning requires 'react-qr-reader' dependency)
                                </p>
                            </div>

                            <form onSubmit={handleCheckIn} className="space-y-6">
                                {/* Event Selector */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Select Event
                                    </label>
                                    <select
                                        value={selectedEventId}
                                        onChange={(e) => setSelectedEventId(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-[#5C7AEA] transition-all duration-300 outline-none"
                                        required
                                    >
                                        <option value="">-- Choose an event --</option>
                                        {myEvents.map(event => (
                                            <option key={event.id} value={event.id}>{event.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Address Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Attendee Wallet Address
                                    </label>
                                    <input
                                        type="text"
                                        value={attendeeAddress}
                                        onChange={(e) => setAttendeeAddress(e.target.value)}
                                        placeholder="0x..."
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-[#5C7AEA] transition-all duration-300 outline-none font-mono"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Scan the QR code on the user's ticket to get this address.
                                    </p>
                                </div>

                                {/* Status Messages */}
                                {checkInStatus === 'success' && (
                                    <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold">Check-in Successful!</p>
                                            <p className="text-sm">Attendance recorded and rewards distributed.</p>
                                        </div>
                                    </div>
                                )}
                                {checkInStatus === 'error' && (
                                    <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold">Check-in Failed</p>
                                            <p className="text-sm">Please check if the wallet has a valid ticket or try again.</p>
                                        </div>
                                    </div>
                                )}

                                {checkInError && (
                                    <div className="bg-red-50 text-red-700 p-4 rounded-xl">
                                        <p className="text-sm">Error: {checkInError.message}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={!selectedEventId || !attendeeAddress || isCheckInLoading}
                                    className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ background: gradientColors.primary }}
                                >
                                    {isCheckInLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing on-chain...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Confirm Check-in
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <CustomFooter />
        </div>
    );
}
