// src/components/Sidebar/components/SidebarProfile.jsx

import React from 'react';
import UserIcon from '@/assets/icons/user.svg';

/**
 * 사이드바 하단 프로필 컴포넌트
 */
export default function SidebarProfile() {
  return (
    <div className="flex items-center gap-3 w-[208px] h-[40px]">
      <div className="w-[40px] h-[40px] rounded-full bg-[#FF4854] flex items-center justify-center">
        <img src={UserIcon} alt="User" className="w-[24px] h-[24px]" />
      </div>

      <div className="flex flex-col gap-[4px] flex-grow">
        <span className="text-[10px] font-medium leading-[12px] uppercase tracking-[0.4px] text-[#0F172A]/50">
          Product Manager
        </span>
        <span className="text-[14px] font-normal leading-[20px] text-[#0F172A]/80">user</span>
      </div>
    </div>
  );
}
