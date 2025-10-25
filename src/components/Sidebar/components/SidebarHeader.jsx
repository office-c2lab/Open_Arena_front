// src/components/Sidebar/components/SidebarHeader.jsx

import React from 'react';
import ArenaLogo from '@/assets/icons/Arena.svg';
import SideOffIcon from '@/assets/icons/sideoff.svg';

export default function SidebarHeader({ toggleSidebar }) {
  return (
    <div className="flex flex-row justify-between items-center w-[208px] h-[42px]">
      <div className="flex items-center gap-[9px]">
        <img src={ArenaLogo} alt="ARENA Logo" className="w-[29px] h-[42px]" />
        <span className="heading-3 font-700 text-[#FF084A]">ARENA</span>
      </div>
      <img
        src={SideOffIcon}
        alt="Toggle Sidebar"
        className="w-[27px] h-[27px] cursor-pointer"
        onClick={toggleSidebar}
      />
    </div>
  );
}
