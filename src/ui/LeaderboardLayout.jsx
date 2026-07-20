import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from '@/components/AppHeader/AppHeader';
import FooterSection from '@/pages/LandingPage/FooterSection';

export default function LeaderboardLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-white pt-16">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterSection />
    </div>
  );
}
