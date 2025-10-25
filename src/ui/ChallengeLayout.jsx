// src/layouts/ChallengeLayout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';

export default function ChallengeLayout() {
  return (
    <div className="min-h-screen w-full bg-[#F2F4F6]">
      <Sidebar />

      <div className="px-[240px]">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
//챌린지 화면에서는 사이드바 닫힘 상태가 디폴트
