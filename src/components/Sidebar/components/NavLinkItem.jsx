// src/components/Sidebar/components/NavLinkItem.jsx (수정)

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

  // 1. 활성화 상태 계산 (배경색 결정):
  const isLabelActive = activeItem === item.label;
  const isSubMenuActive = item.subMenu ? item.subMenu.some(sub => sub.label === activeItem) : false;
  const isActive = isLabelActive || isSubMenuActive;

  // 2. 시각적 활성화 상태 계산 (텍스트/아이콘 색상 결정):
  const isDropdownOpen = item.isDropdown && item.isOpen;
  const isVisualActive = isActive || isDropdownOpen;

  const defaultTextColor = isVisualActive ? 'text-white/80' : primaryTextColor + '/50';
  const currentIcon = isVisualActive && item.activeIcon ? item.activeIcon : item.icon;
  const currentChevronIcon = isVisualActive ? DropdownIconWhite : DropdownIcon;

  // 🔴 3. 렌더링 컴포넌트 및 props 설정 수정: 🔴
  // item.path가 존재하면(Challenge 포함), Link 컴포넌트를 사용합니다.
  const isNavigational = !!item.path;
  const Component = isNavigational ? Link : 'div';

  const props = isNavigational
    ? {
        to: item.path, // 💡 페이지 이동 경로: /challenge
        // Link의 onClick은 네비게이션과 별개로 실행되어 드롭다운을 토글하고 activeItem을 설정합니다.
        onClick: () => handleItemClick(item.label, item.isDropdown),
      }
    : {
        // path가 없는 항목 (일부 필터링 기능만 하는 상위 메뉴 등)
        onClick: item.onClick || (() => handleItemClick(item.label, item.isDropdown)),
        role: 'button',
      };

  // Challenge와 Settings의 서브 메뉴 렌더링 컴포넌트 분리
  const isChallenge = item.label === 'Challenge';
  const SubComponent = isChallenge ? 'a' : Link; // Challenge 하위 메뉴는 필터링용 <a> 태그 유지

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
