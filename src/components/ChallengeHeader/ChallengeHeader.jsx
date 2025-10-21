// src/components/ChallengeHeader/ChallengeHeader.jsx

import React from 'react';
// 💡 아이콘 경로는 실제 프로젝트 구조에 맞게 수정하세요.
import MenuIcon from '@/assets/icons/toggleSidebar.svg';
import HelpIcon from '@/assets/icons/helpModal.svg';

// 💡 props로 toggleSidebar 함수를 받습니다.
export default function ChallengeHeader({ toggleSidebar }) {
  const handleHelpClick = () => {
    console.log('도움말 모달 열기/라우팅 로직 실행');
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
            <span className="text-white text-[13px] font-medium leading-[17px]">도움</span>
          </button>
        </div>
      </div>
    </header>
  );
}
