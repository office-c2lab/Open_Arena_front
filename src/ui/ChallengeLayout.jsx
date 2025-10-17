import { Outlet } from 'react-router-dom';

export default function DefaultLayout() {
  return (
    <div className="min-h-screen w-full bg-[#F2F4F6] flex justify-center">
      {/* 컨텐츠 영역 */}
      <div className="w-[1440px]">
        {/* Header */}
        <header className="h-16 bg-white flex items-center px-6 shadow-md">
          <h1 className="text-2xl font-bold">헤더</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
