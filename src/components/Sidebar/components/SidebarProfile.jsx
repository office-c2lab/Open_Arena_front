// src/components/Sidebar/components/SidebarProfile.jsx

import React from 'react';
import UserIcon from '@/assets/icons/user.svg';

export default function SidebarProfile() {
  return (
    <div className="flex items-center gap-3 w-[208px] h-[40px]">
      <div className="w-[40px] h-[40px] rounded-full bg-[#FF4854] flex items-center justify-center">
        <img src={UserIcon} alt="User" className="w-[24px] h-[24px]" />
      </div>

      <div className="flex flex-col gap-[4px] flex-grow">
        <span className="body-medium font-500 tracking-[0.4px] text-[#0F172A]/50">
          Product Manager
        </span>
        <span className="body-medium font-500 text-[#0F172A]/80">user</span>
      </div>
    </div>
  );
}
