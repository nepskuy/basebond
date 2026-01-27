'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from '@/app/loading';

export default function DelayedPageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    // Reset loading state on mount (every route change triggers a remount of template)
    useEffect(() => {
        setIsLoading(true); // Ensure it starts true
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // 1.5s delay

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative w-full min-h-screen">
            {/* The Actual Page Content */}
            {/* We render it immediately but hide it or animate it in behind the loader */}
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{
                    opacity: isLoading ? 0 : 1,
                    y: isLoading ? 10 : 0,
                    scale: isLoading ? 0.98 : 1
                }}
                transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.1
                }}
                className="relative z-0"
            >
                {children}
            </motion.div>

            {/* The Loading Overlay */}
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="loader"
                        className="fixed inset-0 z-[9999]"
                        initial={{ opacity: 1 }}
                        exit={{
                            opacity: 0,
                            scale: 1.05,
                            filter: 'blur(10px)'
                        }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Loading />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
