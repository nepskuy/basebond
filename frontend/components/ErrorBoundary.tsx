// Error Boundary Component
'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
                    <div className="max-w-md w-full text-center">
                        <div className="relative mb-8">
                            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                                <AlertTriangle className="w-12 h-12 text-red-500" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            We encountered an unexpected error. Don't worry, your data is safe.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl text-left">
                                <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white hover:shadow-lg transition-all"
                                style={{ background: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)' }}
                            >
                                <RefreshCw className="w-5 h-5" />
                                Reload Page
                            </button>
                            <a
                                href="/"
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                            >
                                <Home className="w-5 h-5" />
                                Go Home
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
