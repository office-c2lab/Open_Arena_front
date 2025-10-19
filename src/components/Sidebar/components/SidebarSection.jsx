// src/components/Sidebar/components/SidebarSection.jsx

import React from 'react';
// 💡 같은 폴더 내 컴포넌트를 상대 경로로 불러옴
import SidebarSectionTitle from './SidebarSectionTitle';
import NavLinkItem from './NavLinkItem';

/**
 * 네비게이션 섹션 컨테이너 컴포넌트
 */
export default function SidebarSection({
  title,
  items,
  activeItem,
  handleItemClick,
  handleSubMenuClick,
}) {
  return (
    <nav className="flex flex-col gap-2 w-[208px]">
      <SidebarSectionTitle title={title} />
      {items.map((item, idx) => (
        <NavLinkItem
          key={idx}
          item={item}
          activeItem={activeItem}
          handleItemClick={handleItemClick}
          handleSubMenuClick={handleSubMenuClick}
        />
      ))}
    </nav>
  );
}
