'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    darkTheme,
    lightTheme,
} from '@rainbow-me/rainbowkit';
import {
    baseSepolia,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, State } from 'wagmi';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider, useTheme } from 'next-themes';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { config } from './config';

const queryClient = new QueryClient();

// Inner component that has access to theme context
function InnerProviders({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        // Suppress benign warnings in development
        if (process.env.NODE_ENV === 'development') {
            const originalWarn = console.warn;
            const originalError = console.error;

            console.warn = (...args) => {
                if (
                    typeof args[0] === 'string' &&
                    (args[0].includes('WalletConnect Core is already initialized') ||
                        args[0].includes('Multiple versions of Lit loaded'))
                ) {
                    return;
                }
                originalWarn(...args);
            };

            console.error = (...args) => {
                if (
                    typeof args[0] === 'string' &&
                    (args[0].includes('WalletConnect Core is already initialized'))
                ) {
                    return;
                }
                originalError(...args);
            };
        }
    }, []);

    // Determine OnchainKit mode based on next-themes
    const ockMode = mounted ? (resolvedTheme === 'dark' ? 'dark' : 'light') : 'light';

    return (
        <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={baseSepolia}
            config={{
                appearance: {
                    mode: ockMode as 'light' | 'dark',
                    theme: 'default',
                },
                wallet: {
                    display: 'modal',
                },
            }}
        >
            <RainbowKitProvider
                theme={resolvedTheme === 'dark' ? darkTheme() : lightTheme()}
                initialChain={baseSepolia}
            >
                <ToastProvider>
                    {children}
                </ToastProvider>
            </RainbowKitProvider>
        </OnchainKitProvider>
    );
}

export function Providers({ children, initialState }: { children: React.ReactNode, initialState?: State }) {
    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <InnerProviders>
                        {children}
                    </InnerProviders>
                </ThemeProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

