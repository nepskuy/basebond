# BaseBond

**BaseBond** is a decentralized event ticketing platform built on **Base**, enabling organizers to create events, sell NFT tickets, and reward attendees with onchain loyalty points (IDRX) and POAPs.

Built for the **Base Hackathon**, featuring deep integration with **OnchainKit**.

## Features

- **Onchain Identity**: Seamless login with **Smart Wallets** (Passkeys) and full **Basename** resolution using OnchainKit's Identity components.
- **NFT Ticketing**: Tickets are minted as NFTs, visible in your wallet.
- **Gasless-ready UX**: Optimized for Base's low-cost environment.
- **Loyalty Rewards**: Automatic ERC-20 token rewards for attendees.
- **Proof of Attendance**: Soulbound POAP minting on check-in.

## Tech Stack

- **Frontend**: Next.js 15, TailwindCSS, Framer Motion
- **Web3 Integration**: [OnchainKit](https://onchainkit.xyz), Wagmi, Viem, RainbowKit
- **Chain**: **Base Sepolia** (Testnet) & Base Mainnet

## Getting Started

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/nepskuy/basebond.git
    cd basebond/frontend
    ```

2.  **Install dependencies**:
    ```bash
    bun install
    ```

3.  **Environment Setup**:
    Copy `.env.local.example` to `.env.local` and add your keys:
    ```bash
    NEXT_PUBLIC_ONCHAINKIT_API_KEY="your_coinbase_cdp_key"
    NEXT_PUBLIC_PROJECT_ID="your_walletconnect_id"
    ```

4.  **Run Locally**:
    ```bash
    bun run dev
    ```

## Smart Contracts (Base Sepolia)

- **EventFactory**: `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9`
- **TicketNFT**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **IDRX Token**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

## Demo Video

[Link to your Loom/YouTube Demo Video Here]

---
*Built with passion on Base*
