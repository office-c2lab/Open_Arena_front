// src/components/Sidebar/Sidebar.jsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebarStore } from '../../stores/useSidebarStore';

// 하위 컴포넌트 (가정)
import SidebarHeader from './components/SidebarHeader';
import SidebarSection from './components/SidebarSection';
import BottomLinkItem from './components/BottomLinkItem';
import SidebarProfile from './components/SidebarProfile';
// 가정: 데이터는 이미 정의되어 있음
import { mainNavigationData, subNavigationData, bottomLinksData } from './data/sidebarData';

export default function Sidebar({
  isChallengeLayout = false,
  isOpen = true, // isCollapsed 상태를 Store에서 관리하므로 isOpen의 역할이 줄어들 수 있음.
  toggleSidebar = () => {}, // toggleCollapsed 상태를 Store에서 관리하므로 사용하지 않을 수 있음.
}) {
  // 💡 [핵심] Store에서 isCollapsed 상태와 토글 액션 구독
  const {
    isCollapsed,
    toggleCollapsed, // Store의 액션 사용
    activeItem,
    isAIDropdownOpen,
    isSettingsDropdownOpen,
    setActiveItemByPath,
  } = useSidebarStore();

  const location = useLocation();
  useEffect(() => {
    setActiveItemByPath(location.pathname, location.search);
  }, [location.pathname, location.search, setActiveItemByPath]);

  // 로컬 상태 (호버)
  const [isHelpHovered, setIsHelpHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  // 데이터 구성 (가정)
  const mainNavigation = mainNavigationData(isAIDropdownOpen);
  const subNavigation = subNavigationData(isSettingsDropdownOpen);
  const bottomLinks = bottomLinksData(
    isHelpHovered,
    setIsHelpHovered,
    isLogoutHovered,
    setIsLogoutHovered
  );

  // 5. 동적 클래스 계산
  const fixedPositionClasses = 'fixed top-0 z-50';
  // 💡 [핵심] isCollapsed 상태에 따른 동적 너비 적용 (256px = w-[256px], 80px = w-20)
  const dynamicWidthClasses = isCollapsed ? 'w-20' : 'w-[256px]';
  const transitionClasses = 'transition-all duration-300 ease-in-out';
  const dynamicTransform = '';
  const visibilityClass = isOpen
    ? 'opacity-100 pointer-events-auto'
    : 'opacity-0 pointer-events-none';

  const borderClasses = isChallengeLayout && !isOpen ? 'border-r-0' : 'border-r border-white/10';
  const shadowClass = isOpen ? 'shadow-xl' : '';

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
        ${dynamicTransform}
        ${visibilityClass}
        h-full
      `}
      style={{
        left: '0px',
      }}
    >
      <div className={`flex flex-col gap-6 h-full ${isCollapsed ? 'p-2' : 'p-6'}`}>
        {/* SidebarHeader에 Store의 isCollapsed 상태와 토글 액션을 전달 */}
        <SidebarHeader
          isChallengeLayout={isChallengeLayout}
          // toggleSidebar={toggleSidebar} // 이제 Store의 액션을 사용하므로 필요 없을 수 있습니다.
          isCollapsed={isCollapsed}
          setIsCollapsed={toggleCollapsed} // 💡 [핵심] Store의 toggleCollapsed 액션을 전달
        />
        <SidebarSection
          title="메뉴"
          items={mainNavigation}
          activeItem={activeItem}
          isCollapsed={isCollapsed}
        />
        {/* <SidebarSection
          title="설정"
          items={subNavigation}
          activeItem={activeItem}
          isCollapsed={isCollapsed}
        /> */}
        <div className="flex-grow"></div>
        <nav className={`flex flex-col gap-2 ${isCollapsed ? 'w-full items-center' : 'w-[208px]'}`}>
          {bottomLinks.map((item, idx) => (
            <BottomLinkItem key={idx} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>
        <SidebarProfile isCollapsed={isCollapsed} name={'사용자'} role={'프로덕트 매니저'} />
      </div>
    </aside>
  );
}
