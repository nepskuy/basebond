// Global Error Page - Root Layout Error Boundary
'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global Error:', error);
    }, [error]);

    return (
        <html>
            <body>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(to bottom, #E6E6E6, #ffffff)',
                    padding: '1rem',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                    <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
                        {/* Error Icon */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 2rem',
                            borderRadius: '1rem',
                            background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.25)'
                        }}>
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                <path d="M12 9v4" />
                                <path d="M12 17h.01" />
                            </svg>
                        </div>

                        {/* Message */}
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '1rem',
                            color: '#111827'
                        }}>
                            Critical Error
                        </h1>
                        <p style={{
                            fontSize: '1rem',
                            color: '#6b7280',
                            marginBottom: '2rem'
                        }}>
                            A critical error occurred. Please try refreshing the page.
                        </p>

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={reset}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '1rem 2rem',
                                    borderRadius: '0.75rem',
                                    fontWeight: '600',
                                    color: 'white',
                                    background: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem'
                                }}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                                    <path d="M21 3v5h-5" />
                                </svg>
                                Try Again
                            </button>
                            <a
                                href="/"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '1rem 2rem',
                                    borderRadius: '0.75rem',
                                    fontWeight: '600',
                                    color: '#111827',
                                    background: 'white',
                                    border: '2px solid #e5e7eb',
                                    textDecoration: 'none',
                                    fontSize: '1rem'
                                }}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                                Back to Home
                            </a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
