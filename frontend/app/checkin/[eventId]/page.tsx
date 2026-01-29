'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';
import CustomNavbar from '@/components/CustomNavbar';
import CustomFooter from '@/components/CustomFooter';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import {
    QrCode,
    CheckCircle,
    XCircle,
    Users,
    Award,
    RefreshCw,
    Pause,
    Play,
    Volume2,
    VolumeX,
} from 'lucide-react';
import { useCheckIn } from '@/hooks/useContracts';
import { useToast } from '@/context/ToastContext';
import Confetti from '@/components/Confetti';

interface CheckInResult {
    success: boolean;
    address: string;
    message: string;
    timestamp: Date;
}

export default function CheckInPage() {
    const params = useParams();
    const eventIdParam = params.eventId as string;
    const eventIdNumber = useMemo(
        () => Number(eventIdParam || 0),
        [eventIdParam],
    );

    const [isScanning, setIsScanning] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [checkInHistory, setCheckInHistory] = useState<CheckInResult[]>([]);
    const [stats, setStats] = useState({ checkedIn: 0, total: 100 });
    const [showConfetti, setShowConfetti] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    const { showToast } = useToast();
    const { checkIn, isLoading, isSuccess, error, txHash } = useCheckIn();

    const gradientColors = {
        primary: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)',
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear();
            }
        };
    }, []);

    useEffect(() => {
        if (isScanning && !scannerRef.current) {
            // Small timeout to ensure DOM is ready
            const timer = setTimeout(() => {
                const scanner = new Html5QrcodeScanner(
                    'qr-reader',
                    {
                        fps: 20, // Increased FPS for faster scanning
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                        videoConstraints: {
                            facingMode: "environment",
                            focusMode: "continuous" // Attempt to force continuous focus
                        } as any,
                        // Experimental feature for better performance on mobile
                        useBarCodeDetectorIfSupported: true,
                    },
                    false,
                );

                scannerRef.current = scanner;
                scanner.render(onScanSuccess, onScanError);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isScanning]);

    const startScanning = () => {
        setIsScanning(true);
    };

    const stopScanning = () => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(console.error);
            scannerRef.current = null;
        }
        setIsScanning(false);
    };

    const onScanSuccess = async (decodedText: string) => {
        if (Number.isNaN(eventIdNumber)) {
            showToast('Invalid event ID for this check-in page.', 'error');
            return;
        }

        // Parse QR data (expected format: { ticketId, walletAddress, eventId })
        try {
            const data = JSON.parse(decodedText);
            const attendeeAddress: string =
                data.wallet || data.walletAddress || decodedText;

            // Optional: match eventId in QR with URL
            if (data.eventId && String(data.eventId) !== String(eventIdParam)) {
                const result: CheckInResult = {
                    success: false,
                    address: attendeeAddress,
                    message: 'QR does not belong to this event',
                    timestamp: new Date(),
                };
                showToast('QR mismatch', 'error', 'This QR code is for a different event');
                setCheckInHistory(prev => [result, ...prev]);
                return;
            }

            // Call contract to check-in and mint POAP
            await checkIn(eventIdNumber, attendeeAddress);

            const result: CheckInResult = {
                success: true,
                address: attendeeAddress,
                message: 'POAP minted successfully!',
                timestamp: new Date(),
            };

            if (!isMuted) {
                const audio = new Audio('/sounds/success.mp3');
                audio.play().catch(() => { });
            }

            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);

            showToast('Check-in Successful', 'success', `POAP Minted for ${attendeeAddress.slice(0, 6)}...`);
            setCheckInHistory(prev => [result, ...prev]);
            setStats(prev => ({ ...prev, checkedIn: prev.checkedIn + 1 }));
        } catch {
            // If not JSON, treat as wallet address directly
            const attendeeAddress =
                decodedText.length > 15
                    ? `${decodedText.slice(0, 6)}...${decodedText.slice(-4)}`
                    : decodedText;

            try {
                await checkIn(eventIdNumber, attendeeAddress);

                const result: CheckInResult = {
                    success: true,
                    address: attendeeAddress,
                    message: 'Check-in successful!',
                    timestamp: new Date(),
                };

                if (!isMuted) {
                    const audio = new Audio('/sounds/success.mp3');
                    audio.play().catch(() => { });
                }

                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);

                showToast('Check-in Successful', 'success', `Verified ${attendeeAddress.slice(0, 6)}...`);
                setCheckInHistory(prev => [result, ...prev]);
                setStats(prev => ({ ...prev, checkedIn: prev.checkedIn + 1 }));
            } catch (err) {
                console.error('Failed to check in attendee', err);
                const result: CheckInResult = {
                    success: false,
                    address: attendeeAddress,
                    message: 'Onchain check-in failed',
                    timestamp: new Date(),
                };
                showToast('Check-in Failed', 'error', 'Transaction rejected or logic error');
                setCheckInHistory(prev => [result, ...prev]);
            }
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            try {
                // Use the library's file scanner.
                const scanner = new Html5Qrcode("qr-reader-temp");

                const decodedText = await scanner.scanFileV2(file);
                if (decodedText) {
                    onScanSuccess(decodedText.decodedText);
                }
            } catch (err) {
                console.error("Error scanning file", err);
                showToast('Could not read QR from image', 'error');
            }
        }
    };

    const onScanError = (scanError: string) => {
        // Silently handle scan errors (continuous scanning)
        console.debug('QR Scan error:', scanError);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    useEffect(() => {
        if (error) {
            showToast('Check-in Error', 'error', error.message ?? 'Onchain check-in failed');
        }
    }, [error, showToast]);

    useEffect(() => {
        if (isSuccess && txHash) {
            // Check-in confirmed
        }
    }, [isSuccess, txHash]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E6E6E6] to-white dark:from-gray-900 dark:to-gray-950">
            <CustomNavbar />

            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Event Check-In</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Scan attendee QR codes to check them in
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Scanner Panel */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <QrCode className="w-6 h-6 text-[#14279B]" />
                                QR Scanner
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {isMuted ? (
                                        <VolumeX className="w-5 h-5" />
                                    ) : (
                                        <Volume2 className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Scanner Container */}
                        <div className="relative">
                            <div id="qr-reader-temp" className="hidden" />
                            {!isScanning ? (
                                <div className="aspect-square max-w-md mx-auto flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-2xl p-8">
                                    <div
                                        className="w-24 h-24 mb-6 rounded-2xl flex items-center justify-center"
                                        style={{ background: gradientColors.primary }}
                                    >
                                        <QrCode className="w-12 h-12 text-white" />
                                    </div>
                                    <button
                                        onClick={startScanning}
                                        className="px-8 py-4 rounded-xl font-semibold text-white flex items-center gap-2 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                                        style={{ background: gradientColors.primary }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-5 h-5" />
                                                Start Scanning
                                            </>
                                        )}
                                    </button>

                                    <div className="mt-4 flex items-center justify-center w-full">
                                        <label className="flex items-center gap-2 cursor-pointer text-[#14279B] hover:text-[#3D56B2] transition-colors font-medium">
                                            <span className="underline">Or upload QR image</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                            />
                                        </label>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 w-full">
                                        <p className="text-sm font-medium text-gray-500 mb-2">Manual Check-in</p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Paste or type Wallet Address"
                                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:border-[#14279B] outline-none"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const val = e.currentTarget.value;
                                                        if (val) onScanSuccess(val);
                                                    }
                                                }}
                                            />
                                            <button
                                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                                onClick={(e) => {
                                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                                    if (input.value) onScanSuccess(input.value);
                                                }}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative pt-6">
                                    <div id="qr-reader" className="rounded-2xl border-2 border-[#14279B]/30" />
                                    <div className="flex justify-center gap-4 mt-4">
                                        <button
                                            onClick={stopScanning}
                                            className="px-6 py-3 rounded-xl bg-red-500 text-white font-medium flex items-center gap-2 hover:bg-red-600 transition-colors"
                                        >
                                            <Pause className="w-5 h-5" />
                                            Stop
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-center">
                                <div className="text-3xl font-bold text-green-600">
                                    {stats.checkedIn}
                                </div>
                                <div className="text-sm text-green-700 dark:text-green-400">
                                    Checked In
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
                                <div className="text-3xl font-bold text-blue-600">
                                    {stats.total}
                                </div>
                                <div className="text-sm text-blue-700 dark:text-blue-400">
                                    Total Tickets
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Check-in History */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Users className="w-6 h-6 text-[#14279B]" />
                                Check-in History
                            </h2>
                            <span className="text-sm text-gray-500">
                                {checkInHistory.length} scanned
                            </span>
                        </div>

                        {checkInHistory.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Award className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p>No check-ins yet</p>
                                <p className="text-sm">Start scanning to see history</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                {checkInHistory.map((result, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${result.success
                                            ? 'bg-green-50 dark:bg-green-900/20'
                                            : 'bg-red-50 dark:bg-red-900/20'
                                            }`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${result.success ? 'bg-green-100' : 'bg-red-100'
                                                }`}
                                        >
                                            {result.success ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-mono text-sm font-medium">
                                                {result.address}
                                            </p>
                                            <p
                                                className={`text-xs ${result.success
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                                    }`}
                                            >
                                                {result.message}
                                            </p>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatTime(result.timestamp)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* POAP Info */}
                        <div className="mt-6 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-3">
                                <Award className="w-8 h-8 text-purple-600" />
                                <div>
                                    <p className="font-semibold text-purple-700 dark:text-purple-300">
                                        Auto-POAP Enabled
                                    </p>
                                    <p className="text-sm text-purple-600 dark:text-purple-400">
                                        Soulbound tokens are minted upon check-in
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >

            <CustomFooter />
            {showConfetti && <Confetti trigger={showConfetti} />}
        </div >
    );
}
