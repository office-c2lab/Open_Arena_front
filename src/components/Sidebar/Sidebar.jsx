// src/components/Sidebar/Sidebar.jsx

import React, { useState } from 'react';
// 💡 zustand 스토어 import
import { useSidebarStore } from '../../store/useSidebarStore';

// 하위 컴포넌트들을 './components/' 폴더에서 불러옵니다.
import SidebarHeader from './components/SidebarHeader';
import SidebarSection from './components/SidebarSection';
import BottomLinkItem from './components/BottomLinkItem';
import SidebarProfile from './components/SidebarProfile';

// 정적 데이터
import { mainNavigationData, subNavigationData, bottomLinksData } from './data/sidebarData';

export default function Sidebar() {
  // 🔴 Zustand에서 필요한 상태와 액션을 구독 🔴
  const {
    activeItem,
    isAIDropdownOpen,
    isSettingsDropdownOpen, // handleItemClick, // NavLinkItem에서 직접 호출하므로 주석 처리
    // handleSubMenuClick, // NavLinkItem에서 직접 호출하므로 주석 처리
  } = useSidebarStore(); // 하단 링크 호버 상태는 여전히 로컬 상태로 유지 (전역 상태로 만들 필요 없음)

  const [isHelpHovered, setIsHelpHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false); // 정적 데이터 호출 (zustand 상태를 전달)

  const mainNavigation = mainNavigationData(isAIDropdownOpen);
  const subNavigation = subNavigationData(isSettingsDropdownOpen);

  const bottomLinks = bottomLinksData(
    isHelpHovered,
    setIsHelpHovered,
    isLogoutHovered,
    setIsLogoutHovered
  );

  return (
    <aside
      className="
   w-[256px] h-screen 
   bg-white border-r border-white/10 rounded-[12px] 
   flex flex-col p-6 gap-6
  "
    >
      <SidebarHeader /> {/* 섹션 제목 한글로 변경 */}
      <SidebarSection
        title="메뉴" // 💡 'Menu' -> '메뉴'로 변경
        items={mainNavigation}
        activeItem={activeItem}
      />
      {/* 섹션 제목 한글로 변경 */}
      <SidebarSection
        title="설정" // 💡 'Settings' -> '설정'으로 변경
        items={subNavigation}
        activeItem={activeItem}
      />
      <div className="flex-grow"></div>
      <nav className="flex flex-col gap-2 w-[208px]">
        {bottomLinks.map((item, idx) => (
          <BottomLinkItem key={idx} item={item} />
        ))}
      </nav>
      {/* 임시 데이터 한글로 변경 */}
      <SidebarProfile name={'사용자'} role={'프로덕트 매니저'} />
    </aside>
  );
}
