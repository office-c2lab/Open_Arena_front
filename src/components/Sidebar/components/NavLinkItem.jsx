// src/components/Sidebar/components/NavLinkItem.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebarStore } from '../../../store/useSidebarStore'; // zustand import

// 아이콘
import DropdownIcon from '@/assets/icons/downbtn.svg';
import DropdownIconWhite from '@/assets/icons/white-downbtn.svg';

const primaryTextColor = 'text-[#0F172A]';

/**
 * 단일 네비게이션 링크 항목 컴포넌트 (Link 기반 + 필터링 기능)
 */
export default function NavLinkItem({ item }) {
  // props 목록 간소화
  const location = useLocation();

  // 🔴 Zustand에서 필요한 상태와 액션을 구독 🔴
  const { activeItem, handleItemClick, handleSubMenuClick } = useSidebarStore();

  // 1. 활성화 상태 계산 (배경색 결정):
  // activeItem은 이제 '대시보드', '챌린지', '코딩' 등의 한글 레이블을 가집니다.
  const isLabelActive = activeItem === item.label;
  const isSubMenuActive = item.subMenu ? item.subMenu.some(sub => sub.label === activeItem) : false;

  const isActive = isLabelActive || isSubMenuActive;

  // 2. 시각적 활성화 상태 계산 (텍스트/아이콘 색상 결정):
  const isDropdownOpen = item.isDropdown && item.isOpen;
  const isVisualActive = isActive || isDropdownOpen;

  const defaultTextColor = isVisualActive ? 'text-white/80' : primaryTextColor + '/50';
  const currentIcon = isVisualActive && item.activeIcon ? item.activeIcon : item.icon;
  const currentChevronIcon = isVisualActive ? DropdownIconWhite : DropdownIcon;

  // 3. 렌더링 컴포넌트 및 props 설정:
  const isNavigational = !!item.path;
  const Component = isNavigational ? Link : 'div';

  const props = isNavigational
    ? {
        to: item.path,
        onClick: () => handleItemClick(item.label, item.isDropdown),
      }
    : {
        onClick: item.onClick || (() => handleItemClick(item.label, item.isDropdown)),
        role: 'button',
      };

  const isChallenge = item.label === '챌린지'; // 한글 레이블 사용
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
