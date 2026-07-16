// src/layouts/ChallengeLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from '@/components/AppHeader/AppHeader';

export default function ChallengeLayout() {
  return (
    <div className="min-h-screen w-full bg-[#F2F4F6]">
      <AppHeader />
      <main className="h-[calc(100vh-64px)] overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
