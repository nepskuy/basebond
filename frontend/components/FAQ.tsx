'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqData = [
    {
        question: "What is BaseBond?",
        answer: "BaseBond is a decentralized event ticketing platform built on Base Sepolia Testnet. It allows organizers to create events, sell NFT tickets, and reward attendees with loyalty points and POAPs, all with instant settlement in IDRX or USDC."
    },
    {
        question: "Is this real money?",
        answer: "No, this is currently running on **Base Sepolia Testnet**. All transactions use test tokens (Testnet ETH and Mock IDRX). You can get free tokens from the 'Get Free IDRX' button in the navbar to try out the app without spending real money."
    },
    {
        question: "How do I get free tickets?",
        answer: "You can find events marked as 'Free' in the Explore page. For paid events, you'll need Mock IDRX tokens. Simply connect your wallet, click 'Get Free IDRX' in the menu, and approve the transaction to receive 100,000 IDRX for testing."
    },
    {
        question: "What are Loyalty Points?",
        answer: "When you check in to an event, you earn Loyalty Points. These points are staked automatically to earn more over time. In the future, these points can be redeemed for exclusive perks, discounts, or special event access."
    },
    {
        question: "Do I need a special wallet?",
        answer: "We support all major wallets like MetaMask, Coinbase Wallet, and Rainbow. You'll need to switch your network to **Base Sepolia** to interact with the platform. If you're on the wrong network, the app will prompt you to switch automatically."
    }
];

const FAQItem = ({ item, index }: { item: { question: string, answer: string }, index: number }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b border-gray-200 dark:border-gray-800 last:border-0"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    {item.question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400 group-hover:text-primary-600"
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                            {item.answer.split('**').map((part, i) =>
                                i % 2 === 1 ? <strong key={i} className="text-gray-900 dark:text-white">{part}</strong> : part
                            )}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function FAQ() {
    return (
        <section className="py-20 relative z-10">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-primary-600 mb-4">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Everything you need to know about the BaseBond Hackathon build.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800">
                    {faqData.map((item, index) => (
                        <FAQItem key={index} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
