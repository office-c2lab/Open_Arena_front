import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar'; // Sidebar 컴포넌트 Import (경로 확인)

export default function DefaultLayout() {
  return (
    // Step 1: 전체 레이아웃 (Sidebar와 Main Area를 가로로 분리)
    // Sidebar와 Main Area 모두 스크롤에 동참합니다.
    <div className="min-h-screen w-full bg-[#F2F4F6] flex">
      {/* Step 2: Sidebar (w-64 = 256px 고정 너비를 가진 Flex Item) */}
      {/* Sidebar 컴포넌트 내부의 'fixed' 클래스는 반드시 제거되어야 합니다. */}
      <Sidebar />

      {/* Step 3: Main Area Wrapper (사이드바 공간 제외, 남은 공간을 모두 차지) */}
      <div className="flex-1 w-full flex justify-center">
        {/* Step 4: Content Container (최대 1440px 제한)
              w-full: 좁은 화면에서는 100% 사용
              max-w-[1440px]: 넓은 화면에서 1440px로 제한 및 중앙 정렬 (justify-center 덕분)
              flex flex-col: Header와 Main을 수직으로 배치
          */}
        <div className="w-full max-w-[1440px] flex flex-col">
          {/* Main Content (Outlet) */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
