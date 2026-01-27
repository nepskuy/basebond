'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import WalletBalance from './WalletBalance';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import WalletWrapper from './WalletWrapper';
import TourGuide from './TourGuide';


const CustomNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <img src="/Base.jpg" alt="BaseBond Logo" className="w-10 h-10 rounded-lg shadow-sm" />
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">BaseBond</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { href: '/', label: 'Home' },
              { href: '/explore', label: 'Events' },
              { href: '/tickets', label: 'My Tickets' },
              { href: '/create', label: 'Create' },
              { href: '/staking', label: 'Staking' },
              { href: '/governance', label: 'Community' },
              { href: '/dashboard', label: 'Dashboard' },
              { href: '/profile', label: 'Profile' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-gray-700 dark:text-gray-300 hover:text-primary-400 transition-colors pb-1 ${pathname === link.href ? 'text-primary-600 dark:text-blue-400 font-semibold' : ''
                  }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 rounded-full" />
                )}
              </a>
            ))}
          </div>

          {/* Wallet Connect Button - Full OnchainKit Implementation */}
          <div className="hidden md:flex items-center space-x-4">
            <WalletBalance />
            <TourGuide />
            <ThemeToggle />

            <div className="flex items-center gap-2">
              <WalletWrapper
                className="min-w-[90px]"
                text="Connect"
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <a href="/" className="block text-gray-700 dark:text-gray-300 hover:text-primary-400 transition-colors">Home</a>
            <a href="/explore" className="block text-gray-700 dark:text-gray-300 hover:text-primary-400 transition-colors">Events</a>
            <a href="/tickets" className="block text-gray-700 dark:text-gray-300 hover:text-primary-400 transition-colors">My Tickets</a>
            <a href="/create" className="block text-gray-700 dark:text-gray-300 hover:text-primary-400 transition-colors">Create</a>
            <a href="/staking" className="block text-gray-700 dark:text-gray-300 hover:text-primary-400 transition-colors">Staking</a>
            <a href="/governance" className="block text-gray-700 dark:text-gray-300 hover:text-primary-400 transition-colors">Community</a>
            <a href="/dashboard" className="block text-gray-700 dark:text-gray-300 hover:text-primary-400 transition-colors">Dashboard</a>
            <div className="pt-4 flex justify-between items-center">
              <div className="flex items-center gap-4 w-full justify-between">
                <WalletWrapper
                  className="w-full justify-center"
                  text="Connect Wallet"
                />
                <div className="flex items-center gap-2">
                  <TourGuide />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CustomNavbar;
