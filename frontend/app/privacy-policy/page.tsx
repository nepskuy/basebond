'use client';

import { motion } from 'framer-motion';
import CustomNavbar from '@/components/CustomNavbar';
import CustomFooter from '@/components/CustomFooter';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E6E6E6] to-white dark:from-gray-900 dark:to-gray-950">
            <CustomNavbar />

            <main className="container mx-auto px-4 py-20 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-[#14279B] to-[#5C7AEA]">
                        Privacy Policy
                    </h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Last Updated: {new Date().toLocaleDateString()}
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">1. Introduction</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                BaseBond ("we," "our," or "us") respects your privacy. This Privacy Policy outlines how we handle your information when you access our decentralized application (dApp) and services. As a Web3 platform, we prioritize user anonymity and decentralization.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. Data We Collect</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                We collect minimal data necessary for the operation of the dApp:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                                <li><strong>Wallet Address:</strong> We process your public wallet address to facilitate transactions and identify your account on the blockchain.</li>
                                <li><strong>Transaction Data:</strong> Public blockchain data related to your interactions with our smart contracts is visible on the blockchain.</li>
                                <li><strong>Usage Data:</strong> We may collect anonymous analytics to improve our service performance.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. How We Use Your Data</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Your data is used solely to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                                <li>Facilitate blockchain transactions.</li>
                                <li>Display your event history and tickets.</li>
                                <li>Improve the performance and security of our dApp.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. Third-Party Services</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                We may use third-party services such as RPC providers, IPFS gateways, and wallet connectors. These services have their own privacy policies which you should review.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5. Changes to This Policy</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the date at the top of this policy.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">6. Contact Us</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                If you have any questions about this Privacy Policy, please contact us through our official community channels or support email.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>

            <CustomFooter />
        </div>
    );
}
