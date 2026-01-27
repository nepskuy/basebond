'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    getDefaultWallets,
    getDefaultConfig,
    darkTheme,
    lightTheme,
} from '@rainbow-me/rainbowkit';
import {
    argentWallet,
    trustWallet,
    ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
    base,
    baseSepolia,
    localhost,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, cookieStorage, createStorage } from 'wagmi';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider, useTheme } from 'next-themes';
import { OnchainKitProvider } from '@coinbase/onchainkit';


const { wallets } = getDefaultWallets();

// Use wagmi's localhost chain with correct chain ID for Hardhat
const hardhatChain = {
    ...localhost,
    id: 31337,
    name: 'Hardhat',
} as const;

const config = getDefaultConfig({
    appName: 'BaseBond',
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID || 'YOUR_PROJECT_ID',
    wallets: [
        ...wallets,
        {
            groupName: 'Other',
            wallets: [argentWallet, trustWallet, ledgerWallet],
        },
    ],
    chains: [
        baseSepolia, // Default for Hackathon Demo
        base,
        hardhatChain,
    ],
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
});

const queryClient = new QueryClient();

// Inner component that has access to theme context
function InnerProviders({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
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

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
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

