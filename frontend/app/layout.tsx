import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // Updated font
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import '@coinbase/onchainkit/styles.css';
import { Providers } from "./providers";
import CustomCursor from "@/components/CustomCursor";
import ScrollToTop from "@/components/ScrollToTop";
import MobileBottomNav from "@/components/MobileBottomNav";
import ErrorBoundary from "@/components/ErrorBoundary";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { config } from "./config";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

// ... existing metadata ...
export const metadata: Metadata = {
  title: "BaseBond | Event-to-Community Protocol",
  description: "Web3 Event Engagement Platform on Base. Create events, sell NFT tickets, and reward community loyalty.",
  icons: {
    icon: '/Base.jpg',
  },
  openGraph: {
    title: "BaseBond on Base",
    description: "The ultimate Web3 Event Engagement Protocol. Built for the Superchain.",
    url: "https://basebond.vercel.app", // Placeholder
    siteName: "BaseBond",
    images: [
      {
        url: "/Base.jpg", // Ideally a larger OG image
        width: 1200,
        height: 630,
        alt: "BaseBond Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BaseBond | Base Hackathon",
    description: "Join the future of onchain events on Base.",
    images: ["/Base.jpg"],
  },
  manifest: '/manifest.json',
};

import { Suspense } from 'react';
import Loading from './loading';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const initialState = cookieToInitialState(config, headersList.get('cookie'));

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={jakarta.className}>
        <CustomCursor />
        <ScrollToTop />
        <ErrorBoundary>
          <Providers initialState={initialState}>
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
            <MobileBottomNav />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
