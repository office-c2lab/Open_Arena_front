// src/layouts/DefaultLayout.jsx

import { Outlet } from 'react-router-dom';
import AppHeader from '@/components/AppHeader/AppHeader';

export default function DefaultLayout() {
  return (
    <div className="min-h-screen w-full bg-[#F2F4F6] overflow-x-hidden pt-16">
      <AppHeader />
      <main className="px-[10px] py-6">
        <div className="mx-auto w-full max-w-[1200px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
