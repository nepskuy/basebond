import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Web3BadgeProps {
  icon: LucideIcon;
  text: string;
}

const Web3Badge: React.FC<Web3BadgeProps> = ({ icon: Icon, text }) => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-[#14279B]/10 to-[#5C7AEA]/10 border border-[#3D56B2]/20">
      <Icon className="w-4 h-4" style={{ color: '#5C7AEA' }} />
      <span className="text-sm font-medium" style={{ color: '#3D56B2' }}>{text}</span>
    </div>
  );
};

export default Web3Badge;
