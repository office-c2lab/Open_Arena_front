// src/layouts/ChallengeLayout.jsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from '@/components/AppHeader/AppHeader';
import FooterSection from '@/pages/LandingPage/FooterSection';

export default function ChallengeLayout() {
  const { pathname } = useLocation();
  const isPlayView = pathname.endsWith('/play');

  return (
    <div className="flex min-h-screen w-full flex-col bg-white pt-16">
      <AppHeader />
      <main
        className={
          isPlayView
            ? 'h-[calc(100vh-64px)] overflow-auto p-0'
            : 'h-[calc(100vh-64px)] overflow-auto px-[10px] py-6'
        }
      >
        <div className={isPlayView ? 'h-full w-full' : 'mx-auto w-full max-w-[1200px]'}>
          <Outlet />
        </div>
      </main>
      {!isPlayView && <FooterSection />}
    </div>
  );
}
