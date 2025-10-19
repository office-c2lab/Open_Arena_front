// src/components/Sidebar/Sidebar.jsx (최종)

import React, { useState } from 'react';

// 하위 컴포넌트들을 './components/' 폴더에서 불러옵니다.
import SidebarHeader from './components/SidebarHeader';
import SidebarSection from './components/SidebarSection';
import BottomLinkItem from './components/BottomLinkItem';
import SidebarProfile from './components/SidebarProfile';

// 💡 데이터 파일을 불러옵니다.
import { mainNavigationData, subNavigationData, bottomLinksData } from './data/sidebarData';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isAIDropdownOpen, setIsAIDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isHelpHovered, setIsHelpHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  // --- 이벤트 핸들러 ---
  const handleItemClick = (label, isDropdown) => {
    setActiveItem(label);
    if (label === 'Challenge') {
      setIsSettingsDropdownOpen(false);
      setIsAIDropdownOpen(!isAIDropdownOpen);
    } else if (label === 'Settings') {
      setIsAIDropdownOpen(false);
      setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
    } else {
      setIsAIDropdownOpen(false);
      setIsSettingsDropdownOpen(false);
    }
  };

  const handleSubMenuClick = (subLabel, parentLabel) => {
    setActiveItem(subLabel);
    if (parentLabel === 'Challenge') {
      setIsAIDropdownOpen(true);
      setIsSettingsDropdownOpen(false);
    } else if (parentLabel === 'Settings') {
      setIsSettingsDropdownOpen(true);
      setIsAIDropdownOpen(false);
    }
  };

  // 💡 분리된 데이터 함수를 호출하여 필요한 데이터를 가져옵니다.
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

      <SidebarProfile />
    </aside>
  );
}
