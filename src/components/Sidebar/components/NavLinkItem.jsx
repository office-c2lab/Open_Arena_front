// src/components/Sidebar/components/NavLinkItem.jsx (최종)

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// 아이콘
import DropdownIcon from '@/assets/icons/downbtn.svg';
import DropdownIconWhite from '@/assets/icons/white-downbtn.svg';

const primaryTextColor = 'text-[#0F172A]';

/**
 * 단일 네비게이션 링크 항목 컴포넌트 (Link 기반 + 필터링 기능)
 */
export default function NavLinkItem({ item, activeItem, handleItemClick, handleSubMenuClick }) {
  const location = useLocation();

  // 1. 활성화 상태 계산 (isActive - 배경색 결정):
  // * 경로 일치(isPathActive)는 isActive 계산에서 제거하고 activeItem에만 의존합니다.
  const isLabelActive = activeItem === item.label;
  const isSubMenuActive = item.subMenu ? item.subMenu.some(sub => sub.label === activeItem) : false;

  // 🔴 isActive (배경색): 항목 레이블이 activeItem이거나 하위 메뉴 중 하나가 activeItem일 때만 TRUE
  const isActive = isLabelActive || isSubMenuActive;

  // 2. 시각적 활성화 상태 계산 (Visual State - 텍스트/아이콘 색상 결정):
  const isDropdownOpen = item.isDropdown && item.isOpen;
  // isActive이거나, 드롭다운이 열렸을 때 (isDropdownOpen) 텍스트와 아이콘 색상을 흰색으로 유지
  const isVisualActive = isActive || isDropdownOpen;

  const defaultTextColor = isVisualActive ? 'text-white/80' : primaryTextColor + '/50';
  const currentIcon = isVisualActive && item.activeIcon ? item.activeIcon : item.icon;
  const currentChevronIcon = isVisualActive ? DropdownIconWhite : DropdownIcon;

  // 3. 렌더링 컴포넌트 및 props 설정:
  const isLink = !item.isDropdown; // 드롭다운이 아니면 Link
  const Component = isLink ? Link : 'div';

  const props = isLink
    ? {
        to: item.path, // 페이지 이동 경로
        onClick: () => handleItemClick(item.label, item.isDropdown),
      }
    : {
        onClick: item.onClick || (() => handleItemClick(item.label, item.isDropdown)),
        role: 'button',
      };

  const isChallenge = item.label === 'Challenge';
  const SubComponent = isChallenge ? 'a' : Link;

  return (
    <div className={`w-full ${isDropdownOpen ? 'flex flex-col gap-3' : ''}`}>
      {/* 메인 메뉴 링크 */}
      <Component
        {...props}
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
                ${isDropdownOpen ? 'rotate-180' : 'rotate-0'} 
              `}
            />
          )}
        </div>
      </Component>

      {/* 드롭다운 서브 메뉴 */}
      {isDropdownOpen && (
        <div className="flex flex-col gap-[8px] w-full">
          {item.subMenu.map((sub, subIdx) => {
            const isSubActive = activeItem === sub.label;

            const subProps = isChallenge
              ? { role: 'button' } // Challenge: 필터링 (<a>)
              : { to: sub.path }; // Settings: 페이지 이동 (<Link>)

            return (
              <SubComponent
                key={subIdx}
                onClick={() => handleSubMenuClick(sub.label, item.label)}
                {...subProps}
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
              </SubComponent>
            );
          })}
        </div>
      )}
    </div>
  );
}
