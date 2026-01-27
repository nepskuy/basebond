'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    description?: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType, description?: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, message, type, description };

        setToasts((prev) => [...prev, newToast]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-24 right-4 z-50 flex flex-col gap-4 w-full max-w-sm pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            pointer-events-auto transform transition-all duration-300 ease-in-out animate-in slide-in-from-right fade-in
                            relative overflow-hidden rounded-2xl p-4 shadow-2xl backdrop-blur-xl border border-white/20
                            ${toast.type === 'success' ? 'bg-[#14279B]/90 text-white' : ''}
                            ${toast.type === 'error' ? 'bg-red-500/90 text-white' : ''}
                            ${toast.type === 'warning' ? 'bg-amber-500/90 text-white' : ''}
                            ${toast.type === 'info' ? 'bg-blue-500/90 text-white' : ''}
                        `}
                    >
                        {/* Gradient Overlay for aesthetic */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                        <div className="relative flex gap-3">
                            <div className="flex-shrink-0 mt-1">
                                {toast.type === 'success' && <CheckCircle className="w-6 h-6" />}
                                {toast.type === 'error' && <XCircle className="w-6 h-6" />}
                                {toast.type === 'warning' && <AlertTriangle className="w-6 h-6" />}
                                {toast.type === 'info' && <Info className="w-6 h-6" />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg leading-tight">{toast.message}</h3>
                                {toast.description && (
                                    <p className="mt-1 text-sm opacity-90">{toast.description}</p>
                                )}
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
