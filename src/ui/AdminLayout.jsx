// src/ui/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import FloatingMenu from '../components/FloatingMenu/FloatingMenu';

export default function AdminLayout() {
  return (
    <div data-route-scroll-container className="relative w-full min-h-screen bg-[#F7F8FA]">
      {/* 메인 Content */}
      <div className="admin-interactive-scope mx-auto w-full max-w-[1400px] pb-20">
        <Outlet />
      </div>
      {/* 공통 Floating Menu */}
      <FloatingMenu />
    </div>
  );
}
