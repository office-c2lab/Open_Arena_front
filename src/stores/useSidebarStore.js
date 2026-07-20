// /src/stores/useSidebarStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 경로로부터 활성 라벨을 결정하는 헬퍼 함수
const getActiveLabelByPath = pathname => {
  if (pathname.startsWith('/challenge/')) {
    return '챌린지';
  }

  const PATH_TO_LABEL_MAP = {
    '/dashboard': '홈',
    '/leaderboard': '리더보드',
    '/tutorial': '튜토리얼',
    '/kategorie': '챌린지',
  };
  if (PATH_TO_LABEL_MAP[pathname]) {
    return PATH_TO_LABEL_MAP[pathname];
  }

  return '홈';
};

// create 함수를 persist로 감싸서 로컬 스토리지에 상태를 영구 저장합니다.
export const useSidebarStore = create(
  persist(
    set => ({
      // --------------------
      // 1. 상태 (State)
      // --------------------
      isCollapsed: false,

      activeItem: '홈',
      isSettingsDropdownOpen: false, // --------------------
      // 2. 액션 (Actions)
      // --------------------
      toggleCollapsed: () => set(state => ({ isCollapsed: !state.isCollapsed })),

      setActiveItemByPath: pathname => {
        const label = getActiveLabelByPath(pathname);
        const isChallengeDetailPage = pathname.startsWith('/challenge/');

        if (isChallengeDetailPage) {
          set({
            activeItem: label,
            isCollapsed: true,
            isSettingsDropdownOpen: false,
          });
          return;
        }

        if (label === '설정') {
          set({
            activeItem: label,
            isSettingsDropdownOpen: true,
          });
        } else {
          set({
            activeItem: label,
            isSettingsDropdownOpen: false,
          });
        }
      },

      handleItemClick: label => {
        if (label !== '설정') {
          set({ activeItem: label });
        }

        if (label === '설정') {
          set(prev => ({
            isSettingsDropdownOpen: !prev.isSettingsDropdownOpen,
          }));
        } else {
          set({ isSettingsDropdownOpen: false });
        }
      },

      handleSubMenuClick: (subLabel, parentLabel) => {
        set({ activeItem: subLabel });

        if (parentLabel === '설정') {
          set({ isSettingsDropdownOpen: true });
        }
      },
    }),
    {
      name: 'sidebar-storage',
    }
  )
);
