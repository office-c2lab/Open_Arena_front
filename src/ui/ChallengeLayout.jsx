// src/layouts/ChallengeLayout.jsx

import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
// 💡 [추가] useSidebarStore 임포트
import { useSidebarStore } from '../stores/useSidebarStore';

export default function ChallengeLayout() {
  // 💡 [추가] Zustand 스토어에서 상태 설정 액션을 가져옵니다.
  const setIsCollapsed = useSidebarStore(state => state.setIsCollapsed);

  // 💡 [핵심] 컴포넌트 마운트 시 (챌린지 페이지 진입 시) 사이드바 상태를 닫힘으로 설정합니다.
  useEffect(() => {
    // 챌린지 화면에서는 사이드바를 닫힌 상태(true)로 설정
    setIsCollapsed(true);

    // 이 상태는 언마운트 시(페이지를 벗어날 때) 복구할 필요가 없습니다.
    // 다른 레이아웃(예: DashboardLayout)으로 이동하면, 그 레이아웃이 다시 isCollapsed: false를 설정하거나,
    // useSidebarStore.js의 setActiveItemByPath 로직이 이를 처리해야 합니다.
  }, [setIsCollapsed]);

  // 사이드바가 닫혀도 pl-[120px]는 유지되어야 합니다. (사이드바 컴포넌트가 알아서 처리하므로 레이아웃은 그대로 둡니다.)
  return (
    <div className="min-h-screen w-full bg-[#F2F4F6]">
      <Sidebar />
      <div className="pl-[120px]">
        <main className="p-6 h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
