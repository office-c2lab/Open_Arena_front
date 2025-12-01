// src/pages/Leaderboard/Leaderboard.jsx
import React from 'react';
import Banner from '@/components/Banner/Banner';
import LeaderboardTable from './components/LeaderboardTable';

export default function Leaderboardago() {
  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-[40px]">
      <Banner />
      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1 className="heading-1 font-700 mb-5 text-[#FF4854]">팀별 순위 현황</h1>
        <LeaderboardTable />
      </div>
    </div>
  );
}
