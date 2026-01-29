'use client';

import { motion } from 'framer-motion';
import CustomNavbar from '@/components/CustomNavbar';
import CustomFooter from '@/components/CustomFooter';

export default function TermsOfService() {
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
                        Terms of Service
                    </h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Last Updated: {new Date().toLocaleDateString()}
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                By accessing or using BaseBond, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. Blockchain Risks</h2>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-xl mb-4">
                                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                                    Warning: Using blockchain technology involves significant risks.
                                </p>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                You acknowledge and accept that:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mt-2">
                                <li>Transactions on the blockchain are irreversible.</li>
                                <li>We do not control the Base Protocol or any other underlying blockchain network.</li>
                                <li>You are solely responsible for securing your wallet seed phrase and private keys.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. User Conduct</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                You agree not to use BaseBond for any illegal purpose or in any way that violates these Terms. You are responsible for all actions taken with your connected wallet.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. Intellectual Property</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                All content, trademarks, and code associated with BaseBond are the property of BaseBond or its licensors. You may not copy or frame our content without permission.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5. Disclaimer of Warranties</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                BaseBond is provided "as is" and "as available" without any warranties of any kind. We do not guarantee that the service will be uninterrupted or error-free.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">6. Limitation of Liability</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                To the fullest extent permitted by law, BaseBond shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>

            <CustomFooter />
        </div>
    );
}
