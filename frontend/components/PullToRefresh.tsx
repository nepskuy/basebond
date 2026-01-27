// Pull to Refresh Component for Mobile
'use client';

import { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isPulling, setIsPulling] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const startY = useRef(0);
    const pullDistance = useMotionValue(0);

    const pullThreshold = 80;
    const maxPull = 120;

    const rotation = useTransform(pullDistance, [0, maxPull], [0, 360]);
    const opacity = useTransform(pullDistance, [0, pullThreshold], [0, 1]);

    const handleTouchStart = (e: TouchEvent) => {
        if (window.scrollY === 0) {
            startY.current = e.touches[0].clientY;
            setIsPulling(true);
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isPulling || isRefreshing) return;

        const currentY = e.touches[0].clientY;
        const distance = Math.min(currentY - startY.current, maxPull);

        if (distance > 0) {
            pullDistance.set(distance);
        }
    };

    const handleTouchEnd = async () => {
        if (!isPulling) return;

        setIsPulling(false);

        if (pullDistance.get() >= pullThreshold && !isRefreshing) {
            setIsRefreshing(true);
            pullDistance.set(pullThreshold);

            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
                pullDistance.set(0);
            }
        } else {
            pullDistance.set(0);
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchmove', handleTouchMove);
        container.addEventListener('touchend', handleTouchEnd);

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isPulling, isRefreshing]);

    return (
        <div ref={containerRef} className="relative">
            {/* Pull Indicator */}
            <motion.div
                className="absolute top-0 left-0 right-0 flex justify-center items-center"
                style={{
                    y: pullDistance,
                    opacity,
                    height: pullThreshold,
                    marginTop: -pullThreshold
                }}
            >
                <motion.div
                    style={{ rotate: isRefreshing ? undefined : rotation }}
                    animate={isRefreshing ? { rotate: 360 } : {}}
                    transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
                >
                    <RefreshCw className="w-6 h-6 text-[#14279B] dark:text-blue-400" />
                </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div style={{ y: isPulling ? pullDistance : 0 }}>
                {children}
            </motion.div>
        </div>
    );
}
