// /src/stores/useSidebarStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 챌린지의 하위 메뉴 목록 (활성화 상태 결정에 사용)
const CHALLENGE_SUB_MENUS = ['코딩', '상담', '금융', '의료', '일반'];

// 경로, 쿼리 파라미터, 그리고 마지막 선택된 카테고리로부터 활성 레이블을 결정하는 헬퍼 함수
const getActiveLabelByPath = (pathname, search, lastSelectedCategory) => {
  const getQueryParam = (search, param) => {
    if (!search) return null;
    try {
      const params = new URLSearchParams(search);
      return params.get(param);
    } catch (e) {
      return null;
    }
  };

  if (pathname.startsWith('/challenge/')) {
    return lastSelectedCategory || '챌린지';
  }

  if (pathname === '/kategorie' && search) {
    const category = getQueryParam(search, 'category');
    if (category && CHALLENGE_SUB_MENUS.includes(category)) {
      return category;
    }
  }

  const PATH_TO_LABEL_MAP = {
    '/': '대시보드',
    '/leaderboard': '리더보드',
    '/tutorial': '튜토리얼',
    '/kategorie': '챌린지',
  };
  if (PATH_TO_LABEL_MAP[pathname]) {
    return PATH_TO_LABEL_MAP[pathname];
  }

  return '대시보드';
};

// create 함수를 persist로 감싸서 로컬 스토리지에 상태를 영구 저장합니다.
export const useSidebarStore = create(
  persist(
    (set, get) => ({
      // --------------------
      // 1. 상태 (State)
      // --------------------
      lastSelectedChallengeCategory: null,
      isCollapsed: false, // 💡 [핵심] 사이드바 콜랩스 상태 (기본값: 펼침)

      activeItem: '대시보드',
      isAIDropdownOpen: false,
      isSettingsDropdownOpen: false,

      // --------------------
      // 2. 액션 (Actions)
      // --------------------
      // 💡 [핵심] 콜랩스 상태 토글 액션
      toggleCollapsed: () => set(state => ({ isCollapsed: !state.isCollapsed })),

      setActiveItemByPath: (pathname, search = '') => {
        const { lastSelectedChallengeCategory } = get();
        const label = getActiveLabelByPath(pathname, search, lastSelectedChallengeCategory);
        const isChallengeSubMenu = CHALLENGE_SUB_MENUS.includes(label);
        const isChallengeMain = label === '챌린지';

        if (isChallengeMain || isChallengeSubMenu) {
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
            lastSelectedChallengeCategory: null,
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
          set({
            isAIDropdownOpen: true,
            isSettingsDropdownOpen: false,
            lastSelectedChallengeCategory: subLabel,
          });
        } else if (parentLabel === '설정') {
          set({ isSettingsDropdownOpen: true, isAIDropdownOpen: false });
        }
      },
    }),
    {
      name: 'sidebar-storage',
    }
  )
);