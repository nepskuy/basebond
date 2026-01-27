'use client';

import { Suspense } from 'react';
import Loading from '@/app/loading';

export default function LoadingCheck({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
    );
}
