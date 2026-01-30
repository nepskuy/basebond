# BaseBond

**BaseBond** is an onchain event engagement protocol built on **Base**. It bridges the gap between event organizers and attendees using blockchain technology, offering NFT ticketing, Proof-of-Attendance (POAP), and community loyalty rewards (IDRX).

## Hackathon Features (Base Track)
We have integrated key Base technologies to provide a seamless "Superchain" experience:

- **OnchainKit Identity**: Full integration of Identity, Avatar, and Name components to resolve and display Basenames and ENS avatars natively.
- **Smart Wallet Ready**: Optimized for Coinbase Smart Wallet (Passkeys) to allow specialized onboarding for new crypto users.
- **Base Native**: Deployed and tested on Base Sepolia.
- **IDRX Integration**: Leveraging IDRX stablecoin for payments and rewards.

## Tech Stack
- **Frontend**: Next.js 15, TailwindCSS, OnchainKit, RainbowKit, Wagmi.
- **Smart Contracts**: Hardhat/Foundry, Solidity (EventFactory, EventTreasury, TicketNFT, LoyaltyStaking).
- **Chain**: Base Sepolia (Testnet).

## Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
# or
bun install
```

### 2. Environment Setup
Create a `.env.local` file in `frontend/` with the following variables:
```env
NEXT_PUBLIC_PROJECT_ID="your_walletconnect_project_id"
NEXT_PUBLIC_ONCHAINKIT_API_KEY="your_onchainkit_api_key"
```

### 3. Run Development Server
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000).

## Smart Contracts Deployment (Base Sepolia)
All contracts are verified on Base Sepolia Testnet:

- **EventFactory**: [0x0035c54c7180f32e16C5dBFa9251e019587FC141](https://sepolia.basescan.org/address/0x0035c54c7180f32e16C5dBFa9251e019587FC141)
- **EventTreasury**: [0x6641aB2ccef5a940F17811Ba14412c48a9f50e09](https://sepolia.basescan.org/address/0x6641aB2ccef5a940F17811Ba14412c48a9f50e09)
- **TicketNFT**: [0x6b6e09AbE6e3250b82f835b35569E04c3aCb8d4D](https://sepolia.basescan.org/address/0x6b6e09AbE6e3250b82f835b35569E04c3aCb8d4D)
- **EventPOAP**: [0xdDCe44fF978870463c7222194aA90345D9b05EEc](https://sepolia.basescan.org/address/0xdDCe44fF978870463c7222194aA90345D9b05EEc)
- **LoyaltyStaking**: [0x7921d7d107E7d13d9Cf937209e50233986843200](https://sepolia.basescan.org/address/0x7921d7d107E7d13d9Cf937209e50233986843200)

## Demo Video
[Watch Demo Video](https://youtu.be/0Duzi9dlob8)
