// src/ui/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import FloatingMenu from '../components/FloatingMenu/FloatingMenu';
import FooterSection from '@/pages/LandingPage/FooterSection';

export default function AdminLayout() {
  return (
    <div className="relative w-full min-h-screen bg-[#F7F8FA]">
      {/* 메인 Content */}
      <div className="pb-20">
        <Outlet />
      </div>

      <FooterSection />

      {/* 공통 Floating Menu */}
      <FloatingMenu />
    </div>
  );
}
