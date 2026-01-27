# BaseBond 🛡️

**BaseBond** is an onchain event engagement protocol built on **Base**. It bridges the gap between event organizers and attendees using blockchain technology, offering NFT ticketing, Proof-of-Attendance (POAP), and community loyalty rewards (IDRX).

## 🚀 Hackathon Features (Base Track)
We have integrated key **Base** technologies to provide a seamless "Superchain" experience:

- **🛡️ OnchainKit Identity**: Full integration of `<Identity>`, `<Avatar>`, and `<Name>` components to resolve and display Basenames and ENS avatars natively.
- **🔑 Smart Wallet Ready**: Optimized for Coinbase Smart Wallet (Passkeys) to allow specialized onboarding for new crypto users.
- **🔵 Base Native**: Deployed and tested on **Base Sepolia / Base Mainnet**.
- **💰 IDRX Integration**: Leveraging IDRX stablecoin for payments and rewards.

## 🛠 Tech Stack
- **Frontend**: Next.js 15, TailwindCSS, OnchainKit, RainbowKit, Wagmi.
- **Smart Contracts**: Hardhat, Solidity (EventTreasury, TicketNFT, LoyaltyStaking).
- **Chain**: Base Sepolia (Testnet).

## 🏁 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
# or
bun install
```

### 2. Environment Setup
Create a `.env.local` file in `frontend/` (or check `.env.local`):
```env
NEXT_PUBLIC_PROJECT_ID="your_walletconnect_project_id"
NEXT_PUBLIC_ONCHAINKIT_API_KEY="your_onchainkit_api_key"
```

### 3. Run Development Server
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000).

## 📜 Smart Contracts
- **EventTreasury**: [See on Blockscout/Basescan](CHANGE_TO_REAL_LINK)
- **TicketNFT**: [See on Blockscout/Basescan](CHANGE_TO_REAL_LINK)

## 🎥 Demo Video
[Link to Demo Video] (Add your Loom/YouTube link here)
