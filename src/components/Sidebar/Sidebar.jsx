import React, { useState } from 'react';

// 기본 아이콘
import DashboardIcon from '@/assets/icons/home.svg';
import ChartIcon from '@/assets/icons/line-chart.svg';
import PageIcon from '@/assets/icons/page.svg';
import AIIcon from '@/assets/icons/ai-model.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import HelpIcon from '@/assets/icons/help-circle.svg';
import LogoutIcon from '@/assets/icons/logout.svg';
import UserIcon from '@/assets/icons/user.svg';
import DropdownIcon from '@/assets/icons/downbtn.svg';

// 💡 White 버전 아이콘 (Dashboard, Leaderboard, Tutorial, Challenge, Settings, Dropdown만 유지)
import DashboardIconWhite from '@/assets/icons/white-home.svg';
import ChartIconWhite from '@/assets/icons/white-line-chart.svg';
import PageIconWhite from '@/assets/icons/white-page.svg';
import AIIconWhite from '@/assets/icons/white-ai-model.svg';
import SettingsIconWhite from '@/assets/icons/white-settings.svg';
import DropdownIconWhite from '@/assets/icons/white-downbtn.svg';

// 💡 Arena.svg와 sideoff.svg 적용
import ArenaLogo from '@/assets/icons/Arena.svg';
import SideOffIcon from '@/assets/icons/sideoff.svg';

const primaryTextColor = 'text-[#0F172A]'; // rgba(15, 23, 42)

/**
 * 피그마 CSS 명세를 바탕으로 개선된 사이드바 컴포넌트
 */
export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isAIDropdownOpen, setIsAIDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isHelpHovered, setIsHelpHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

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

  const aiSubMenu = [
    { label: 'Coding' },
    { label: 'Counseling' },
    { label: 'Finance' },
    { label: 'Medical' },
    { label: 'General' },
  ];

  const settingsSubMenu = [{ label: 'Account' }, { label: 'Notification' }];

  // 💡 메인 아이템에 White 아이콘 연결 유지
  const mainNavigation = [
    { icon: DashboardIcon, activeIcon: DashboardIconWhite, label: 'Dashboard', isDropdown: false },
    {
      icon: ChartIcon,
      activeIcon: ChartIconWhite,
      label: 'Leaderboard',
      isDropdown: false,
      hasChevron: false,
    },
    { icon: PageIcon, activeIcon: PageIconWhite, label: 'Tutorial', isDropdown: false },
    {
      icon: AIIcon,
      activeIcon: AIIconWhite,
      label: 'Challenge',
      isDropdown: true,
      hasChevron: true,
      isOpen: isAIDropdownOpen,
      subMenu: aiSubMenu,
      onClick: () => handleItemClick('Challenge', true),
    },
  ];

  const subNavigation = [
    {
      icon: SettingsIcon,
      activeIcon: SettingsIconWhite,
      label: 'Settings',
      isDropdown: true,
      hasChevron: true,
      isOpen: isSettingsDropdownOpen,
      subMenu: settingsSubMenu,
      onClick: () => handleItemClick('Settings', true),
    },
  ];

  // 💡 하단 링크에서 White 아이콘 관련 속성 제거
  const bottomLinks = [
    {
      icon: HelpIcon,
      label: 'Help',
      textClass: `${primaryTextColor}/50 text-[12px] font-medium`,
      hoverTextClass: `${primaryTextColor} text-[12px] font-medium`,
      iconSize: 'w-[15px] h-[15px]',
      heightClass: 'h-[38px]',
      isHovered: isHelpHovered,
      setHovered: setIsHelpHovered,
    },
    {
      icon: LogoutIcon,
      label: 'Login Account',
      textClass: 'text-[#CC8889] text-[12px] font-medium',
      hoverTextClass: 'text-[#FF084A] text-[12px] font-medium',
      iconSize: 'w-[15px] h-[15px]',
      heightClass: 'h-[38px]',
      isHovered: isLogoutHovered,
      setHovered: setIsLogoutHovered,
    },
  ];

  // -----------------------------------------------------------
  // NavLinkItem 컴포넌트: 서브 메뉴 항목의 텍스트 시작점 조정
  // -----------------------------------------------------------
  const NavLinkItem = ({ item }) => {
    const isSubMenuActive = item.subMenu
      ? item.subMenu.some(sub => sub.label === activeItem)
      : false;

    const isActive =
      activeItem === item.label || (item.isDropdown && (item.isOpen || isSubMenuActive));

    const defaultTextColor = isActive ? 'text-white/80' : primaryTextColor + '/50';

    const itemClickHandler = item.onClick
      ? item.onClick
      : () => handleItemClick(item.label, item.isDropdown);

    // 💡 활성 상태에 따라 White 아이콘 소스 결정
    const currentIcon = isActive && item.activeIcon ? item.activeIcon : item.icon;
    const currentChevronIcon = isActive ? DropdownIconWhite : DropdownIcon;

    return (
      <div className={`w-full ${item.isDropdown && item.isOpen ? 'flex flex-col gap-3' : ''}`}>
        {/* 메인 메뉴 링크 (텍스트 시작 위치: 44px) */}
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
            <span
              className={`text-[16px] font-medium leading-[24px] flex-grow ${defaultTextColor}`}
            >
              {item.label}
            </span>

            {/* Icon / Chevron (downbtn.svg 사용) */}
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

        {/* 드롭다운 서브 메뉴 - 텍스트 시작점 44px에 맞춤 */}
        {item.isDropdown && item.isOpen && (
          <div className="flex flex-col gap-[8px] w-full">
            {item.subMenu.map((sub, subIdx) => {
              const isSubActive = activeItem === sub.label;
              return (
                <a
                  key={subIdx}
                  onClick={() => handleSubMenuClick(sub.label, item.label)}
                  // 💡 ml-3 (12px) + pl-[32px] (패딩) = 텍스트 시작 44px
                  className={`flex items-center ml-3 pl-[32px] pr-3 py-2 w-[172px] h-[38px] rounded-[8px] transition-colors cursor-pointer
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
  };
  // -----------------------------------------------------------

  return (
    <aside
      className="
      absolute left-[240px] top-0 
      w-[256px] h-screen 
      bg-white border-r border-white/10 rounded-[12px] 
      flex flex-col p-6 gap-6
    "
    >
      {/* 로고 (Frame 2087327744) */}
      <div className="flex flex-row justify-between items-center w-[208px] h-[42px]">
        <div className="flex items-center gap-[9px]">
          <img src={ArenaLogo} alt="ARENA Logo" className="w-[29px] h-[42px]" />
          <span className="text-[20px] font-bold leading-[26px] text-[#FF084A]">ARENA</span>
        </div>
        <img src={SideOffIcon} alt="Toggle Sidebar" className="w-[27px] h-[27px] cursor-pointer" />
      </div>

      {/* 메뉴 섹션 1 (Menu) */}
      <nav className="flex flex-col gap-2 w-[208px]">
        <div className="px-3">
          <span className="text-[12px] font-medium leading-[18px] text-[#0F172A]/50 uppercase">
            Menu
          </span>
        </div>
        {mainNavigation.map((item, idx) => (
          <NavLinkItem key={idx} item={item} />
        ))}
      </nav>

      {/* 메뉴 섹션 2 (Settings) */}
      <nav className="flex flex-col gap-2 w-[208px]">
        <div className="px-3">
          <span className="text-[12px] font-medium leading-[18px] text-[#0F172A]/50 uppercase">
            Settings
          </span>
        </div>
        {subNavigation.map((item, idx) => (
          <NavLinkItem key={idx} item={item} />
        ))}
      </nav>

      <div className="flex-grow"></div>

      {/* Navigation (Help & Login Account) */}
      <nav className="flex flex-col gap-2 w-[208px]">
        {bottomLinks.map((item, idx) => (
          <a
            key={idx}
            className={`flex items-center px-3 py-2 gap-3 w-full ${item.heightClass} rounded-[8px] transition-colors cursor-pointer hover:bg-gray-100`}
            onMouseEnter={() => item.setHovered(true)}
            onMouseLeave={() => item.setHovered(false)}
          >
            <img
              src={item.icon}
              alt={item.label}
              className={item.iconSize}
              style={
                !item.isHovered && item.label !== 'Login Account'
                  ? { opacity: 0.5 }
                  : item.label === 'Login Account' && !item.isHovered
                    ? { opacity: 0.8 }
                    : {}
              }
            />
            <span className={item.isHovered ? item.hoverTextClass : item.textClass}>
              {item.label}
            </span>
          </a>
        ))}
      </nav>

      {/* 프로필 (Profil) - UserIcon 색상 변경 없음 */}
      <div className="flex items-center gap-3 w-[208px] h-[40px]">
        <div className="w-[40px] h-[40px] rounded-full bg-[#FF4854] flex items-center justify-center">
          <img src={UserIcon} alt="User" className="w-[24px] h-[24px]" />
        </div>

        <div className="flex flex-col gap-[4px] flex-grow">
          <span className="text-[10px] font-medium leading-[12px] uppercase tracking-[0.4px] text-[#0F172A]/50">
            Product Manager
          </span>
          <span className="text-[14px] font-normal leading-[20px] text-[#0F172A]/80">user</span>
        </div>
      </div>
    </aside>
  );
}
