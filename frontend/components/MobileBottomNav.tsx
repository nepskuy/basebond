// Mobile Bottom Navigation Component
'use client';

import { usePathname } from 'next/navigation';
import { Home, Calendar, Plus, User, Vote } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileBottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { href: '/', icon: Home, label: 'Home' },
        { href: '/explore', icon: Calendar, label: 'Events' },
        { href: '/create', icon: Plus, label: 'Create' },
        { href: '/community', icon: Vote, label: 'Voice' },
        { href: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <a
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center flex-1 h-full"
                        >
                            <div className="relative">
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -inset-2 rounded-xl"
                                        style={{
                                            background: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)',
                                            opacity: 0.1
                                        }}
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <Icon
                                    className={`w-6 h-6 transition-colors ${isActive
                                        ? 'text-[#14279B] dark:text-blue-400'
                                        : 'text-gray-400 dark:text-gray-500'
                                        }`}
                                />
                            </div>
                            <span
                                className={`text-xs mt-1 font-medium transition-colors ${isActive
                                    ? 'text-[#14279B] dark:text-blue-400'
                                    : 'text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                {item.label}
                            </span>
                        </a>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
