// Breadcrumb Navigation Component
'use client';

import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
    const pathname = usePathname();

    // Generate breadcrumb items from pathname
    const pathSegments = pathname.split('/').filter(Boolean);

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        ...pathSegments.map((segment, index) => {
            const href = '/' + pathSegments.slice(0, index + 1).join('/');
            const label = segment
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            return { label, href };
        })
    ];

    // Don't show breadcrumb on home page
    if (pathname === '/') return null;

    return (
        <nav className="flex items-center gap-2 text-sm mb-6 overflow-x-auto">
            {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;

                return (
                    <div key={item.href} className="flex items-center gap-2 whitespace-nowrap">
                        {index === 0 ? (
                            <a
                                href={item.href}
                                className="flex items-center gap-1 text-gray-500 hover:text-[#14279B] transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                <span>{item.label}</span>
                            </a>
                        ) : (
                            <>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                {isLast ? (
                                    <span className="font-semibold text-[#14279B] dark:text-blue-400">
                                        {item.label}
                                    </span>
                                ) : (
                                    <a
                                        href={item.href}
                                        className="text-gray-500 hover:text-[#14279B] transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                )}
                            </>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
