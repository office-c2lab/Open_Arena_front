// src/layouts/DefaultLayout.jsx

import { Outlet } from 'react-router-dom';
import AppHeader from '@/components/AppHeader/AppHeader';

export default function DefaultLayout() {
  return (
    <div className="min-h-screen w-full bg-[#F2F4F6] overflow-x-hidden">
      <AppHeader />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
