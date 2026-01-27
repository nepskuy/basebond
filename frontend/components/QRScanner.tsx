'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { QrCode, Camera, CameraOff, RotateCcw } from 'lucide-react';

interface QRScannerProps {
    onScan: (data: string) => void;
    onError?: (error: string) => void;
    continuous?: boolean;
}

export const QRScanner: React.FC<QRScannerProps> = ({
    onScan,
    onError,
    continuous = true,
}) => {
    const [isScanning, setIsScanning] = useState(false);
    const [hasCamera, setHasCamera] = useState(true);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const scannerContainerId = 'qr-scanner-container';

    const startScanner = useCallback(() => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(() => { });
        }

        scannerRef.current = new Html5QrcodeScanner(
            scannerContainerId,
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                showTorchButtonIfSupported: true,
                showZoomSliderIfSupported: true,
            },
            false
        );

        scannerRef.current.render(
            (decodedText) => {
                onScan(decodedText);

                if (!continuous && scannerRef.current) {
                    scannerRef.current.clear().catch(() => { });
                    setIsScanning(false);
                }
            },
            (errorMessage) => {
                // Silently handle most errors (they're continuous)
                if (errorMessage.includes('NotAllowedError') || errorMessage.includes('NotFoundError')) {
                    setHasCamera(false);
                    onError?.('Camera access denied or not available');
                }
            }
        );

        setIsScanning(true);
    }, [onScan, onError, continuous]);

    const stopScanner = useCallback(() => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(() => { });
            scannerRef.current = null;
        }
        setIsScanning(false);
    }, []);

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => { });
            }
        };
    }, []);

    if (!hasCamera) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-2xl text-center">
                <CameraOff className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-red-600 font-medium">Camera not available</p>
                <p className="text-sm text-red-500 mt-2">
                    Please allow camera access or use a device with a camera
                </p>
                <button
                    onClick={() => {
                        setHasCamera(true);
                        startScanner();
                    }}
                    className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            {!isScanning ? (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-700 rounded-2xl">
                    <div
                        className="w-20 h-20 mb-6 rounded-2xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #14279B 0%, #5C7AEA 100%)' }}
                    >
                        <QrCode className="w-10 h-10 text-white" />
                    </div>
                    <button
                        onClick={startScanner}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #14279B 0%, #5C7AEA 100%)' }}
                    >
                        <Camera className="w-5 h-5" />
                        Start Camera
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <div
                        id={scannerContainerId}
                        className="rounded-2xl overflow-hidden"
                    />
                    <button
                        onClick={stopScanner}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                    >
                        <CameraOff className="w-5 h-5" />
                        Stop Camera
                    </button>
                </div>
            )}
        </div>
    );
};

export default QRScanner;
