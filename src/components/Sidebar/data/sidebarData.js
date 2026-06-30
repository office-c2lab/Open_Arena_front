// src/components/Sidebar/data/sidebarData.js

import DashboardIcon from '@/assets/icons/home.svg';
import ChartIcon from '@/assets/icons/line-chart.svg';
import PageIcon from '@/assets/icons/page.svg';
import AIIcon from '@/assets/icons/ai-model.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import LogoutIcon from '@/assets/icons/logout.svg';

import DashboardIconWhite from '@/assets/icons/white-home.svg';
import ChartIconWhite from '@/assets/icons/white-line-chart.svg';
import PageIconWhite from '@/assets/icons/white-page.svg';
import AIIconWhite from '@/assets/icons/white-ai-model.svg';
import SettingsIconWhite from '@/assets/icons/white-settings.svg';

export const settingsSubMenu = [
  { label: '계정', path: '/settings/account' },
  { label: '알림', path: '/settings/notification' },
];

export const mainNavigationData = [
  {
    icon: DashboardIcon,
    activeIcon: DashboardIconWhite,
    label: '대시보드',
    path: '/dashboard',
  },
  {
    icon: ChartIcon,
    activeIcon: ChartIconWhite,
    label: '리더보드',
    // ⭐ 리더보드를 새 창으로 열기
    onClick: () => window.open('/leaderboard', '_blank'),
    openInNewTab: true, // UI에서 사용할 수 있게 플래그 추가(선택 사항)
  },
  {
    icon: PageIcon,
    activeIcon: PageIconWhite,
    label: '튜토리얼',
    path: '/tutorial',
  },
  {
    icon: AIIcon,
    activeIcon: AIIconWhite,
    label: '챌린지',
    path: '/kategorie',
  },
];

// ✅ 로그인 여부에 따라 ‘로그아웃’ 또는 ‘계정 로그인’으로 표시
export const bottomLinksData = (
  isHelpHovered,
  setIsHelpHovered,
  isLogoutHovered,
  setIsLogoutHovered,
  isLoggedIn // ⭐ 추가
) => [
  {
    icon: LogoutIcon,
    label: isLoggedIn ? '로그아웃' : '계정 로그인', // ✅ 로그인 상태별 라벨 변경
    path: isLoggedIn ? '/logout' : '/', // ✅ 필요 시 실제 로그인 페이지로 수정
    textClass: 'text-[#CC8889] body-large font-500',
    hoverTextClass: 'text-[#FF084A] body-large font-500',
    iconSize: 'w-[15px] h-[15px]',
    heightClass: 'h-[38px]',
    isHovered: isLogoutHovered,
    setHovered: setIsLogoutHovered,
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
    subMenu: [
      { label: '계정', path: '/settings/account' },
      { label: '알림', path: '/settings/notification' },
    ],
  },
];
