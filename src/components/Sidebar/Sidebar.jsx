// src/components/Sidebar/Sidebar.jsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebarStore } from '../../stores/useSidebarStore';
import { useAuthStore } from '@/stores/authStore';

// 하위 컴포넌트
import SidebarHeader from './components/SidebarHeader';
import SidebarSection from './components/SidebarSection';
import BottomLinkItem from './components/BottomLinkItem';
import SidebarProfile from './components/SidebarProfile';

// 데이터
import { mainNavigationData, bottomLinksData } from './data/sidebarData';

export default function Sidebar({
  isChallengeLayout = false,
  isOpen = true,
  toggleSidebar = () => {},
}) {
  // 🧩 Zustand 사이드바 상태
  const { isCollapsed, toggleCollapsed, activeItem, isAIDropdownOpen, setActiveItemByPath } =
    useSidebarStore();

  // 🧭 현재 경로에 따라 활성화 메뉴 동기화
  const location = useLocation();
  useEffect(() => {
    setActiveItemByPath(location.pathname, location.search);
  }, [location.pathname, location.search, setActiveItemByPath]);

  // 🪄 hover 상태 관리
  const [isHelpHovered, setIsHelpHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  // ⭐ 로그인 상태 / 팀 정보 가져오기
  const { teamInfo, isLoggedIn } = useAuthStore();

  // ✅ 로그인 상태에 따라 표시할 이름 및 역할 결정
  const teamName = teamInfo?.teamname || '로그인 필요'; // ← 백엔드 응답에 맞게 teamname
  const role = isLoggedIn ? '팀 계정' : '게스트';

  // 📂 네비게이션 데이터 구성
  const mainNavigation = mainNavigationData(isAIDropdownOpen);
  const bottomLinks = bottomLinksData(
    isHelpHovered,
    setIsHelpHovered,
    isLogoutHovered,
    setIsLogoutHovered,
    isLoggedIn // ✅ 로그인 상태 전달
  );

  // 🎨 스타일 관련 클래스
  const fixedPositionClasses = 'fixed top-0 z-50';
  const dynamicWidthClasses = isCollapsed ? 'w-20' : 'w-[256px]';
  const transitionClasses = 'transition-all duration-300 ease-in-out';
  const visibilityClass = isOpen
    ? 'opacity-100 pointer-events-auto'
    : 'opacity-0 pointer-events-none';
  const borderClasses = isChallengeLayout && !isOpen ? 'border-r-0' : 'border-r border-white/10';
  const shadowClass = isOpen ? 'shadow-xl' : '';

  // 🧱 JSX 구조
  return (
    <aside
      className={`
        flex-shrink-0 
        bg-white 
        ${fixedPositionClasses}
        ${dynamicWidthClasses} 
        ${transitionClasses} 
        ${borderClasses}
        ${shadowClass} 
        ${visibilityClass}
        h-full
      `}
      style={{ left: '0px' }}
    >
      <div className={`flex flex-col gap-6 h-full ${isCollapsed ? 'p-2' : 'p-6'}`}>
        {/* 🔹 헤더 */}
        <SidebarHeader
          isChallengeLayout={isChallengeLayout}
          isCollapsed={isCollapsed}
          setIsCollapsed={toggleCollapsed}
        />

        {/* 🔹 메인 메뉴 섹션 */}
        <SidebarSection
          title="메뉴"
          items={mainNavigation}
          activeItem={activeItem}
          isCollapsed={isCollapsed}
        />

        {/* 🔹 빈 공간 (메뉴 - 하단 간격 확보) */}
        <div className="flex-grow" />

        {/* 🔹 하단 링크 (로그인 / 로그아웃 버튼 등) */}
        <nav className={`flex flex-col gap-2 ${isCollapsed ? 'w-full items-center' : 'w-[208px]'}`}>
          {bottomLinks.map((item, idx) => (
            <BottomLinkItem key={idx} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>

        {/* 🔹 프로필 영역 (팀명 / 로그인 상태 표시) */}
        <SidebarProfile
          isCollapsed={isCollapsed}
          name={teamName} // 팀명
          role={role} // 로그인 상태별 텍스트
        />
      </div>
    </aside>
  );
}
