import { http, createConfig } from 'wagmi';
import {
    base,
    baseSepolia,
    localhost,
} from 'wagmi/chains';
import { cookieStorage, createStorage } from 'wagmi';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

// Use wagmi's localhost chain with correct chain ID for Hardhat
const hardhatChain = {
    ...localhost,
    id: 31337,
    name: 'Hardhat',
} as const;

export const config = createConfig({
    chains: [baseSepolia, base, hardhatChain],
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        [baseSepolia.id]: http(),
        [base.id]: http(),
        [hardhatChain.id]: http(),
    },
    connectors: [
        injected(),
        coinbaseWallet({ appName: 'BaseBond' }),
        walletConnect({ projectId: process.env.NEXT_PUBLIC_PROJECT_ID || 'YOUR_PROJECT_ID' }),
    ],
});
