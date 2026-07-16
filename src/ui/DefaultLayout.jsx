// src/layouts/DefaultLayout.jsx

import { Outlet } from 'react-router-dom';
import AppHeader from '@/components/AppHeader/AppHeader';
import FooterSection from '@/pages/LandingPage/FooterSection';

export default function DefaultLayout() {
  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden pt-16">
      <AppHeader />
      <main className="px-[10px] py-6">
        <div className="mx-auto w-full max-w-[1200px]">
          <Outlet />
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
