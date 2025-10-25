// src/layouts/DefaultLayout.jsx

import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import ChallengeHeader from '../pages/Challenge/components/ChallengeHeader';

export default function DefaultLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen w-full bg-[#F2F4F6] flex flex-col">
      {/* ✅ ChallengeHeader 재사용해서 열고닫기 버튼 그대로 활용 */}
      <ChallengeHeader toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* ✅ 열림 / 닫힘에 따라 메인 영역 margin-left 토글 */}
        <div
          className={`
            flex-1 transition-all duration-300 
            ${isSidebarOpen ? 'ml-[256px]' : 'ml-0'}
          `}
        >
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
