// src/layouts/DefaultLayout.jsx

import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import { useSidebarStore } from '../stores/useSidebarStore'; // 💡 Store 임포트

export default function DefaultLayout() {
  // 💡 [핵심] Store에서 isCollapsed 상태 구독
  const isCollapsed = useSidebarStore(state => state.isCollapsed);

  // 💡 [핵심] 상태에 따라 마진 클래스를 동적으로 결정
  // 펼침(false, 256px): ml-[256px]
  // 접힘(true, 80px): ml-[80px]
  const mainContentMargin = isCollapsed ? 'ml-[80px]' : 'ml-[256px]';

  return (
    <div className="min-h-screen w-full bg-[#F2F4F6]">
      <Sidebar />

      {/* 💡 [핵심] 동적 마진 클래스와 전환 애니메이션 적용 */}
      <div className={`transition-all duration-300 ${mainContentMargin}`}>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
