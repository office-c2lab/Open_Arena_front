// src/layouts/DefaultLayout.jsx (수정)

import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';

export default function DefaultLayout() {
  return (
    <div className="min-h-screen w-full bg-[#F2F4F6] flex">
      {/* 💡 [수정] 사이드바와 메인 콘텐츠를 감싸는 래퍼에 좌우 240px 여백을 적용 */}
      <div className="flex-1 w-full flex">
        {/* 1. Sidebar: 240px 여백 안에서 시작 (고정 256px) */}
        <Sidebar />

        {/* 2. Main Area Wrapper */}
        <div className="flex-1 w-full">
          {/* Main Content (Outlet) */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
