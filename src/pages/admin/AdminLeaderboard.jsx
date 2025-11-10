// src/pages/Leaderboard/Leaderboard.jsx

import React from 'react';
import Banner from '@/components/Banner/Banner';
import ProblemStatusMatrix from '../Leaderboard/components/ProblemStatusMatrix';
import PointChart from '../Leaderboard/components/PointChart';
import LeaderboardTable from '../Leaderboard/components/LeaderboardTable';


// =======================================================
// 메인 리더보드 페이지 (각 섹션이 자체적으로 데이터 fetch)
// =======================================================

const Leaderboard = () => {
  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-[40px]">
      {/* 1️⃣ Banner */}
      <div>
        <Banner />
      </div>

      {/* 2️⃣ 팀별 문제풀이 현황 */}
      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1 className="heading-1 font-700 mb-5 text-[#FF4854]">
          팀별 문제풀이 현황
        </h1>
        <ProblemStatusMatrix />
      </div>

      {/* 3️⃣ 팀별 점수 차트 */}
      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1 className="heading-1 font-700 mb-5 text-[#FF4854]">
          팀별 점수 차트
        </h1>
        <PointChart />
      </div>

      {/* 4️⃣ 팀별 순위 현황 */}
      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1 className="heading-1 font-700 mb-5 text-[#FF4854]">
          팀별 순위 현황
        </h1>
        <LeaderboardTable />
      </div>
    </div>
  );
};

export default Leaderboard;
