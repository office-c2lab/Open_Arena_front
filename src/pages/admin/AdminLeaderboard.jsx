// src/pages/Leaderboard/Leaderboard.jsx

import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useLeaderboardQuery } from '@/hooks/useLeaderboardQuery';
import Banner from '@/components/Banner/Banner';
import ProblemStatusMatrix from '../Leaderboard/components/ProblemStatusMatrix';
import PointChart from '../Leaderboard/components/PointChart';
import LeaderboardTable from '../Leaderboard/components/LeaderboardTable';

// =======================================================
// 메인 리더보드 페이지 (실제 API 연동 버전)
// =======================================================

const Leaderboard = () => {
  const teamId = useAuthStore(state => state.teamInfo?.id || 1);
  const { data, isLoading, error } = useLeaderboardQuery(teamId);

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center text-red-500 text-xl font-semibold">
        ⚠️ 데이터를 불러오는 중 오류가 발생했습니다 😢
      </div>
    );
  }

  // ✅ API 응답 구조 해석
  const leaderboardData = data?.top || [];
  const myTeam = data?.me || null;

  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-[40px]">
      {/* 1️⃣ Banner */}
      <div>
        <Banner />
      </div>

      {/* 2️⃣ 팀별 문제풀이 현황 */}
      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1 className="heading-1 font-700 mb-5 text-[#FF4854]">팀별 문제풀이 현황</h1>
        <ProblemStatusMatrix isLoading={isLoading} leaderboardData={leaderboardData} />
      </div>

      {/* 3️⃣ 팀별 점수 차트 */}
      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1 className="heading-1 font-700 mb-5 text-[#FF4854]">팀별 점수 차트</h1>
        <PointChart isLoading={isLoading} leaderboardData={leaderboardData} myTeam={myTeam} />
      </div>

      {/* 4️⃣ 팀별 순위 현황 */}
      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1 className="heading-1 font-700 mb-5 text-[#FF4854]">팀별 순위 현황</h1>
        <LeaderboardTable isLoading={isLoading} leaderboardData={leaderboardData} myTeam={myTeam} />
      </div>
    </div>
  );
};

export default Leaderboard;
