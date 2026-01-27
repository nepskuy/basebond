'use client';

import React, { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { usePathname } from 'next/navigation';
import { tourSteps } from '@/config/tourSteps';
import { HelpCircle } from 'lucide-react';

export default function TourGuide() {
    const pathname = usePathname();
    const [hasTour, setHasTour] = useState(false);

    useEffect(() => {
        // Find matching steps: Exact match OR Dynamic match (e.g. /event/1 matches /event/*)
        const match = Object.keys(tourSteps).find(key => {
            if (key === pathname) return true;
            if (key.endsWith('/*') && pathname.startsWith(key.replace('/*', ''))) return true;
            return false;
        });

        setHasTour(!!match);
    }, [pathname]);

    const startTour = () => {
        const matchKey = Object.keys(tourSteps).find(key => {
            if (key === pathname) return true;
            if (key.endsWith('/*') && pathname.startsWith(key.replace('/*', ''))) return true;
            return false;
        });

        const steps = matchKey ? tourSteps[matchKey] : [];
        if (!steps || steps.length === 0) return;

        const driverObj = driver({
            showProgress: true,
            steps: steps,
            popoverClass: 'driverjs-theme',
            stagePadding: 8,
            animate: true,
            // Allow closing by clicking outside or pressing ESC, modern UX doesn't block exits
            allowClose: true,
            nextBtnText: 'Next →',
            prevBtnText: '← Back',
            doneBtnText: 'Finish',
            onDestroyStarted: () => {
                driverObj.destroy();
            },
        });

        driverObj.drive();
    };

    if (!hasTour) return null;

    return (
        <button
            onClick={startTour}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            title="Start Page Tour"
        >
            <HelpCircle className="w-5 h-5" />
        </button>
    );
}
