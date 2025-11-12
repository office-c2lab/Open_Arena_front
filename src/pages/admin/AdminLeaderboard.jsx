// src/pages/Leaderboard/Leaderboard.jsx

import React from 'react';
import Banner from '@/components/Banner/Banner';
import ProblemStatusMatrix from '../Leaderboard/components/ProblemStatusMatrix';
import PointChart from '../Leaderboard/components/PointChart';
import LeaderboardTable from '../Leaderboard/components/LeaderboardTable';

const Leaderboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6 gap-[40px] pb-40">
      
      {/* 1️⃣ Banner */}
      <div className="relative w-full flex justify-center">
        <Banner />
      </div>

      {/* 2️⃣ 팀별 문제풀이 현황 */}
      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1 className="heading-1 font-700 mb-5 text-[#FF4854]">팀별 문제풀이 현황</h1>
        <ProblemStatusMatrix />
      </div>

      {/* 3️⃣ 팀별 점수 차트 */}
      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1 className="heading-1 font-700 mb-5 text-[#FF4854]">팀별 점수 차트</h1>
        <PointChart />
      </div>

      {/* 4️⃣ 팀별 순위 현황 */}
      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1 className="heading-1 font-700 mb-5 text-[#FF4854]">팀별 순위 현황</h1>
        <LeaderboardTable />
      </div>
       {/*  로그아웃 버튼 (배너 우측 상단) */}
        <button
          onClick={handleLogout}
          className=" px-5 py-2 bg-[#FF4854] hover:bg-[#e13a47] text-white heading-3 font-500 rounded-lg transition-colors"
        >
          로그아웃
        </button>
    </div>
  );
};

export default Leaderboard;
