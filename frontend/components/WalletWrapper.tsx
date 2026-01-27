'use client';

import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
    WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';
import {
    Address,
    Avatar,
    Name,
    Identity,
    EthBalance,
} from '@coinbase/onchainkit/identity';

export default function WalletWrapper({
    className,
    text,
}: {
    className?: string,
    text?: string,
}) {
    return (
        <Wallet>
            <ConnectWallet
                className={`${className} bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 !text-white hover:text-white font-sans font-semibold rounded-full px-4 py-2 hover:opacity-90 transition-all`}
            >
                <div className="h-6 w-6 rounded-full overflow-hidden bg-transparent shrink-0 flex items-center justify-center">
                    <Avatar className="h-full w-full !rounded-full" />
                </div>
                <Name className="!text-white hover:!text-white" />
            </ConnectWallet>
            <WalletDropdown className="!min-w-[280px] dark:bg-[#1a1a1a]">
                <Identity className="px-5 pt-4 pb-3 w-full" hasCopyAddressOnClick>
                    <Avatar className="!w-12 !h-12" />
                    <Name className="!text-lg !font-semibold" />
                    <Address className="!text-sm" />
                    <EthBalance className="!text-base !font-medium" />
                </Identity>
                <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com" className="!py-3 !text-base w-full">
                    Go to Wallet Dashboard
                </WalletDropdownLink>
                <WalletDropdownDisconnect className="!py-3 !text-base w-full" />
            </WalletDropdown>
        </Wallet>
    );
}
