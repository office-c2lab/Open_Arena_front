// /src/store/useSidebarStore.js (최종 - '/challenge' 경로 매핑 추가)

import { create } from 'zustand';

const PATH_TO_LABEL_MAP = {
  '/': '대시보드',
  '/leaderboard': '리더보드',
  '/tutorial': '튜토리얼',
  '/kategorie': '챌린지',
  '/challenge': '챌린지', // 💡 '/challenge' 경로 추가
};

export const useSidebarStore = create((set, get) => ({
  // --------------------
  // 1. 상태 (State)
  // --------------------
  activeItem: PATH_TO_LABEL_MAP[window.location.pathname] || '대시보드',
  isAIDropdownOpen: false,
  isSettingsDropdownOpen: false, // --------------------
  // 2. 액션 (Actions)
  // --------------------
  setActiveItemByPath: pathname => {
    const label = PATH_TO_LABEL_MAP[pathname] || '대시보드';

    if (label === '챌린지') {
      set({ activeItem: label, isAIDropdownOpen: true, isSettingsDropdownOpen: false });
    } else if (label === '설정') {
      set({ activeItem: label, isSettingsDropdownOpen: true, isAIDropdownOpen: false });
    } else {
      set({ activeItem: label, isAIDropdownOpen: false, isSettingsDropdownOpen: false });
    }
  },

  handleItemClick: (label, isDropdown) => {
    set({ activeItem: label });

    if (label === '챌린지') {
      set(prev => ({
        isSettingsDropdownOpen: false,
        isAIDropdownOpen: !prev.isAIDropdownOpen,
      }));
    } else if (label === '설정') {
      set(prev => ({
        isAIDropdownOpen: false,
        isSettingsDropdownOpen: !prev.isSettingsDropdownOpen,
      }));
    } else {
      set({ isAIDropdownOpen: false, isSettingsDropdownOpen: false });
    }
  },

  handleSubMenuClick: (subLabel, parentLabel) => {
    set({ activeItem: subLabel });

    if (parentLabel === '챌린지') {
      set({ isAIDropdownOpen: true, isSettingsDropdownOpen: false });
    } else if (parentLabel === '설정') {
      set({ isSettingsDropdownOpen: true, isAIDropdownOpen: false });
    }
  },
}));
