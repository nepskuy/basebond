'use client';

import React, { useState } from 'react';
import CustomNavbar from '@/components/CustomNavbar';
import CustomFooter from '@/components/CustomFooter';
import EventFilter, { SortOption, FilterOptions } from '@/components/EventFilter';
import SearchBar from '@/components/SearchBar';
import Breadcrumb from '@/components/Breadcrumb';
import EmptyState from '@/components/EmptyState';
import { EventCardSkeleton } from '@/components/LoadingSkeleton';
import { Calendar, MapPin, Users, Ticket, ArrowRight, Clock, Search, Filter } from 'lucide-react';
import { useActiveEvents } from '@/hooks/useContracts';
import Tilt from 'react-parallax-tilt';
import { formatUnits } from 'viem';



export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption>('date-desc');
    const [filters, setFilters] = useState<FilterOptions>({});

    // Fetch live events from blockchain
    const { events: liveEvents, isLoading } = useActiveEvents();

    // Generate mock tags for display purposes since tags are not on-chain
    // In a real app, tags would probably be stored in IPFS metadata or separate mapping
    const getTagsForEvent = (event: any) => {
        const tags = ['Web3', 'Community'];
        if (event.name.toLowerCase().includes('meetup')) tags.push('Meetup');
        if (event.name.toLowerCase().includes('workshop')) tags.push('Workshop');
        if (Number(event.price) === 0) tags.push('Free');
        return tags;
    };

    const enhancedEvents = liveEvents.map(event => ({
        ...event,
        tags: getTagsForEvent(event),
        // Fallbacks for data not returned by list view to keep UI intact
        description: 'Join this amazing event on Base!',
        time: event.date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        maxTickets: 100, // Placeholder
        soldTickets: 0,  // Placeholder
        image: event.imageUri || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    }));

    // Mock events for fallback if no live events (optional, good for demo)
    const displayEvents = enhancedEvents.length > 0 ? enhancedEvents : [];

    const allTags = Array.from(new Set(displayEvents.flatMap(e => e.tags)));

    const filteredEvents = displayEvents.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = !selectedTag || event.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format BigInt price to string
    const formatPrice = (price: bigint | number) => {
        try {
            // Price is stored as 18 decimals on-chain
            // Check if it's already a number or small bigint (mock data)
            // But usually safe to assume if it's from contract it's 10^18
            const formatted = formatUnits(BigInt(price), 18);
            const val = parseFloat(formatted);

            if (val === 0) return 'FREE';
            return `${val.toLocaleString('id-ID')} IDRX`;
        } catch (e) {
            // Fallback
            const val = Number(price);
            if (val === 0) return 'FREE';
            return `${val.toLocaleString('id-ID')} IDRX`;
        }
    };

    const gradientColors = {
        primary: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)',
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E6E6E6] to-white dark:from-gray-900 dark:to-gray-950">
            <CustomNavbar />

            <main className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Discover{' '}
                        <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: gradientColors.primary }}
                        >
                            Upcoming Events
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Find and join exciting events in Indonesia. Secure digital tickets, instant rewards, and community badges.
                    </p>
                </div>

                {isLoading ? (
                    // Skeleton Grid
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                                <div className="p-6 space-y-4">
                                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    <div className="flex gap-2">
                                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                                    </div>
                                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Search & Filter */}
                        <div className="max-w-4xl mx-auto mb-12">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Search */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search events or locations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#5C7AEA] transition-all duration-300 outline-none"
                                    />
                                </div>

                                {/* Filter Tags */}
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                                    <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    <button
                                        onClick={() => setSelectedTag(null)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${!selectedTag
                                            ? 'bg-[#14279B] text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                            }`}
                                    >
                                        All
                                    </button>
                                    {allTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedTag(tag)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${selectedTag === tag
                                                ? 'bg-[#14279B] text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Events Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map(event => (
                                <Tilt
                                    key={event.id}
                                    tiltMaxAngleX={5}
                                    tiltMaxAngleY={5}
                                    glareEnable={true}
                                    glareMaxOpacity={0.3}
                                    scale={1.02}
                                    className="h-full"
                                >
                                    <div
                                        className="h-full group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                                    >
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={event.image}
                                                alt={event.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${Number(event.price) === 0
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-white/90 text-gray-800'
                                                        }`}
                                                >
                                                    {formatPrice(event.price)}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {event.tags.map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 rounded-md text-xs bg-[#14279B]/10 dark:bg-blue-900/20 text-[#14279B] dark:text-blue-400"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <h3 className="text-xl font-bold mb-2 group-hover:text-[#14279B] dark:group-hover:text-blue-400 transition-colors">
                                                {event.name}
                                            </h3>

                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                                {event.description}
                                            </p>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(event.date)}
                                                    <Clock className="w-4 h-4 ml-2" />
                                                    {event.time}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <MapPin className="w-4 h-4" />
                                                    {event.location}
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <a
                                                href={`/event/${event.id}`}
                                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-[1.02]"
                                                style={{ background: gradientColors.primary }}
                                            >
                                                <Ticket className="w-4 h-4" />
                                                Get Ticket
                                                <ArrowRight className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </Tilt>
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredEvents.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <Search className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No events found</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    No events available right now. Be the first to create one!
                                </p>
                                <a
                                    href="/create"
                                    className="inline-block mt-4 px-6 py-2 rounded-lg bg-[#14279B] text-white hover:bg-[#3D56B2] transition-colors"
                                >
                                    Create Event
                                </a>
                            </div>
                        )}
                    </>
                )}
            </main>

            <CustomFooter />
        </div>
    );
}
