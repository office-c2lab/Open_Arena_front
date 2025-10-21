// src/layouts/ChallengeLayout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import ChallengeHeader from '../components/ChallengeHeader/ChallengeHeader';

export default function ChallengeLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen w-full bg-[#F2F4F6] flex flex-col">
      <ChallengeHeader toggleSidebar={toggleSidebar} />

      <div className="flex-1 w-full flex relative z-10">
        {/* Sidebar: Fixed 포지션, 모달 방식으로 덮어씀 */}
        <Sidebar isChallengeLayout={true} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* 메인 콘텐츠 영역: 사이드바 관련 스타일 제거 */}
        <div className="flex-1 w-full transition-all duration-300">
          {/* Main: Figma의 좌우 240px 레이아웃 여백을 여기서 부여 */}
          <main className="w-full flex-1 px-[240px] py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
