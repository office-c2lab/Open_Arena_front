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
    '/dashboard': '대시보드',
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
      isCollapsed: false,

      activeItem: '대시보드',
      isAIDropdownOpen: false,
      isSettingsDropdownOpen: false, // --------------------
      // 2. 액션 (Actions)
      // --------------------
      toggleCollapsed: () => set(state => ({ isCollapsed: !state.isCollapsed })),

      setActiveItemByPath: (pathname, search = '') => {
        // 💡 [추가] 현재 드롭다운 상태를 가져옵니다.
        const { lastSelectedChallengeCategory, isAIDropdownOpen: currentDropdownState } = get();
        const label = getActiveLabelByPath(pathname, search, lastSelectedChallengeCategory);
        const isChallengeSubMenu = CHALLENGE_SUB_MENUS.includes(label);
        const isChallengeMain = label === '챌린지';

        const isChallengeDetailPage = pathname.startsWith('/challenge/');

        if (isChallengeDetailPage) {
          set({
            activeItem: label,
            isCollapsed: true,
            isAIDropdownOpen: false,
            isSettingsDropdownOpen: false,
          });
          return;
        }

        if (isChallengeMain || isChallengeSubMenu) {
          // 💡 [수정] 챌린지 서브 메뉴라면 열고, 상위 메뉴('챌린지')라면 현재 드롭다운 상태를 유지합니다.
          const shouldOpenAIDropdown = isChallengeSubMenu || currentDropdownState;

          set({
            activeItem: label,
            isAIDropdownOpen: shouldOpenAIDropdown, // 💡 수정된 로직 적용
            isSettingsDropdownOpen: false,
          });
        } else if (label === '설정') {
          set({
            activeItem: label,
            isSettingsDropdownOpen: true,
            isAIDropdownOpen: false,
          });
        } else {
          set({
            activeItem: label,
            isAIDropdownOpen: false,
            isSettingsDropdownOpen: false,
          });
        }
      },

      handleItemClick: (label, isDropdown) => {
        // 💡 [핵심 수정] 드롭다운 메뉴가 아닐 때만 activeItem을 변경합니다.
        if (label !== '챌린지' && label !== '설정') {
          set({ activeItem: label });
        }
        if (label === '챌린지') {
          set(prev => ({
            isSettingsDropdownOpen: false,
            isAIDropdownOpen: !prev.isAIDropdownOpen, // 드롭다운 토글만 수행
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
