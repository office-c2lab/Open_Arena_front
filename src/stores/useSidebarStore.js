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

  // 챌린지 상세 페이지 (예: /challenge/123)
  if (pathname.startsWith('/challenge/')) {
    return lastSelectedCategory || '챌린지';
  }

  // 카테고리 페이지 (예: /kategorie?category=코딩)
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
    // '설정' 관련 경로는 이곳에 추가될 수 있습니다.
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
      isCollapsed: false, // 💡 사이드바 콜랩스 상태 (기본값: 펼침)

      activeItem: '대시보드',
      isAIDropdownOpen: false,
      isSettingsDropdownOpen: false,

      // --------------------
      // 2. 액션 (Actions)
      // --------------------

      // 💡 [추가된 액션] 콜랩스 상태를 직접 설정
      setIsCollapsed: value => set({ isCollapsed: value }),

      // 💡 [핵심] 콜랩스 상태 토글 액션
      toggleCollapsed: () => set(state => ({ isCollapsed: !state.isCollapsed })),

      // 💡 [수정] 경로에 따라 활성 아이템 및 isCollapsed 상태를 설정
      setActiveItemByPath: (pathname, search = '') => {
        const { lastSelectedChallengeCategory } = get();
        const label = getActiveLabelByPath(pathname, search, lastSelectedChallengeCategory);
        const isChallengeSubMenu = CHALLENGE_SUB_MENUS.includes(label);
        const isChallengeMain = label === '챌린지';

        // 챌린지 상세 페이지인 경우 isCollapsed: true로 강제 설정
        const shouldCollapse = pathname.startsWith('/challenge/');

        if (isChallengeMain || isChallengeSubMenu) {
          set({
            activeItem: label,
            isAIDropdownOpen: true,
            isSettingsDropdownOpen: false,
            isCollapsed: shouldCollapse, // 💡 챌린지 상세 페이지 진입 시 닫기
          });
        } else if (label === '설정') {
          set({
            activeItem: label,
            isSettingsDropdownOpen: true,
            isAIDropdownOpen: false,
            isCollapsed: false, // 💡 다른 메인 페이지 진입 시 펼침
          });
        } else {
          set({
            activeItem: label,
            isAIDropdownOpen: false,
            isSettingsDropdownOpen: false,
            isCollapsed: false, // 💡 다른 메인 페이지 진입 시 펼침
          });
        }
      },

      handleItemClick: (label, isDropdown) => {
        set({ activeItem: label });

        if (label === '챌린지') {
          set(prev => ({
            isSettingsDropdownOpen: false,
            isAIDropdownOpen: !prev.isAIDropdownOpen,
            lastSelectedChallengeCategory: null,
            isCollapsed: false, // 메인 '챌린지' 탭 클릭 시에는 펼침
          }));
        } else if (label === '설정') {
          set(prev => ({
            isAIDropdownOpen: false,
            isSettingsDropdownOpen: !prev.isSettingsDropdownOpen,
            isCollapsed: false, // '설정' 탭 클릭 시에는 펼침
          }));
        } else {
          set({ isAIDropdownOpen: false, isSettingsDropdownOpen: false, isCollapsed: false }); // 다른 메인 탭 클릭 시 펼침
        }
      },

      handleSubMenuClick: (subLabel, parentLabel) => {
        set({ activeItem: subLabel });

        if (parentLabel === '챌린지') {
          set({
            isAIDropdownOpen: true,
            isSettingsDropdownOpen: false,
            lastSelectedChallengeCategory: subLabel,
            isCollapsed: false, // 챌린지 카테고리 클릭 시에는 펼침
          });
        } else if (parentLabel === '설정') {
          set({ isSettingsDropdownOpen: true, isAIDropdownOpen: false, isCollapsed: false }); // 설정 서브 메뉴 클릭 시에는 펼침
        }
      },
    }),
    {
      name: 'sidebar-storage',
    }
  )
);
