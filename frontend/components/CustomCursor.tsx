'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mouse position (Raw values for main cursor, no spring to prevent lag)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring values for the trailing ring (aesthetic lag)
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Only trigger on desktop
        const mediaQuery = window.matchMedia('(pointer: fine)');
        const handleResize = () => setIsVisible(mediaQuery.matches);
        handleResize();
        mediaQuery.addEventListener('change', handleResize);

        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseDown = () => setIsMouseDown(true);
        const handleMouseUp = () => setIsMouseDown(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'INPUT' ||
                target.closest('a') ||
                target.closest('button') ||
                window.getComputedStyle(target).cursor === 'pointer';

            setIsHovering(!!isInteractive);
        };

        // Detect modal/dialog presence
        const checkForModal = () => {
            // Check for common modal/dialog selectors and specific wallet overlays
            const hasModal =
                document.querySelector('[role="dialog"]') ||
                document.querySelector('[role="alertdialog"]') ||
                document.querySelector('.modal') ||
                document.querySelector('[data-radix-portal]') || // RainbowKit uses Radix
                document.querySelector('[data-headlessui-portal]') ||
                document.querySelector('iframe') || // Wallet popups often use iframes
                document.querySelector('[class*="coinbase"]') || // Coinbase specific
                document.querySelector('[id*="cb-"]'); // Coinbase specific

            setIsModalOpen(!!hasModal);
        };

        // Use MutationObserver to detect when modals are added/removed
        const observer = new MutationObserver(checkForModal);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Also check on interval as backup for iframes/shadow DOMs that might not trigger mutation on body immediately
        const interval = setInterval(checkForModal, 500);

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
            mediaQuery.removeEventListener('change', handleResize);
            observer.disconnect();
            clearInterval(interval);
        };
    }, [mouseX, mouseY]);

    // Hide cursor when modal is open OR not visible
    if (!isVisible || isModalOpen) return null;

    return (
        <>
            {/* Global style to hide default cursor */}
            <style jsx global>{`
                body, a, button, input, select, textarea {
                    cursor: none !important;
                }
            `}</style>

            {/* Main Dot - No Spring (Instant response) */}
            <motion.div
                className="fixed top-0 left-0 w-3 h-3 bg-[#14279B] dark:bg-white rounded-full pointer-events-none z-[2147483647]"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: isMouseDown ? 0.8 : 1,
                }}
            />

            {/* Trailing Ring - Spring Animation */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#14279B] dark:border-white pointer-events-none z-[2147483646] opacity-50"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: isHovering ? 2.5 : 1,
                    backgroundColor: isHovering ? 'rgba(20, 39, 155, 0.1)' : 'transparent',
                }}
            />
        </>
    );
}
