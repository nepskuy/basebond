// Custom 404 Not Found Page
'use client';

import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';
import CustomNavbar from '@/components/CustomNavbar';
import CustomFooter from '@/components/CustomFooter';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E6E6E6] to-white dark:from-gray-900 dark:to-gray-950">
            <CustomNavbar />

            <main className="container mx-auto px-4 py-20">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* 404 Number */}
                        <div className="relative mb-8">
                            <h1
                                className="text-[150px] md:text-[200px] font-extrabold leading-none"
                                style={{
                                    background: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}
                            >
                                404
                            </h1>
                            <div className="absolute inset-0 blur-3xl opacity-20" style={{
                                background: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)'
                            }} />
                        </div>

                        {/* Message */}
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            Page Not Found
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
                            The page you're looking for doesn't exist or has been moved.
                            Let's get you back on track!
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/"
                                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white hover:shadow-lg hover:scale-105 transition-all"
                                style={{ background: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)' }}
                            >
                                <Home className="w-5 h-5" />
                                Back to Home
                            </a>
                            <a
                                href="/explore"
                                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                            >
                                <Search className="w-5 h-5" />
                                Explore Events
                            </a>
                        </div>

                        {/* Suggestions */}
                        <div className="mt-16 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
                                Popular Pages
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { href: '/explore', label: 'Explore Events' },
                                    { href: '/create', label: 'Create Event' },
                                    { href: '/staking', label: 'Staking' },
                                    { href: '/community', label: 'Community Voice' },
                                ].map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <CustomFooter />
        </div>
    );
}
