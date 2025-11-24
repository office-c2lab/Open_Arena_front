// src/components/Sidebar/Sidebar.jsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebarStore } from '../../stores/useSidebarStore';
import { useAuthStore } from '@/stores/authStore';

import SidebarHeader from './components/SidebarHeader';
import SidebarSection from './components/SidebarSection';
import BottomLinkItem from './components/BottomLinkItem';
import SidebarProfile from './components/SidebarProfile';

import { mainNavigationData, bottomLinksData } from './data/sidebarData';

export default function Sidebar({ isChallengeLayout = false, isOpen = true }) {
  const { isCollapsed, toggleCollapsed, activeItem, isAIDropdownOpen, setActiveItemByPath } =
    useSidebarStore();

  const location = useLocation();
  useEffect(() => {
    setActiveItemByPath(location.pathname, location.search);
  }, [location.pathname, location.search, setActiveItemByPath]);

  const [isHelpHovered, setIsHelpHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  // ⭐ 여기!! 팀 + 관리자 둘 다 가져와야 함
  const { teamInfo, isLoggedIn, adminInfo, isAdminLoggedIn } = useAuthStore();

  // ⭐ 로그인 상태에 따라 Sidebar 표시 정보 변경
  let displayName = '로그인 필요';
  let role = '게스트';

  const isAnyLoggedIn = isLoggedIn || isAdminLoggedIn;

  if (isLoggedIn) {
    displayName = teamInfo?.teamname;
    role = '팀 계정';
  }

  if (isAdminLoggedIn) {
    displayName = adminInfo?.username;
    role = '관리자';
  }

  const mainNavigation = mainNavigationData(isAIDropdownOpen);

  const bottomLinks = bottomLinksData(
    isHelpHovered,
    setIsHelpHovered,
    isLogoutHovered,
    setIsLogoutHovered,
    isAnyLoggedIn
  );

  return (
    <aside
      className={`
        flex-shrink-0 bg-white fixed top-0 z-50
        ${isCollapsed ? 'w-20' : 'w-[256px]'}
        transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        border-r border-white/10 shadow-xl h-full
      `}
    >
      <div className={`flex flex-col gap-6 h-full ${isCollapsed ? 'p-2' : 'p-6'}`}>
        <SidebarHeader
          isChallengeLayout={isChallengeLayout}
          isCollapsed={isCollapsed}
          setIsCollapsed={toggleCollapsed}
        />

        <SidebarSection
          title="메뉴"
          items={mainNavigation}
          activeItem={activeItem}
          isCollapsed={isCollapsed}
        />

        <div className="flex-grow" />

        <nav className={`flex flex-col gap-2 ${isCollapsed ? 'items-center' : 'w-[208px]'}`}>
          {bottomLinks.map((item, idx) => (
            <BottomLinkItem key={idx} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>

        <SidebarProfile isCollapsed={isCollapsed} name={displayName} role={role} />
      </div>
    </aside>
  );
}
