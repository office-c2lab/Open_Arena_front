import React from 'react';
import ArenaLogo from '@/assets/icons/Arena.svg';
import SideOffIcon from '@/assets/icons/sideoff.svg';
// 💡 [수정] SideOnIcon을 SideOffIcon으로 대체하고, 회전 로직을 적용합니다.
// import SideOnIcon from '@/assets/icons/sideoff.svg';

export default function SidebarHeader({ isCollapsed, setIsCollapsed }) {
  const handleCollapseToggle = () => {
    setIsCollapsed(prev => !prev);
  }; // 💡 [핵심] 토글 버튼의 스타일을 isCollapsed 상태에 따라 분리하여 적용합니다.

  return (
    <div
      className={`flex items-center h-[42px] relative 
  ${isCollapsed ? 'justify-center w-full' : 'justify-between w-[208px]'}
 `}
    >
      {/* 1. 로고와 텍스트 컨테이너 */}
      {isCollapsed ? (
        <img src={ArenaLogo} alt="ARENA Logo" className="w-[29px] h-[42px] flex-shrink-0" />
      ) : (
        <div className="flex items-center gap-[9px] flex-shrink-0">
          <img src={ArenaLogo} alt="ARENA Logo" className="w-[29px] h-[42px]" />
          <span className="heading-3 font-700 text-[#FF084A]">ARENA</span>
        </div>
      )}
      {/* 2. 토글 버튼 (흰색 박스 + 그림자 + Absolute 위치) */}
      <div
        onClick={handleCollapseToggle}
        className={`
     absolute top-1/2 -translate-y-1/2 cursor-pointer 
     ${
       isCollapsed
         ? 'w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md left-[80px]'
         : 'w-[27px] h-[27px] right-0'
     }
    `}
      >
        <img
          src={SideOffIcon}
          alt="Toggle Collapse"
          className={`
                ${isCollapsed ? 'w-[26px] h-[26px] rotate-180 transition-transform duration-300' : 'w-full h-full transition-transform duration-300'} 
            `}
        />
      </div>
    </div>
  );
}
