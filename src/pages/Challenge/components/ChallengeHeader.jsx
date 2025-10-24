// src/pages/Challenge/components/ChallengeHeader.jsx

import React from 'react';
// 💡 모달 스토어 임포트 (경로 수정)
import useModalStore from '@/stores/useModalStore';

// 💡 아이콘 경로는 실제 프로젝트 구조에 맞게 수정하세요.
import MenuIcon from '@/assets/icons/toggleSidebar.svg';
import HelpIcon from '@/assets/icons/helpModal.svg';

// 💡 props로 toggleSidebar 함수를 받습니다.
export default function ChallengeHeader({ toggleSidebar }) {
  // --------------------------------------------------------
  // 1. Zustand 스토어에서 openDebugModal 액션 함수 가져오기
  // 💡 액션만 가져올 때는 Zustand 훅을 직접 호출하여 불필요한 리렌더링을 방지합니다.
  // --------------------------------------------------------
  const { openDebugModal } = useModalStore(); // 👈 이렇게 수정!

  // 2. 도움말 버튼 클릭 핸들러
  const handleHelpClick = () => {
    // 💡 디버그 모달 열기 함수 호출
    openDebugModal();
  };

  return (
    <header className="h-[61px] bg-white shadow-md flex-shrink-0 w-full">
      {/* Content Wrapper: 좌우 240px 패딩 적용 */}
      <div
        className="w-full h-full mx-auto flex items-center justify-between"
        style={{ paddingLeft: '240px', paddingRight: '240px' }}
      >
        {/* 1. 좌측 영역: 토글 버튼 */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar} // 💡 prop으로 받은 함수 사용
            className="w-10 h-10 bg-[#837BBD] rounded-lg flex items-center justify-center shadow-md transition-colors hover:bg-[#837BBD]/90"
            aria-label="Toggle Sidebar"
          >
            <img src={MenuIcon} alt="Menu Toggle" className="w-[20px] h-[20px]" />
          </button>
        </div>

        {/* 2. 우측 영역: 도움말 버튼 (통합) */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleHelpClick}
            className="h-10 px-2 bg-[#837BBD] rounded-[5px] flex items-center justify-center gap-1 shadow-md transition-colors hover:bg-[#837BBD]/90"
            aria-label="도움말 열기"
          >
            {/* 아이콘 (왼쪽) - invert 필터로 흰색 강제 */}
            <img src={HelpIcon} alt="Help Icon" className="w-4 h-4" />
            {/* 텍스트 (오른쪽) */}
            <span className="text-white body-medium">도움</span>
          </button>
        </div>
      </div>
    </header>
  );
}
