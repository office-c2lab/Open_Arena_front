import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // 💡 useNavigate 임포트
import { useSidebarStore } from '../../../stores/useSidebarStore'; // zustand import

// 아이콘 (경로 유지)
import DropdownIcon from '@/assets/icons/downbtn.svg';
import DropdownIconWhite from '@/assets/icons/white-downbtn.svg';

const primaryTextColor = 'text-[#0F172A]';

/**
 * 단일 네비게이션 링크 항목 컴포넌트 (Link 기반 + 필터링 기능)
 */
export default function NavLinkItem({ item }) {
  const navigate = useNavigate(); // 💡 useNavigate 훅 사용
  const location = useLocation();

  const { activeItem, handleItemClick, handleSubMenuClick } = useSidebarStore();

  // 1. 활성화 상태 계산 (로직 유지)
  const isLabelActive = activeItem === item.label;
  const isSubMenuActive = item.subMenu ? item.subMenu.some(sub => sub.label === activeItem) : false;
  const isActive = isLabelActive || isSubMenuActive;

  // 2. 시각적 활성화 상태 계산 (로직 유지)
  const isDropdownOpen = item.isDropdown && item.isOpen;
  const isVisualActive = isActive || isDropdownOpen;
  const defaultTextColor = isVisualActive ? 'text-white/80' : primaryTextColor + '/50';
  const currentIcon = isVisualActive && item.activeIcon ? item.activeIcon : item.icon;
  const currentChevronIcon = isVisualActive ? DropdownIconWhite : DropdownIcon;

  // 3. 렌더링 컴포넌트 및 props 설정 (로직 유지)
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

  const isChallenge = item.label === '챌린지';
  const SubComponent = isChallenge ? 'a' : Link;

  // 💡 [핵심 로직] 하위 메뉴 클릭 핸들러: subLabel을 category=쿼리 값으로 사용
  const handleChallengeSubMenuClick = (subLabel, parentLabel) => {
    // 1. Zustand 상태 업데이트 (액티브 효과 유지)
    handleSubMenuClick(subLabel, parentLabel);

    // 2. 쿼리 파라미터 생성: subLabel 자체가 카테고리 이름임 (예: '코딩', '상담')
    const categoryName = subLabel;

    // 3. 쿼리 파라미터와 함께 /kategorie로 이동: /kategorie?category=코딩
    navigate(`/kategorie?category=${categoryName}`);
  };

  return (
    <div className={`w-full ${isDropdownOpen ? 'flex flex-col gap-3' : ''}`}>
      {/* 메인 메뉴 링크 (변경 없음) */}
      <Component
        {...props}
        className={`flex items-center px-3 py-[10px] gap-3 w-full h-[44px] rounded-[8px] transition-colors cursor-pointer
        ${isActive ? 'bg-[#FF4854]' : 'hover:bg-gray-100'} 
      `}
      >
        <div
          className={`flex items-center w-full ${item.hasChevron ? 'justify-between' : ''} gap-3`}
        >
          {/* Icon, Label, Chevron (변경 없음) */}
          <img src={currentIcon} alt={item.label} className="w-[20px] h-[20px]" />
          <span className={`body-large font-500 flex-grow ${defaultTextColor}`}>{item.label}</span>
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

            const onClickHandler = isChallenge
              ? () => handleChallengeSubMenuClick(sub.label, item.label)
              : () => handleSubMenuClick(sub.label, item.label);

            const subProps = isChallenge ? { role: 'button' } : { to: sub.path };

            return (
              <SubComponent
                key={subIdx}
                onClick={onClickHandler}
                {...subProps}
                className={`flex items-center ml-7 pl-[20px] pr-3 py-2 w-[180px] h-[38px] rounded-[8px] transition-colors cursor-pointer
            ${isSubActive ? 'bg-[#FF4854]' : 'hover:bg-gray-100'}
          `}
              >
                <span
                  className={`body-large font-500
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
