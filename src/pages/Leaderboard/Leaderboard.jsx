import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useLeaderboardQuery } from '@/hooks/useLeaderboardQuery';
import Banner from '@/components/Banner/Banner';
import LeaderboardTable from './components/LeaderboardTable';

export default function Leaderboard() {
  const teamId = useAuthStore(state => state.teamInfo?.id || 1);
  const { data, isLoading, error } = useLeaderboardQuery(teamId);

  if (error) return <div className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다 😢</div>;

  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-[40px]">
      <Banner />
      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1 className="heading-1 font-700 mb-5 text-[#FF4854]">팀별 순위 현황</h1>
        <LeaderboardTable
          isLoading={isLoading}
          leaderboardData={data?.top || []}
          myTeam={data?.me || null}
        />
      </div>
    </div>
  );
}
