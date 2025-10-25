// src/layouts/DefaultLayout.jsx

import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';

export default function DefaultLayout() {
  return (
    <div className="min-h-screen w-full bg-[#F2F4F6]">
      <Sidebar />

      <div className="ml-[256px]">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
