// Custom Error Page - Runtime Error Boundary
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E6E6E6] to-white dark:from-gray-900 dark:to-gray-950 px-4">
            <div className="max-w-2xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Error Icon */}
                    <motion.div
                        className="relative mb-8 inline-flex"
                        animate={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div
                            className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl"
                            style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)' }}
                        >
                            <AlertTriangle className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute inset-0 blur-3xl opacity-30" style={{
                            background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
                        }} />
                    </motion.div>

                    {/* Message */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        Oops! Something went wrong
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                        We encountered an unexpected error. Don't worry, our team has been notified.
                    </p>

                    {/* Error Details (Development) */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-left">
                            <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
                                {error.message}
                            </p>
                            {error.digest && (
                                <p className="text-xs font-mono text-red-500 dark:text-red-500 mt-2">
                                    Digest: {error.digest}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <button
                            onClick={reset}
                            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)' }}
                        >
                            <RefreshCw className="w-5 h-5" />
                            Try Again
                        </button>
                        <a
                            href="/"
                            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-900 dark:text-white"
                        >
                            <Home className="w-5 h-5" />
                            Back to Home
                        </a>
                    </div>

                    {/* Help Section */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                            Need Help?
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            If this problem persists, try refreshing the page or clearing your browser cache.
                            You can also reach out to our support team.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
