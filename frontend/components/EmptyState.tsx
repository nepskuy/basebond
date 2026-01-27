// Empty State Component with Illustrations
'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-6"
        >
            <div className="relative mb-8">
                {/* Animated background circles */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-[#14279B]/20 to-[#5C7AEA]/20 rounded-full blur-2xl"
                />

                <div className="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                    <Icon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
            </div>

            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
                {description}
            </p>

            {(actionLabel && (actionHref || onAction)) && (
                actionHref ? (
                    <a
                        href={actionHref}
                        className="px-8 py-3 rounded-xl font-semibold text-white hover:shadow-lg hover:scale-105 transition-all"
                        style={{ background: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)' }}
                    >
                        {actionLabel}
                    </a>
                ) : (
                    <button
                        onClick={onAction}
                        className="px-8 py-3 rounded-xl font-semibold text-white hover:shadow-lg hover:scale-105 transition-all"
                        style={{ background: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)' }}
                    >
                        {actionLabel}
                    </button>
                )
            )}
        </motion.div>
    );
}
