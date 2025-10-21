// src/components/Sidebar/components/SidebarHeader.jsx

import React from 'react';
import ArenaLogo from '@/assets/icons/Arena.svg';
import SideOffIcon from '@/assets/icons/sideoff.svg';

/**
 * 사이드바 로고 및 토글 아이콘 영역 컴포넌트
 * @param {boolean} isChallengeLayout - 챌린지 레이아웃 여부
 * @param {function} toggleSidebar - 사이드바 토글 함수
 */
export default function SidebarHeader({ isChallengeLayout, toggleSidebar }) {
  return (
    <div className="flex flex-row justify-between items-center w-[208px] h-[42px]">
      <div className="flex items-center gap-[9px]">
        <img src={ArenaLogo} alt="ARENA Logo" className="w-[29px] h-[42px]" />
        <span className="text-[20px] font-bold leading-[26px] text-[#FF084A]">ARENA</span>
      </div>

      {/* ChallengeLayout일 때만 아이콘을 렌더링하고, 클릭 핸들러 추가 */}
      {isChallengeLayout && (
        <img
          src={SideOffIcon}
          alt="Toggle Sidebar"
          className="w-[27px] h-[27px] cursor-pointer"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
