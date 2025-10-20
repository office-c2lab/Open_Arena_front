// src/components/Sidebar/components/SidebarSectionTitle.jsx

import React from 'react';

/**
 * 사이드바 네비게이션 섹션 제목 컴포넌트
 * @param {string} title - 섹션 제목 (예: "MENU", "SETTINGS")
 */
export default function SidebarSectionTitle({ title }) {
  return (
    <div className="px-3">
      <span className="text-[12px] font-medium leading-[18px] text-[#0F172A]/50 uppercase">
        {title}
      </span>
    </div>
  );
}
