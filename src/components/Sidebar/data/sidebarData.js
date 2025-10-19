// src/components/Sidebar/data/sidebarData.js

// Sidebar.jsx에서 사용되는 아이콘들을 모두 import 합니다.
import DashboardIcon from '@/assets/icons/home.svg';
import ChartIcon from '@/assets/icons/line-chart.svg';
import PageIcon from '@/assets/icons/page.svg';
import AIIcon from '@/assets/icons/ai-model.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import HelpIcon from '@/assets/icons/help-circle.svg';
import LogoutIcon from '@/assets/icons/logout.svg';

import DashboardIconWhite from '@/assets/icons/white-home.svg';
import ChartIconWhite from '@/assets/icons/white-line-chart.svg';
import PageIconWhite from '@/assets/icons/white-page.svg';
import AIIconWhite from '@/assets/icons/white-ai-model.svg';
import SettingsIconWhite from '@/assets/icons/white-settings.svg';

const primaryTextColor = 'text-[#0F172A]';

// 챌린지 드롭다운 서브 메뉴 데이터 (path 제거 - 필터링 기능)
export const aiSubMenu = [
  { label: 'Coding' },
  { label: 'Counseling' },
  { label: 'Finance' },
  { label: 'Medical' },
  { label: 'General' },
];

// 설정 드롭다운 서브 메뉴 데이터 (path 유지 - 페이지 이동 기능)
export const settingsSubMenu = [
  { label: 'Account', path: '/settings/account' },
  { label: 'Notification', path: '/settings/notification' }
];

// 메인 네비게이션 데이터 (Menu 섹션)
export const mainNavigationData = (isAIDropdownOpen, handleItemClick) => [
  { icon: DashboardIcon, activeIcon: DashboardIconWhite, label: 'Dashboard', path: '/', isDropdown: false },
  {
    icon: ChartIcon,
    activeIcon: ChartIconWhite,
    label: 'Leaderboard',
    path: '/leaderboard',
    isDropdown: false,
    hasChevron: false,
  },
  { icon: PageIcon, activeIcon: PageIconWhite, label: 'Tutorial', path: '/tutorial', isDropdown: false },
  {
    icon: AIIcon,
    activeIcon: AIIconWhite,
    label: 'Challenge',
    path: '/challenge', // Challenge 메인 페이지로 이동
    isDropdown: true,
    hasChevron: true,
    isOpen: isAIDropdownOpen,
    subMenu: aiSubMenu,
    onClick: () => handleItemClick('Challenge', true),
  },
];

// 서브 네비게이션 데이터 (Settings 섹션)
export const subNavigationData = (isSettingsDropdownOpen, handleItemClick) => [
  {
    icon: SettingsIcon,
    activeIcon: SettingsIconWhite,
    label: 'Settings',
    path: '/settings', // Settings 메인 페이지로 이동
    isDropdown: true,
    hasChevron: true,
    isOpen: isSettingsDropdownOpen,
    subMenu: settingsSubMenu,
    onClick: () => handleItemClick('Settings', true),
  },
];

// 하단 링크 데이터
export const bottomLinksData = (isHelpHovered, setIsHelpHovered, isLogoutHovered, setIsLogoutHovered) => [
  {
    icon: HelpIcon,
    label: 'Help',
    path: '/help',
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
    path: '/login',
    textClass: 'text-[#CC8889] text-[12px] font-medium',
    hoverTextClass: 'text-[#FF084A] text-[12px] font-medium',
    iconSize: 'w-[15px] h-[15px]',
    heightClass: 'h-[38px]',
    isHovered: isLogoutHovered,
    setHovered: setIsLogoutHovered,
  },
];