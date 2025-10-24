// /src/store/useSidebarStore.js (persist 적용 및 하위 메뉴 로직 복원)

import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 💡 persist 임포트 추가

// 챌린지의 하위 메뉴 목록 (활성화 상태 결정에 사용)
const CHALLENGE_SUB_MENUS = ['코딩', '상담', '금융', '의료', '일반'];

// 경로, 쿼리 파라미터, 그리고 마지막 선택된 카테고리로부터 활성 레이블을 결정하는 헬퍼 함수
const getActiveLabelByPath = (pathname, search, lastSelectedCategory) => {
  // 쿼리 파라미터를 추출하는 헬퍼 함수
  const getQueryParam = (search, param) => {
    if (!search) return null;
    try {
      const params = new URLSearchParams(search);
      return params.get(param);
    } catch (e) {
      return null;
    }
  };

  // 💡 1. 문제 상세 페이지 경로: 마지막 선택된 카테고리를 활성화
  // `/challenge/C01` 경로일 경우, 저장된 lastSelectedCategory를 사용
  if (pathname.startsWith('/challenge/')) {
    return lastSelectedCategory || '챌린지';
  }

  // 2. /kategorie 경로에 쿼리 파라미터가 있는 경우 (하위 메뉴 필터링)
  if (pathname === '/kategorie' && search) {
    const category = getQueryParam(search, 'category');
    if (category && CHALLENGE_SUB_MENUS.includes(category)) {
      return category; // 예: '코딩' (하위 메뉴 활성화)
    }
  }

  // 3. 정확히 매핑되는 경로 확인
  const PATH_TO_LABEL_MAP = {
    '/': '대시보드',
    '/leaderboard': '리더보드',
    '/tutorial': '튜토리얼',
    '/kategorie': '챌린지',
  };
  if (PATH_TO_LABEL_MAP[pathname]) {
    return PATH_TO_LABEL_MAP[pathname];
  }

  // 4. 기본값
  return '대시보드';
};

// 💡 create 함수를 persist로 감싸서 로컬 스토리지에 상태를 영구 저장합니다.
export const useSidebarStore = create(
  persist(
    (set, get) => ({
      // --------------------
      // 1. 상태 (State)
      // --------------------
      // 💡 새로 추가된 상태 (persist에 의해 저장됩니다.)
      lastSelectedChallengeCategory: null,

      // activeItem 초기값 설정 (persist가 로드된 후 덮어쓰므로 임시값)
      activeItem: '대시보드',
      isAIDropdownOpen: false,
      isSettingsDropdownOpen: false,

      // --------------------
      // 2. 액션 (Actions)
      // --------------------
      // 💡 search 인수를 받도록 변경
      setActiveItemByPath: (pathname, search = '') => {
        const { lastSelectedChallengeCategory } = get(); // 저장된 카테고리 가져오기

        // 💡 lastSelectedChallengeCategory를 getActiveLabelByPath에 전달
        const label = getActiveLabelByPath(pathname, search, lastSelectedChallengeCategory);

        const isChallengeSubMenu = CHALLENGE_SUB_MENUS.includes(label);
        const isChallengeMain = label === '챌린지';

        // 드롭다운 및 액티브 아이템 상태 설정 로직 (이전 로직 복원)
        if (isChallengeMain || isChallengeSubMenu) {
          set({ activeItem: label, isAIDropdownOpen: true, isSettingsDropdownOpen: false });
        } else if (label === '설정') {
          set({ activeItem: label, isSettingsDropdownOpen: true, isAIDropdownOpen: false });
        } else {
          set({ activeItem: label, isAIDropdownOpen: false, isSettingsDropdownOpen: false });
        }
      },

      // 💡 handleItemClick 함수: 메인 탭 클릭 시 lastSelectedChallengeCategory 초기화 추가
      handleItemClick: (label, isDropdown) => {
        set({ activeItem: label });

        if (label === '챌린지') {
          set(prev => ({
            isSettingsDropdownOpen: false,
            isAIDropdownOpen: !prev.isAIDropdownOpen,
            lastSelectedChallengeCategory: null, // 💡 메인 탭 클릭 시 초기화
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

      // 💡 handleSubMenuClick 함수: 하위 메뉴 클릭 시 lastSelectedChallengeCategory 업데이트 추가
      handleSubMenuClick: (subLabel, parentLabel) => {
        set({ activeItem: subLabel });

        if (parentLabel === '챌린지') {
          set({
            isAIDropdownOpen: true,
            isSettingsDropdownOpen: false,
            lastSelectedChallengeCategory: subLabel, // 💡 하위 메뉴 선택 시 저장
          });
        } else if (parentLabel === '설정') {
          set({ isSettingsDropdownOpen: true, isAIDropdownOpen: false });
        }
      },
    }),
    {
      name: 'sidebar-storage', // 로컬 스토리지에 저장될 키 이름
    }
  )
);
