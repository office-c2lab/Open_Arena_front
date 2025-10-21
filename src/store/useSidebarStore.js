// /src/store/useSidebarStore.js (수정)

import { create } from 'zustand';

// 💡 경로와 한글 레이블 매핑 (sidebarData.js의 경로와 레이블 일치 필요)
const PATH_TO_LABEL_MAP = {
  '/': '대시보드',
  '/leaderboard': '리더보드',
  '/tutorial': '튜토리얼',
  '/kategorie': '챌린지',
  // 서브 메뉴 경로는 필요하다면 여기에 추가 (예: '/settings/account': '계정')
};

export const useSidebarStore = create((set, get) => ({
  // --------------------
  // 1. 상태 (State)
  // --------------------
  // 초기값은 빈 문자열로 두거나, PATH_TO_LABEL_MAP의 기본 경로로 설정합니다.
  activeItem: PATH_TO_LABEL_MAP[window.location.pathname] || '대시보드',
  isAIDropdownOpen: false,
  isSettingsDropdownOpen: false,
  // ... (다른 상태 유지)

  // --------------------
  // 2. 액션 (Actions)
  // --------------------

  // 💡 경로 변경 시 activeItem을 설정하는 함수 추가
  setActiveItemByPath: pathname => {
    // 맵에서 현재 경로에 맞는 레이블을 찾고, 없으면 대시보드를 기본값으로 설정
    const label = PATH_TO_LABEL_MAP[pathname] || '대시보드';

    // 해당 레이블이 서브 메뉴의 부모일 경우 드롭다운을 열어줍니다.
    if (label === '챌린지') {
      set({ activeItem: label, isAIDropdownOpen: true, isSettingsDropdownOpen: false });
    } else if (label === '설정') {
      // 만약 '/settings' 경로가 있다면 설정 메뉴를 열고 활성화
      set({ activeItem: label, isSettingsDropdownOpen: true, isAIDropdownOpen: false });
    } else {
      // 일반 메뉴인 경우 활성화만 합니다.
      set({ activeItem: label, isAIDropdownOpen: false, isSettingsDropdownOpen: false });
    }
  },

  // (기존) 메인 메뉴 클릭 핸들러: 그대로 유지
  handleItemClick: (label, isDropdown) => {
    // ... (기존 로직 유지)
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

  // (기존) 서브 메뉴 클릭 핸들러: 그대로 유지
  handleSubMenuClick: (subLabel, parentLabel) => {
    // ... (기존 로직 유지)
    set({ activeItem: subLabel });

    if (parentLabel === '챌린지') {
      set({ isAIDropdownOpen: true, isSettingsDropdownOpen: false });
    } else if (parentLabel === '설정') {
      set({ isSettingsDropdownOpen: true, isAIDropdownOpen: false });
    }
  },
}));
