'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock } from 'lucide-react';

interface ModernDatePickerProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    showTimeSelect?: boolean;
    placeholderText?: string;
    dateFormat?: string;
    minDate?: Date;
    showTimeSelectOnly?: boolean;
}

const ModernDatePicker: React.FC<ModernDatePickerProps> = ({
    selected,
    onChange,
    showTimeSelect = false,
    placeholderText,
    dateFormat = "MMMM d, yyyy",
    minDate = new Date(),
    showTimeSelectOnly = false,
}) => {
    return (
        <div className="relative w-full group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10 group-focus-within:text-[#5C7AEA] transition-colors">
                {showTimeSelect || showTimeSelectOnly ? (
                    <Clock className="w-5 h-5" />
                ) : (
                    <Calendar className="w-5 h-5" />
                )}
            </div>

            <DatePicker
                selected={selected}
                onChange={onChange}
                showTimeSelect={showTimeSelect}
                showTimeSelectOnly={showTimeSelectOnly}
                timeIntervals={15}
                minDate={minDate}
                dateFormat={dateFormat}
                placeholderText={placeholderText}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-[#5C7AEA] focus:ring-4 focus:ring-[#5C7AEA]/20 transition-all duration-300 outline-none text-gray-700 dark:text-gray-200 font-medium cursor-pointer"
                wrapperClassName="w-full"
                calendarClassName="!border-0 !rounded-2xl !shadow-2xl !bg-white dark:!bg-gray-800 !font-sans !p-4"
                dayClassName={(date) =>
                    "rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 !text-gray-700 dark:!text-gray-200"
                }
                popperClassName="!z-50"
            />

            <style jsx global>{`
                .react-datepicker-wrapper {
                    width: 100%;
                }
                .react-datepicker__header {
                    background: transparent !important;
                    border-bottom: 1px solid rgba(0,0,0,0.05) !important;
                }
                .react-datepicker__current-month {
                    color: #14279B !important;
                    font-weight: 700 !important;
                    margin-bottom: 0.5rem;
                }
                .react-datepicker__day--selected,
                .react-datepicker__day--keyboard-selected,
                .react-datepicker__time-list-item--selected {
                    background: linear-gradient(135deg, #14279B 0%, #5C7AEA 100%) !important;
                    color: white !important;
                    border-radius: 0.5rem !important;
                }
                .react-datepicker__time-container {
                    border-left: 1px solid rgba(0,0,0,0.05) !important;
                }
                .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {
                    border-radius: 0 0.5rem 0.5rem 0;
                }
                @media (prefers-color-scheme: dark) {
                    .react-datepicker__header {
                        border-bottom: 1px solid rgba(255,255,255,0.05) !important;
                    }
                    .react-datepicker__current-month {
                        color: #5C7AEA !important;
                    }
                }
                
                /* TIME ONLY MODE FIXES */
                .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {
                    width: 100% !important;
                }
                .react-datepicker__time-list {
                    overflow-x: hidden !important;
                    padding-right: 0px !important; 
                    /* Custom scrollbar for better look */
                    &::-webkit-scrollbar {
                        width: 4px;
                    }
                    &::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    &::-webkit-scrollbar-thumb {
                        background: #cbd5e1;
                        border-radius: 4px;
                    }
                }
                .dark .react-datepicker__time-list::-webkit-scrollbar-thumb {
                    background: #475569;
                }
                
                /* Remove left border if it's time only */
                .react-datepicker--time-only .react-datepicker__time-container {
                    border-left: 0 !important;
                }
            `}</style>
        </div>
    );
};

export default ModernDatePicker;
