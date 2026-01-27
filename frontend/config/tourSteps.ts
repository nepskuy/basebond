
interface TourStep {
    element: string;
    popover: {
        title: string;
        description: string;
        side?: "top" | "bottom" | "left" | "right";
        align?: "start" | "center" | "end";
    };
}

export const tourSteps: Record<string, TourStep[]> = {
    '/explore': [
        {
            element: 'main h1',
            popover: {
                title: 'Start Here',
                description: 'Welcome to the Event Marketplace. This is where you can find all active NFT-ticketed events on BaseBond.',
                side: 'bottom',
            }
        },
        {
            element: 'input[type="text"]',
            popover: {
                title: 'Find Specific Events',
                description: 'Type an event name or city (e.g., "Jakarta") here to filter the list instantly.',
                side: 'bottom',
            }
        },
        {
            element: '.flex.items-center.gap-2.overflow-x-auto',
            popover: {
                title: 'Quick Filters',
                description: 'Click these tags to switch between categories. Try "Free" to see events that cost 0 IDRX.',
                side: 'bottom',
            }
        },
        {
            element: '.grid',
            popover: {
                title: 'Select an Event',
                description: 'Click on any card to see full details, venue location, and to buy your ticket.',
                side: 'top',
            }
        }
    ],
    '/create': [
        {
            element: 'main h1',
            popover: {
                title: 'Create Your Event',
                description: 'Follow this simple form to deploy your own Event Contract. No coding required.',
                side: 'bottom',
            }
        },
        {
            element: 'input[name="name"]',
            popover: {
                title: '1. Event Name',
                description: 'Enter the public name of your event. This will appear on all tickets and invitations.',
                side: 'right',
            }
        },
        {
            element: 'textarea[name="description"]',
            popover: {
                title: '2. Description',
                description: 'Tell people why they should come. Share the agenda, speakers, or special perks.',
                side: 'right',
            }
        },
        {
            element: 'input[name="location"]',
            popover: {
                title: '3. Location',
                description: 'Where is it happening? Enter a physical address or a "Online" link.',
                side: 'right',
            }
        },
        {
            element: '.react-datepicker-wrapper',
            popover: {
                title: '4. Date & Time',
                description: 'Click to select when your event starts. The checkout page will show this time to attendees.',
                side: 'right',
            }
        },
        {
            element: 'input[name="price"]',
            popover: {
                title: '5. Ticket Price',
                description: 'Set the cost in IDRX. Enter "0" if you want to host a free community event.',
                side: 'left',
            }
        },
        {
            element: 'input[name="maxTickets"]',
            popover: {
                title: '6. Capacity',
                description: 'Limit the number of attendees to ensure your venue isn\'t overcrowded.',
                side: 'left',
            }
        },
        {
            element: 'button[type="submit"]',
            popover: {
                title: 'Final Step: Launch',
                description: 'Click here to deploy. Your wallet will ask you to sign a transaction to create the event contract.',
                side: 'top',
            }
        }
    ],
    '/staking': [
        {
            element: '#staking-header',
            popover: {
                title: 'Earn Rewards',
                description: 'Staking helps secure the protocol. In return, you earn "Points" which give you voting power.',
                side: 'bottom',
                align: 'center',
            }
        },
        {
            element: '#staking-stats',
            popover: {
                title: 'Your Balance',
                description: 'Check "Pendings Points" to see what you have earned so far but haven\'t claimed yet.',
                side: 'bottom',
            }
        },
        {
            element: '#claim-button',
            popover: {
                title: 'Step 1: Claim',
                description: 'Click here periodically to move your "Pending Points" into your wallet so you can use them.',
                side: 'top',
            }
        },
        {
            element: '#stake-card',
            popover: {
                title: 'Step 2: Stake',
                description: 'Enter amount > Click Approve > Click Stake. Your tokens are now working for you.',
                side: 'right',
            }
        },
        {
            element: '#unstake-card',
            popover: {
                title: 'Step 3: Unstake',
                description: 'Need your tokens back? Enter amount and click Unstake. No lock-up period.',
                side: 'left',
            }
        }
    ],
    '/governance': [
        {
            element: '#gov-header',
            popover: {
                title: 'Governance Dashboard',
                description: 'Use your earned Points to vote on community proposals. 1 Point = 1 Vote.',
                side: 'bottom',
            }
        },
        {
            element: '#treasury-stats',
            popover: {
                title: 'Community Funds',
                description: 'This shows how much money (IDRX) is in the DAO Treasury, available to be granted to projects.',
                side: 'bottom',
            }
        },
        {
            element: '#create-proposal-tab',
            popover: {
                title: 'Make a Proposal',
                description: 'Click here if you want to request funding. You will need to describe your project and setting a budget.',
                side: 'bottom',
            }
        },
        {
            element: '#proposals-list',
            popover: {
                title: 'Cast Your Vote',
                description: 'Review active proposals below. Click to see details and cast your "For" or "Against" vote.',
                side: 'top',
            }
        }
    ],
    '/dashboard': [
        {
            element: '#dashboard-header',
            popover: {
                title: 'Organizer Dashboard',
                description: 'Welcome back, Organizer. Manage your events and attendees from here.',
                side: 'bottom',
            }
        },
        {
            element: '.flex.gap-2.mb-8', // Tabs typically come before the list
            popover: {
                title: 'Navigation',
                description: 'Use "My Events" to see your list, and "Check-in Tool" to open the QR Scanner.',
                side: 'bottom',
            }
        },
        {
            element: '#create-event-btn',
            popover: {
                title: 'Create New',
                description: 'Quickly launch a new event page from here.',
                side: 'left',
            }
        },
        {
            element: '#events-list',
            popover: {
                title: 'Manage Events',
                description: 'This is where you see your events. If empty, click "Create Event". You can view sales and guest lists here.',
                side: 'top',
            }
        }
    ],
    '/event/*': [
        {
            element: '#event-hero',
            popover: {
                title: 'Event Details',
                description: 'Review everything about the event: Date, Time, Location, and Host.',
                side: 'bottom',
            }
        },
        {
            element: '#ticket-purchase',
            popover: {
                title: 'Get Tickets',
                description: 'Ready to join? Purchase your NFT ticket here. You can use IDRX or ETH.',
                side: 'left',
            }
        },
        {
            element: '#event-rewards',
            popover: {
                title: 'Exclusive Benefits',
                description: 'Attendees automatically get verified on-chain rewards like POAPs and Loyalty Points.',
                side: 'left',
            }
        }
    ]
};
