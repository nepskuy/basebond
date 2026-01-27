// Transaction Status Modal
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, XCircle, ExternalLink } from 'lucide-react';

interface TransactionModalProps {
    isOpen: boolean;
    status: 'pending' | 'success' | 'error';
    txHash?: string;
    message?: string;
    onClose: () => void;
}

export default function TransactionModal({
    isOpen,
    status,
    txHash,
    message,
    onClose
}: TransactionModalProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'pending':
                return {
                    icon: <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />,
                    title: 'Transaction Pending',
                    description: 'Please wait while your transaction is being processed...',
                    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                    borderColor: 'border-blue-200 dark:border-blue-800'
                };
            case 'success':
                return {
                    icon: <CheckCircle className="w-16 h-16 text-green-500" />,
                    title: 'Transaction Successful!',
                    description: message || 'Your transaction has been confirmed on the blockchain.',
                    bgColor: 'bg-green-50 dark:bg-green-900/20',
                    borderColor: 'border-green-200 dark:border-green-800'
                };
            case 'error':
                return {
                    icon: <XCircle className="w-16 h-16 text-red-500" />,
                    title: 'Transaction Failed',
                    description: message || 'Something went wrong. Please try again.',
                    bgColor: 'bg-red-50 dark:bg-red-900/20',
                    borderColor: 'border-red-200 dark:border-red-800'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={status !== 'pending' ? onClose : undefined}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 ${config.borderColor}`}
                    >
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                {config.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{config.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {config.description}
                            </p>

                            {txHash && (
                                <a
                                    href={`https://sepolia.basescan.org/tx/${txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[#14279B] dark:text-blue-400 hover:underline mb-6"
                                >
                                    View on BaseScan
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}

                            {status !== 'pending' && (
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 rounded-xl font-semibold text-white hover:shadow-lg transition-all"
                                    style={{ background: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)' }}
                                >
                                    Close
                                </button>
                            )}

                            {status === 'pending' && (
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
