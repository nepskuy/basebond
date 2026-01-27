// Filter & Sort Component for Events
'use client';

import { useState } from 'react';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type SortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc' | 'popular';
export type FilterOptions = {
    category?: string;
    priceRange?: 'free' | 'paid' | 'all';
    status?: 'upcoming' | 'ongoing' | 'past' | 'all';
};

interface EventFilterProps {
    onSortChange: (sort: SortOption) => void;
    onFilterChange: (filters: FilterOptions) => void;
    currentSort: SortOption;
    currentFilters: FilterOptions;
}

export default function EventFilter({
    onSortChange,
    onFilterChange,
    currentSort,
    currentFilters
}: EventFilterProps) {
    const [showFilters, setShowFilters] = useState(false);

    const sortOptions: { value: SortOption; label: string }[] = [
        { value: 'date-asc', label: 'Date: Earliest First' },
        { value: 'date-desc', label: 'Date: Latest First' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'popular', label: 'Most Popular' },
    ];

    const categories = ['Conference', 'Workshop', 'Meetup', 'Hackathon', 'Networking', 'Other'];

    return (
        <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Sort Dropdown */}
                <select
                    value={currentSort}
                    onChange={(e) => onSortChange(e.target.value as SortOption)}
                    className="px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#5C7AEA] transition-all outline-none"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Filter Toggle Button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#5C7AEA] transition-all"
                >
                    <Filter className="w-4 h-4" />
                    <span className="font-medium">Filters</span>
                    {Object.keys(currentFilters).length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#14279B] text-white text-xs">
                            {Object.keys(currentFilters).length}
                        </span>
                    )}
                </button>

                {/* Clear Filters */}
                {Object.keys(currentFilters).length > 0 && (
                    <button
                        onClick={() => onFilterChange({})}
                        className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                        <X className="w-4 h-4" />
                        Clear All
                    </button>
                )}
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 space-y-6">
                            {/* Price Range */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Price Range
                                </h3>
                                <div className="flex gap-2">
                                    {['all', 'free', 'paid'].map((price) => (
                                        <button
                                            key={price}
                                            onClick={() =>
                                                onFilterChange({
                                                    ...currentFilters,
                                                    priceRange: price as any
                                                })
                                            }
                                            className={`px-4 py-2 rounded-xl font-medium transition-all ${currentFilters.priceRange === price
                                                    ? 'text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                            style={
                                                currentFilters.priceRange === price
                                                    ? { background: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)' }
                                                    : {}
                                            }
                                        >
                                            {price.charAt(0).toUpperCase() + price.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <h3 className="font-semibold mb-3">Event Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['all', 'upcoming', 'ongoing', 'past'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() =>
                                                onFilterChange({
                                                    ...currentFilters,
                                                    status: status as any
                                                })
                                            }
                                            className={`px-4 py-2 rounded-xl font-medium transition-all ${currentFilters.status === status
                                                    ? 'text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                            style={
                                                currentFilters.status === status
                                                    ? { background: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)' }
                                                    : {}
                                            }
                                        >
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Categories */}
                            <div>
                                <h3 className="font-semibold mb-3">Category</h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() =>
                                                onFilterChange({
                                                    ...currentFilters,
                                                    category: currentFilters.category === category ? undefined : category
                                                })
                                            }
                                            className={`px-4 py-2 rounded-xl font-medium transition-all ${currentFilters.category === category
                                                    ? 'text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                            style={
                                                currentFilters.category === category
                                                    ? { background: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)' }
                                                    : {}
                                            }
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
