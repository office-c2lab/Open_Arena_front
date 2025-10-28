// src/components/Sidebar/data/sidebarData.js

// 아이콘 import (경로는 프로젝트 설정에 따라 다를 수 있음)
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

// 챌린지 드롭다운 서브 메뉴 데이터 (필터링 기능)
export const aiSubMenu = [
  { label: '코딩' },
  { label: '상담' },
  { label: '금융' },
  { label: '의료' },
  { label: '일반' },
];

// 설정 드롭다운 서브 메뉴 데이터 (페이지 이동 기능)
export const settingsSubMenu = [
  { label: '계정', path: '/settings/account' },
  { label: '알림', path: '/settings/notification' },
];

// -----------------------------------------------------------
// 메인 네비게이션 데이터 (메뉴 섹션)
// -----------------------------------------------------------
export const mainNavigationData = isAIDropdownOpen => [
  {
    icon: DashboardIcon,
    activeIcon: DashboardIconWhite,
    label: '대시보드',
    path: '/dashboard',
    isDropdown: false,
  },
  {
    icon: ChartIcon,
    activeIcon: ChartIconWhite,
    label: '리더보드',
    path: '/leaderboard',
    isDropdown: false,
    hasChevron: false,
  },
  {
    icon: PageIcon,
    activeIcon: PageIconWhite,
    label: '튜토리얼',
    path: '/tutorial',
    isDropdown: false,
  },
  {
    icon: AIIcon,
    activeIcon: AIIconWhite,
    label: '챌린지',
    path: '/kategorie',
    isDropdown: true,
    hasChevron: true,
    isOpen: isAIDropdownOpen,
    subMenu: aiSubMenu,
  },
];

// -----------------------------------------------------------
// 서브 네비게이션 데이터 (설정 섹션)
// -----------------------------------------------------------
export const subNavigationData = isSettingsDropdownOpen => [
  {
    icon: SettingsIcon,
    activeIcon: SettingsIconWhite,
    label: '설정',
    path: '/settings',
    isDropdown: true,
    hasChevron: true,
    isOpen: isSettingsDropdownOpen,
    subMenu: settingsSubMenu,
  },
];

// -----------------------------------------------------------
// 하단 링크 데이터
// -----------------------------------------------------------
export const bottomLinksData = (
  isHelpHovered,
  setIsHelpHovered,
  isLogoutHovered,
  setIsLogoutHovered
) => [
  // {
  //   icon: HelpIcon,
  //   label: '도움말',
  //   path: '/help',
  //   textClass: `${primaryTextColor}/50 body-large font-500`,
  //   hoverTextClass: `${primaryTextColor} body-large font-500`,
  //   iconSize: 'w-[15px] h-[15px]',
  //   heightClass: 'h-[38px]',
  //   isHovered: isHelpHovered,
  //   setHovered: setIsHelpHovered,
  // },
  {
    icon: LogoutIcon,
    label: '계정 로그인',
    path: '/login',
    textClass: 'text-[#CC8889] body-large font-500',
    hoverTextClass: 'text-[#FF084A] body-large font-500',
    iconSize: 'w-[15px] h-[15px]',
    heightClass: 'h-[38px]',
    isHovered: isLogoutHovered,
    setHovered: setIsLogoutHovered,
  },
];
