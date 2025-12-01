// src/ui/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import FloatingMenu from '../components/FloatingMenu/FloatingMenu';

export default function AdminLayout() {
  return (
    <div className="relative w-full h-full">
      {/* 공통 Header가 필요하면 여기에 */}
      <Outlet />

      {/* 공통 Floating Menu */}
      <FloatingMenu />
    </div>
  );
}
