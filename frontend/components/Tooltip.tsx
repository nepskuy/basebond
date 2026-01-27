// Tooltip Component
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ content, children, position = 'top' }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            let x = 0;
            let y = 0;

            switch (position) {
                case 'top':
                    x = rect.left + rect.width / 2 + scrollX;
                    y = rect.top + scrollY - 10;
                    break;
                case 'bottom':
                    x = rect.left + rect.width / 2 + scrollX;
                    y = rect.bottom + scrollY + 10;
                    break;
                case 'left':
                    x = rect.left + scrollX - 10;
                    y = rect.top + rect.height / 2 + scrollY;
                    break;
                case 'right':
                    x = rect.right + scrollX + 10;
                    y = rect.top + rect.height / 2 + scrollY;
                    break;
            }

            setCoords({ x, y });
        }
    }, [isVisible, position]);

    const getTransformOrigin = () => {
        switch (position) {
            case 'top': return 'bottom center';
            case 'bottom': return 'top center';
            case 'left': return 'right center';
            case 'right': return 'left center';
        }
    };

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="inline-block"
            >
                {children}
            </div>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="fixed z-[9999] pointer-events-none"
                        style={{
                            left: coords.x,
                            top: coords.y,
                            transformOrigin: getTransformOrigin(),
                            transform: position === 'top' || position === 'bottom'
                                ? 'translateX(-50%)'
                                : 'translateY(-50%)'
                        }}
                    >
                        <div className="px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg shadow-xl whitespace-nowrap max-w-xs">
                            {content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
