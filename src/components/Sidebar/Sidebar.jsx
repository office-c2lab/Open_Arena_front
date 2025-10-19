// src/components/Sidebar/Sidebar.jsx (최종: 필터링 및 페이지 이동 로직)

import React, { useState } from 'react';

// 하위 컴포넌트들을 './components/' 폴더에서 불러옵니다.
import SidebarHeader from './components/SidebarHeader';
import SidebarSection from './components/SidebarSection';
import BottomLinkItem from './components/BottomLinkItem';
import SidebarProfile from './components/SidebarProfile';

// 정적 데이터
import { mainNavigationData, subNavigationData, bottomLinksData } from './data/sidebarData';

export default function Sidebar() {
  // activeItem 상태: 현재 선택된 메뉴 항목(혹은 필터)을 추적
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isAIDropdownOpen, setIsAIDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isHelpHovered, setIsHelpHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  // --- 이벤트 핸들러 ---
  const handleItemClick = (label, isDropdown) => {
    // 페이지 이동 메뉴 (Dashboard, Tutorial 등) 클릭 시 activeItem 설정
    setActiveItem(label);

    // 드롭다운 토글 로직
    if (label === 'Challenge') {
      setIsSettingsDropdownOpen(false);
      setIsAIDropdownOpen(prev => !prev);
    } else if (label === 'Settings') {
      setIsAIDropdownOpen(false);
      setIsSettingsDropdownOpen(prev => !prev);
    } else {
      // 일반 링크 클릭 시 드롭다운 모두 닫기
      setIsAIDropdownOpen(false);
      setIsSettingsDropdownOpen(false);
    }
  };

  const handleSubMenuClick = (subLabel, parentLabel) => {
    // 서브 메뉴(필터) 클릭 시 activeItem을 해당 레이블로 설정
    setActiveItem(subLabel);

    // 드롭다운은 열린 상태 유지
    if (parentLabel === 'Challenge') {
      setIsAIDropdownOpen(true);
      setIsSettingsDropdownOpen(false);
    } else if (parentLabel === 'Settings') {
      // Settings의 서브 메뉴는 페이지 이동이므로 클릭 후 드롭다운을 닫을 수도 있지만,
      // 여기서는 Challenge와 동일하게 열린 상태를 유지합니다.
      setIsSettingsDropdownOpen(true);
      setIsAIDropdownOpen(false);
    }

    // 💡 참고: Challenge의 경우, 여기서 실제 필터링 로직이 실행되어야 합니다.
  };

  // 정적 데이터 호출
  const mainNavigation = mainNavigationData(isAIDropdownOpen, handleItemClick);
  const subNavigation = subNavigationData(isSettingsDropdownOpen, handleItemClick);
  const bottomLinks = bottomLinksData(
    isHelpHovered,
    setIsHelpHovered,
    isLogoutHovered,
    setIsLogoutHovered
  );

  return (
    <aside
      className="
      absolute left-[240px] top-0 
      w-[256px] h-screen 
      bg-white border-r border-white/10 rounded-[12px] 
      flex flex-col p-6 gap-6
    "
    >
      <SidebarHeader />

      <SidebarSection
        title="Menu"
        items={mainNavigation}
        activeItem={activeItem}
        handleItemClick={handleItemClick}
        handleSubMenuClick={handleSubMenuClick}
      />

      <SidebarSection
        title="Settings"
        items={subNavigation}
        activeItem={activeItem}
        handleItemClick={handleItemClick}
        handleSubMenuClick={handleSubMenuClick}
      />

      <div className="flex-grow"></div>

      <nav className="flex flex-col gap-2 w-[208px]">
        {bottomLinks.map((item, idx) => (
          <BottomLinkItem key={idx} item={item} />
        ))}
      </nav>

      {/* 임시 데이터 전달 */}
      <SidebarProfile name={'user'} role={'Product Manager'} />
    </aside>
  );
}
