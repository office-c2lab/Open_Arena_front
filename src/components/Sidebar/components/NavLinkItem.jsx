// src/components/Sidebar/components/NavLinkItem.jsx

import React from 'react';

// 아이콘
import DropdownIcon from '@/assets/icons/downbtn.svg';
import DropdownIconWhite from '@/assets/icons/white-downbtn.svg';

const primaryTextColor = 'text-[#0F172A]';

/**
 * 단일 네비게이션 링크 항목 컴포넌트 (드롭다운 포함)
 */
export default function NavLinkItem({ item, activeItem, handleItemClick, handleSubMenuClick }) {
  const isSubMenuActive = item.subMenu ? item.subMenu.some(sub => sub.label === activeItem) : false;

  const isActive =
    activeItem === item.label || (item.isDropdown && (item.isOpen || isSubMenuActive));

  const defaultTextColor = isActive ? 'text-white/80' : primaryTextColor + '/50';

  const itemClickHandler = item.onClick
    ? item.onClick
    : () => handleItemClick(item.label, item.isDropdown);

  const currentIcon = isActive && item.activeIcon ? item.activeIcon : item.icon;
  const currentChevronIcon = isActive ? DropdownIconWhite : DropdownIcon;

  return (
    <div className={`w-full ${item.isDropdown && item.isOpen ? 'flex flex-col gap-3' : ''}`}>
      {/* 메인 메뉴 링크 */}
      <a
        onClick={itemClickHandler}
        className={`flex items-center px-3 py-[10px] gap-3 w-full h-[44px] rounded-[8px] transition-colors cursor-pointer
          ${isActive ? 'bg-[#FF4854]' : 'hover:bg-gray-100'} 
        `}
      >
        <div
          className={`flex items-center w-full ${item.hasChevron ? 'justify-between' : ''} gap-3`}
        >
          {/* Icon (20px) */}
          <img src={currentIcon} alt={item.label} className="w-[20px] h-[20px]" />

          {/* Label (Body Large - 500) */}
          <span className={`text-[16px] font-medium leading-[24px] flex-grow ${defaultTextColor}`}>
            {item.label}
          </span>

          {/* Icon / Chevron */}
          {item.hasChevron && (
            <img
              src={currentChevronIcon}
              alt="Dropdown Toggle"
              className={`w-[16px] h-[16px] transition-transform duration-200 
                ${item.isDropdown && item.isOpen ? 'rotate-180' : 'rotate-0'} 
              `}
            />
          )}
        </div>
      </a>

      {/* 드롭다운 서브 메뉴 */}
      {item.isDropdown && item.isOpen && (
        <div className="flex flex-col gap-[8px] w-full">
          {item.subMenu.map((sub, subIdx) => {
            const isSubActive = activeItem === sub.label;
            return (
              <a
                key={subIdx}
                onClick={() => handleSubMenuClick(sub.label, item.label)}
                className={`flex items-center ml-7 pl-[20px] pr-3 py-2 w-[180px] h-[38px] rounded-[8px] transition-colors cursor-pointer
                  ${isSubActive ? 'bg-[#FF4854]' : 'hover:bg-gray-100'}
                `}
              >
                <span
                  className={`text-[16px] font-medium leading-[24px] 
                    ${isSubActive ? 'text-white/80' : `${primaryTextColor}/50`}`}
                >
                  {sub.label}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
