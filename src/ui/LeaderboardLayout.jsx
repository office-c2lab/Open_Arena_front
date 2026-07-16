import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import leaderboardBg from '@/assets/images/leaderboard_bg.png';
import AppHeader from '@/components/AppHeader/AppHeader';
import FooterSection from '@/pages/LandingPage/FooterSection';

export default function LeaderboardLayout() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <style>
        {` 
          .leaderboard-scroll::-webkit-scrollbar {
            display: none !important;
          }
          .leaderboard-scroll {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
        `}
      </style>

      <div className="min-h-screen bg-[#0B021C] pt-16">
        <AppHeader />

        <div
          className="
          w-full max-w-[1920px] mx-auto
          h-[calc(100vh-64px)] max-h-[1352px]

          overflow-y-scroll 
          overflow-x-hidden      /* 🔥🔥 가로 스크롤 완전 차단 */

          leaderboard-scroll

          flex flex-col items-center
          bg-[#0B021C]
        "
          style={{
            backgroundImage: `url(${leaderboardBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            overflowX: 'hidden', // 🔥🔥 확실하게 막기 위해 style에도 한 번 더
          }}
        >
          {/* 콘텐츠 */}
          <main className="w-full">
            <Outlet />
          </main>
          <FooterSection />
        </div>
      </div>
    </>
  );
}
