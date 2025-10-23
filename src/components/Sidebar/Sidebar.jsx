// src/components/Sidebar/Sidebar.jsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebarStore } from '../../stores/useSidebarStore';

// 하위 컴포넌트 (가정된 경로)
// 실제 프로젝트에 맞게 경로를 수정해야 합니다.
import SidebarHeader from './components/SidebarHeader';
import SidebarSection from './components/SidebarSection';
import BottomLinkItem from './components/BottomLinkItem';
import SidebarProfile from './components/SidebarProfile';
import { mainNavigationData, subNavigationData, bottomLinksData } from './data/sidebarData';

export default function Sidebar({
  isChallengeLayout = false,
  isOpen = true,
  toggleSidebar = () => {},
}) {
  // 1. 상태 및 액션 구독
  const { activeItem, isAIDropdownOpen, isSettingsDropdownOpen, setActiveItemByPath } =
    useSidebarStore(); // 2. URL 경로 감지 및 활성 상태 업데이트 로직

  const location = useLocation();
  useEffect(() => {
    setActiveItemByPath(location.pathname);
  }, [location.pathname, setActiveItemByPath]); // 3. 로컬 상태 (호버)

  const [isHelpHovered, setIsHelpHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false); // 4. 데이터 구성 (가정)

  const mainNavigation = mainNavigationData(isAIDropdownOpen);
  const subNavigation = subNavigationData(isSettingsDropdownOpen);
  const bottomLinks = bottomLinksData(
    isHelpHovered,
    setIsHelpHovered,
    isLogoutHovered,
    setIsLogoutHovered
  ); // 5. 동적 클래스 계산
  // ⚠️ [수정] isFixed 로직을 제거하고 항상 fixed top-0 z-50을 적용

  const fixedPositionClasses = 'fixed top-0 z-50'; // h-screen은 이전 요청에 따라 제거된 상태 유지
  const fixedWidth = 'w-[256px]'; // 💡 [수정] 이동(transform) 클래스 제거

  const dynamicTransform = ''; // 💡 [핵심] 투명도 및 포인터 이벤트 제어 (모달 닫힘 구현: 부드럽게 사라지고 클릭 차단)

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
    transition-opacity duration-300
    ${fixedPositionClasses} // fixed top-0 z-50 적용
    ${fixedWidth} 
    ${borderClasses}
    ${shadowClass} 
    ${dynamicTransform}
    ${visibilityClass}
        h-full
   `} // ⚠️ [수정] fixed 포지션이므로 left: '0px'로 고정
      style={{
        left: '0px',
      }}
    >
      <div className={`flex flex-col p-6 gap-6 h-full`}>
        <SidebarHeader isChallengeLayout={isChallengeLayout} toggleSidebar={toggleSidebar} />
        <SidebarSection title="메뉴" items={mainNavigation} activeItem={activeItem} />
        <SidebarSection title="설정" items={subNavigation} activeItem={activeItem} />
        <div className="flex-grow"></div>
        <nav className="flex flex-col gap-2 w-[208px]">
          {bottomLinks.map((item, idx) => (
            <BottomLinkItem key={idx} item={item} />
          ))}
        </nav>
        <SidebarProfile name={'사용자'} role={'프로덕트 매니저'} />
      </div>
    </aside>
  );
}
