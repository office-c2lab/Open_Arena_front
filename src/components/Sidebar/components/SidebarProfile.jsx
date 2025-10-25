// src/components/Sidebar/components/SidebarProfile.jsx

import React from 'react';
import UserIcon from '@/assets/icons/user.svg';

// 💡 isCollapsed prop을 받도록 수정
export default function SidebarProfile({ isCollapsed }) {
  return (
    <div
      // 💡 [핵심 수정] isCollapsed 상태에 따라 스타일 변경
      className={`flex items-center h-[40px] 
            ${
              isCollapsed
                ? 'w-full justify-center gap-0' // 접혔을 때: 너비 100%, 중앙 정렬, 간격 0
                : 'w-[208px] gap-3' // 펼쳤을 때: 기존 너비, 간격 3
            }
        `}
    >
      <div className="w-[40px] h-[40px] rounded-full bg-[#FF4854] flex items-center justify-center flex-shrink-0">
        {/* flex-shrink-0를 추가하여 아이콘 크기가 줄어들지 않도록 합니다. */}
        <img src={UserIcon} alt="User" className="w-[24px] h-[24px]" />
      </div>
      {/* 💡 [핵심 수정] isCollapsed가 아닐 때만 프로필 텍스트를 렌더링 */}
      {!isCollapsed && (
        <div className="flex flex-col gap-[4px] flex-grow">
          <span className="body-medium font-500 tracking-[0.4px] text-[#0F172A]/50">
            Product Manager
          </span>
          <span className="body-medium font-500 text-[#0F172A]/80">user</span>
        </div>
      )}
    </div>
  );
}
