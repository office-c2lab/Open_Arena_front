// src/components/Sidebar/components/SidebarProfile.jsx

import React from 'react';
import UserIcon from '@/assets/icons/user.svg';

export default function SidebarProfile({ isCollapsed, name, role }) {
  return (
    <div
      className={`flex items-center h-[40px]
        ${
          isCollapsed
            ? 'w-full justify-center gap-0' // 접힘 상태: 가운데 정렬
            : 'w-[208px] gap-3' // 펼침 상태: 간격 유지
        }
      `}
    >
      {/* 프로필 이미지 (기본 아이콘) */}
      <div className="w-[40px] h-[40px] rounded-full bg-[#FF4854] flex items-center justify-center flex-shrink-0">
        <img src={UserIcon} alt="User" className="w-[24px] h-[24px]" />
      </div>

      {/* 접힘 상태가 아닐 때만 텍스트 표시 */}
      {!isCollapsed && (
        <div className="flex flex-col gap-[4px] flex-grow">
          <span className="body-medium font-500 tracking-[0.4px] text-[#0F172A]/50">
            {role || '게스트'}
          </span>
          <span className="body-medium font-500 text-[#0F172A]/80">{name || '로그인 필요'}</span>
        </div>
      )}
    </div>
  );
}
