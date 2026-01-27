// Network Switch Prompt Component
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useSwitchChain, useChainId } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

interface NetworkSwitchPromptProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NetworkSwitchPrompt({ isOpen, onClose }: NetworkSwitchPromptProps) {
    const { switchChain, isPending } = useSwitchChain();
    const chainId = useChainId();

    const handleSwitch = () => {
        switchChain({ chainId: baseSepolia.id });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-yellow-200 dark:border-yellow-800"
                    >
                        <div className="text-center">
                            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                            </div>

                            <h3 className="text-2xl font-bold mb-3">Wrong Network Detected</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                BaseBond only works on <span className="font-bold text-[#14279B] dark:text-blue-400">Base Sepolia</span> network.
                                Please switch your wallet to continue.
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={handleSwitch}
                                    disabled={isPending}
                                    className="w-full py-3 rounded-xl font-semibold text-white hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    style={{ background: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)' }}
                                >
                                    {isPending ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            Switching...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-5 h-5" />
                                            Switch to Base Sepolia
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={onClose}
                                    className="w-full py-3 rounded-xl font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>

                            <p className="text-xs text-gray-500 mt-4">
                                Chain ID: {baseSepolia.id} • Current: {chainId}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
