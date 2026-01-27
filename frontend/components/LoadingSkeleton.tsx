// Loading Skeleton Component for Cards
'use client';

export function EventCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-700" />
            <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                <div className="flex gap-2 mt-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                </div>
            </div>
        </div>
    );
}

export function TicketCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
            <div className="h-40 bg-gray-200 dark:bg-gray-700" />
            <div className="p-6 space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                </div>
            </div>
        </div>
    );
}
