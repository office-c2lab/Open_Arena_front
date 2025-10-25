import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebarStore } from '../../stores/useSidebarStore';

// 하위 컴포넌트 (이전 답변에서 수정 완료됨: NavLinkItem, BottomLinkItem, SidebarProfile)
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
  // 💡 콜랩스 상태 관리
  const [isCollapsed, setIsCollapsed] = useState(false); // 1. 상태 및 액션 구독

  const { activeItem, isAIDropdownOpen, isSettingsDropdownOpen, setActiveItemByPath } =
    useSidebarStore(); // 2. URL 경로 감지 및 활성 상태 업데이트 로직

  const location = useLocation();
  useEffect(() => {
    setActiveItemByPath(location.pathname, location.search);
  }, [location.pathname, location.search, setActiveItemByPath]); // 3. 로컬 상태 (호버)

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

  const fixedPositionClasses = 'fixed top-0 z-50'; // 콜랩스 상태에 따른 동적 너비 적용
  const dynamicWidthClasses = isCollapsed ? 'w-20' : 'w-[256px]'; // 너비 변경 애니메이션
  const transitionClasses = 'transition-all duration-300 ease-in-out';
  const dynamicTransform = ''; // 투명도 및 포인터 이벤트 제어 (모달 닫힘 구현)
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
      {/* 💡 [핵심 수정] isCollapsed 상태에 따라 내부 패딩을 p-6에서 p-2로 변경 */}
      <div className={`flex flex-col gap-6 h-full ${isCollapsed ? 'p-2' : 'p-6'}`}>
        {/* SidebarHeader는 콜랩스 상태 토글 버튼 포함 */}
        <SidebarHeader
          isChallengeLayout={isChallengeLayout}
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <SidebarSection
          title="메뉴"
          items={mainNavigation}
          activeItem={activeItem}
          isCollapsed={isCollapsed}
        />
        <SidebarSection
          title="설정"
          items={subNavigation}
          activeItem={activeItem}
          isCollapsed={isCollapsed}
        />
        <div className="flex-grow"></div> {/* 하단 링크 */}
        <nav className={`flex flex-col gap-2 ${isCollapsed ? 'w-full items-center' : 'w-[208px]'}`}>
          {bottomLinks.map((item, idx) => (
            <BottomLinkItem key={idx} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>
        {/* 💡 [수정] 항상 렌더링하며 isCollapsed prop을 전달 (프로필 아이콘 표시) */}
        <SidebarProfile isCollapsed={isCollapsed} name={'사용자'} role={'프로덕트 매니저'} />
      </div>
    </aside>
  );
}
