'use client';

import React from 'react';
import QRCode from 'react-qr-code';
import { Download, Share2 } from 'lucide-react';

interface TicketQRProps {
    eventId: string | number;
    ticketId: string | number;
    walletAddress: string;
    eventName?: string;
    size?: number;
}

export const TicketQR: React.FC<TicketQRProps> = ({
    eventId,
    ticketId,
    walletAddress,
    eventName,
    size = 200,
}) => {
    const qrData = JSON.stringify({
        type: 'BASEBOND_TICKET',
        eventId: eventId.toString(),
        ticketId: ticketId.toString(),
        wallet: walletAddress,
        timestamp: Date.now(),
    });

    const downloadQR = () => {
        const svg = document.getElementById('ticket-qr-svg')?.querySelector('svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = size * 2;
            canvas.height = size * 2;

            if (ctx) {
                // Fill white background
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, size * 2, size * 2);
            }

            const link = document.createElement('a');
            link.download = `basebond-ticket-${ticketId}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        };

        img.src = url;
    };

    const shareQR = async () => {
        try {
            await navigator.share({
                title: eventName || 'BaseBond Ticket',
                text: `My ticket for ${eventName || 'event'}`,
                url: window.location.href,
            });
        } catch {
            // Fallback to clipboard
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
                <div id="ticket-qr-svg">
                    <QRCode
                        value={qrData}
                        size={size}
                        level="H"
                        bgColor="#FFFFFF"
                        fgColor="#14279B"
                    />
                </div>
            </div>

            <div className="flex gap-3 mt-4">
                <button
                    onClick={downloadQR}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download
                </button>
                <button
                    onClick={shareQR}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                    <Share2 className="w-4 h-4" />
                    Share
                </button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-3">
                Ticket #{ticketId} • Event #{eventId}
            </p>
        </div>
    );
};

export default TicketQR;
