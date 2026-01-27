'use client';

import { motion } from 'framer-motion';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

            <div className="relative flex flex-col items-center">

                {/* 1. Pulse Rings */}
                <div className="absolute inset-0 z-0">
                    <motion.div
                        className="w-32 h-32 rounded-full border-2 border-[#14279B]/20 dark:border-blue-500/20"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute inset-0 w-32 h-32 rounded-full border border-[#5C7AEA]/30 dark:border-blue-400/30"
                        animate={{
                            scale: [1, 2, 1],
                            opacity: [0.3, 0, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                        }}
                    />
                </div>

                {/* 2. Central Logo / Icon */}
                <motion.div
                    className="relative z-10 w-24 h-24 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-900/20 box-border p-4"
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {/* Abstract Logo Shape */}
                    <div className="relative w-12 h-12">
                        <motion.span
                            className="absolute top-0 left-0 w-6 h-6 bg-[#14279B] rounded-full"
                            animate={{ x: [0, 24, 0], borderRadius: ["50%", "20%", "50%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.span
                            className="absolute bottom-0 right-0 w-6 h-6 bg-[#5C7AEA] rounded-full"
                            animate={{ x: [0, -24, 0], borderRadius: ["50%", "20%", "50%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </motion.div>

                {/* 3. Text Loader */}
                <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <h3 className="text-xl font-bold text-[#14279B] dark:text-blue-400 mb-1">
                        BaseBond
                    </h3>
                    <motion.div
                        className="h-1 w-24 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mx-auto"
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#14279B] to-[#5C7AEA]"
                            animate={{
                                x: ["-100%", "100%"]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
