'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import CustomNavbar from '@/components/CustomNavbar';
import CustomFooter from '@/components/CustomFooter';
import {
    MapPin,
    Users,
    Ticket,
    Banknote,
    Coins,
    Image,
    ArrowRight,
    Sparkles,
    Clock,
} from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { useCreateEvent } from '@/hooks/useContracts';
import { useRouter } from 'next/navigation';
import ModernDatePicker from '@/components/ui/ModernDatePicker';
import Swal from 'sweetalert2';

export default function CreateEventPage() {
    const { isConnected } = useAccount();

    const formatCurrency = (value: string) => {
        if (!value) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxTickets: '',
        price: '0',
        imageUrl: '',
        isPaid: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { createEvent, isLoading, isSuccess, error, txHash } = useCreateEvent();
    const router = useRouter();

    const isSubmitDisabled = useMemo(
        () => isSubmitting || isLoading || !formData.name || !formData.date || !formData.time,
        [isSubmitting, isLoading, formData.name, formData.date, formData.time],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (name === 'price') {
            // Strip non-digits for price
            const rawValue = value.replace(/\D/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: rawValue
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleDateOnlyChange = (date: Date | null) => {
        if (!date) return;
        const isoDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');

        setFormData(prev => ({
            ...prev,
            date: isoDate
        }));
    };

    const handleTimeOnlyChange = (date: Date | null) => {
        if (!date) return;
        const timeString = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
        setFormData(prev => ({
            ...prev,
            time: timeString
        }));
    };

    const selectedDate = useMemo(() => {
        if (!formData.date) return null;
        return new Date(`${formData.date}T00:00:00`);
    }, [formData.date]);

    const selectedTime = useMemo(() => {
        if (!formData.time) return null;
        const [hours, minutes] = formData.time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date;
    }, [formData.time]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!isConnected) {
            Swal.fire({
                icon: 'warning',
                title: 'Wallet Not Connected',
                text: 'Please connect your wallet to create an event.',
                confirmButtonColor: '#14279B',
            });
            return;
        }

        if (!formData.date || !formData.time) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Date/Time',
                text: 'Please select a date and time for your event.',
                confirmButtonColor: '#14279B',
            });
            return;
        }

        setIsSubmitting(true);

        const priceAsNumber = Number(formData.price || 0);
        const maxTicketsAsNumber = Number(formData.maxTickets || 100);

        if (maxTicketsAsNumber <= 0 || !Number.isInteger(maxTicketsAsNumber)) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Ticket Count',
                text: 'Maximum tickets must be a positive integer.',
                confirmButtonColor: '#14279B',
            });
            setIsSubmitting(false);
            return;
        }

        if (priceAsNumber < 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Price',
                text: 'Price cannot be negative.',
                confirmButtonColor: '#14279B',
            });
            setIsSubmitting(false);
            return;
        }


        try {
            const dateTime = new Date(`${formData.date}T${formData.time}:00`);
            const priceAsNumber = Number(formData.price || 0);

            await createEvent(
                formData.name,
                formData.description,
                formData.location,
                formData.imageUrl,
                dateTime,
                priceAsNumber,
                Number(formData.maxTickets || 100)
            );
        } catch (err: any) {
            console.error('Failed to create event', err);

            // Ignore user rejection
            if (err.cause?.code === 4001 || err.code === 4001 || err.message?.includes('User rejected')) {
                setIsSubmitting(false);
                return;
            }

            Swal.fire({
                icon: 'error',
                title: 'Transaction Failed',
                text: 'Please make sure your wallet is connected and has enough funds.',
                confirmButtonColor: '#14279B',
            });
            setIsSubmitting(false);
            return;
        }
    };

    useEffect(() => {
        if (error) {
            // Check for user rejection in the error object from hook
            // @ts-ignore
            if (error.cause?.code === 4001 || error.cause?.cause?.code === 4001 || error.message?.includes('User rejected')) {
                setIsSubmitting(false);
                return;
            }

            setErrorMessage(error.message ?? 'Transaction failed');
            setIsSubmitting(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Transaction failed',
                confirmButtonColor: '#14279B',
            });
        }
    }, [error]);

    useEffect(() => {
        if (isSuccess) {
            setIsSubmitting(false);
            // Reset form
            setFormData({
                name: '',
                description: '',
                date: '',
                time: '',
                location: '',
                maxTickets: '',
                price: '0',
                imageUrl: '',
                isPaid: false,
            });

            const explorerUrl = txHash
                ? `https://basescan.org/tx/${txHash}`
                : undefined;

            Swal.fire({
                icon: 'success',
                title: 'Event Created!',
                text: 'Your event has been successfully published onchain.',
                footer: explorerUrl ? `<a href="${explorerUrl}" target="_blank" style="color:#14279B">View on Explorer</a>` : '',
                confirmButtonColor: '#14279B',
                confirmButtonText: 'Go to Dashboard',
                showCancelButton: true,
                cancelButtonText: 'Stay Here',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/dashboard');
                }
            });
        }
    }, [isSuccess, router, txHash]);

    const gradientColors = {
        primary: 'linear-gradient(135deg, #14279B 0%, #3D56B2 50%, #5C7AEA 100%)',
    };

    const previewDateLabel = useMemo(() => {
        if (!selectedDate) return 'Choose date & time';
        return selectedDate.toLocaleString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, [selectedDate]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E6E6E6] to-white dark:from-gray-900 dark:to-gray-950">
            <CustomNavbar />

            <main className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#14279B]/10 dark:bg-blue-900/20 text-[#14279B] dark:text-blue-400 text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        Create Your Event
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Launch Your{' '}
                        <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: gradientColors.primary }}
                        >
                            Next Event
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Create secure digital tickets, reward attendees automatically, and build your community - all in minutes.
                    </p>
                </div>

                {/* Form + Preview */}
                <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-[3fr,2fr] items-start">
                    {/* Form Card */}
                    <div
                        className="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-6 md:p-10 border border-white/40 dark:border-gray-800/60 backdrop-blur-md"
                        style={{ boxShadow: '0 25px 50px rgba(20, 39, 155, 0.18)' }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Event Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Event Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Web3 Indonesia Meetup"
                                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-[#5C7AEA] focus:ring-2 focus:ring-[#5C7AEA]/20 transition-all duration-300 outline-none"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    Tell people what makes your event special
                                </p>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your event..."
                                    rows={4}
                                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-[#5C7AEA] focus:ring-2 focus:ring-[#5C7AEA]/20 transition-all duration-300 outline-none resize-none"
                                    required
                                />
                            </div>

                            {/* Date & Time - Modern Picker */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Event Date *
                                    </label>
                                    <ModernDatePicker
                                        selected={selectedDate}
                                        onChange={handleDateOnlyChange}
                                        showTimeSelect={false}
                                        placeholderText="Select date"
                                        dateFormat="MMMM d, yyyy"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Start Time *
                                    </label>
                                    <ModernDatePicker
                                        selected={selectedTime}
                                        onChange={handleTimeOnlyChange}
                                        showTimeSelect={true}
                                        showTimeSelectOnly={true}
                                        placeholderText="Select time"
                                        dateFormat="h:mm aa"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-2" />
                                    Location
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    Where will your event take place? (City, venue, or "Online")
                                </p>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Jakarta, Indonesia"
                                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-[#5C7AEA] transition-all duration-300 outline-none"
                                    required
                                />
                            </div>

                            {/* Tickets & Pricing */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        <Users className="w-4 h-4 inline mr-2" />
                                        Maximum Attendees
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                        How many people can attend?
                                    </p>
                                    <input
                                        type="number"
                                        name="maxTickets"
                                        value={formData.maxTickets}
                                        onChange={handleChange}
                                        placeholder="100"
                                        min="1"
                                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-[#5C7AEA] transition-all duration-300 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        <Banknote className="w-4 h-4 inline mr-2" />
                                        Ticket Price (IDRX)
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                        Set to 0 for free events.
                                    </p>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formatCurrency(formData.price)}
                                        onChange={handleChange}
                                        placeholder="0 = Free"
                                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-[#5C7AEA] transition-all duration-300 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Event Image */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    <Image className="w-4 h-4 inline mr-2" />
                                    Event Image (Optional)
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    Add a cover image URL to make your event stand out
                                </p>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-[#5C7AEA] transition-all duration-300 outline-none"
                                />
                            </div>

                            {/* Features Info */}
                            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#14279B]/5 to-[#5C7AEA]/5 border border-[#5C7AEA]/20">
                                <h3 className="font-semibold mb-3 text-[#14279B] dark:text-blue-400">What You Get Automatically:</h3>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li className="flex items-center gap-2">
                                        <Ticket className="w-4 h-4 text-[#5C7AEA]" />
                                        Secure digital tickets with QR codes for easy check-in
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-[#5C7AEA]" />
                                        Digital badges (POAPs) automatically given to attendees
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Coins className="w-4 h-4 text-[#5C7AEA]" />
                                        Reward points in IDRX for your community
                                    </li>
                                </ul>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitDisabled}
                                className="w-full py-4 px-8 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: gradientColors.primary }}
                            >
                                {isSubmitting || isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating your event...
                                    </>
                                ) : (
                                    <>
                                        Create Event
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Live Preview Card (Fixed Theme Compatibility) */}
                    <div className="hidden lg:block sticky top-24">
                        <div className="relative h-full">
                            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#14279B]/15 via-[#5C7AEA]/5 to-transparent blur-2xl" />

                            {/* Theme Aware Container using system theme classes instead of bg-gray-900 */}
                            <div className="relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/5 p-6">
                                <div className="border-b border-gray-200 dark:border-white/10 pb-5 mb-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-[#5C7AEA] dark:text-blue-300/80">
                                            Preview
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            How your event card will look
                                        </p>
                                    </div>
                                    <span className="rounded-full px-3 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-400/40">
                                        Onchain Ready
                                    </span>
                                </div>

                                <div className="space-y-5">
                                    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.4} scale={1.05} className="my-4">
                                        <div className="rounded-2xl bg-gradient-to-br from-[#14279B] via-[#3D56B2] to-[#4A66C0] p-[2px] flex">
                                            {/* Preview Card Inner - Theme Aware */}
                                            <div className="rounded-[14px] bg-white dark:bg-gray-950/90 p-4 space-y-3 w-full h-full">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-blue-100">
                                                        {formData.location || 'Your city here'}
                                                    </span>
                                                    <span className="text-[11px] text-gray-500 dark:text-gray-300">
                                                        {previewDateLabel}
                                                    </span>
                                                </div>
                                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug">
                                                    {formData.name || 'Your amazing Web3 event title'}
                                                </h2>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                                                    {formData.description ||
                                                        'Describe your event in a way that makes people excited to join.'}
                                                </p>
                                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/10">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300">
                                                        <Users className="w-3 h-3 text-blue-500 dark:text-blue-300" />
                                                        <span>
                                                            Max{' '}
                                                            {formData.maxTickets
                                                                ? formData.maxTickets
                                                                : '100'}{' '}
                                                            seats
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                                                        <Banknote className="w-3 h-3" />
                                                        <span>
                                                            {Number(formData.price || 0) === 0
                                                                ? 'FREE'
                                                                : `${formatCurrency(formData.price)} IDRX`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Tilt>

                                    <div className="grid grid-cols-3 gap-3 text-[11px] text-gray-600 dark:text-gray-300">
                                        <div className="rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-transparent px-3 py-2 flex flex-col gap-1 shadow-sm dark:shadow-none">
                                            <span className="text-gray-500 dark:text-gray-400">Ticket</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                NFT + QR
                                            </span>
                                        </div>
                                        <div className="rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-transparent px-3 py-2 flex flex-col gap-1 shadow-sm dark:shadow-none">
                                            <span className="text-gray-500 dark:text-gray-400">Rewards</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                POAP + IDRX
                                            </span>
                                        </div>
                                        <div className="rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-transparent px-3 py-2 flex flex-col gap-1 shadow-sm dark:shadow-none">
                                            <span className="text-gray-500 dark:text-gray-400">Status</span>
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-300">
                                                Draft
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <CustomFooter />
        </div>
    );
}
