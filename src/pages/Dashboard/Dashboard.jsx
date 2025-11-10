// src/pages/Dashboard/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeamInfoSection from './components/TeamInfoSection';
import ProblemList from './components/ProblemList';
import Banner from '@/components/Banner/Banner';
import { useAuthStore } from '@/stores/authStore';
import { useTeamDashboardQuery } from '@/hooks/useTeamDashboardQuery';

const Dashboard = () => {
  const navigate = useNavigate();
  const teamInfo = useAuthStore(state => state.teamInfo);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const teamId = teamInfo?.id || teamInfo?.team_id;

  const { data, isLoading, isError } = useTeamDashboardQuery(teamId);

  if (!isLoggedIn)
    return (
      <div className="flex justify-center items-center h-full text-2xl text-gray-500">
        로그인 후 이용 가능합니다.
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-full text-xl text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );

  const teamName = teamInfo?.teamname ?? 'Team';
  const solvedCount = data?.solved_count ?? 0;
  const totalScore = data?.total_score ?? 0;
  const problems = data?.problems ?? [];

  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-8">
      {/* 배너 */}
      <Banner />

      {/* 팀 정보 */}
      <div className="w-full max-w-[1060px] flex flex-col items-start mx-auto">
        <h1 className="heading-1 font-700 mb-5 text-[#FF4854]">{teamName}</h1>

        <TeamInfoSection isLoading={isLoading} solvedCount={solvedCount} totalScore={totalScore} />
      </div>

      {/* 문제 리스트 */}
      <div className="w-full flex justify-center">
        <ProblemList isLoading={isLoading} problems={problems} />
      </div>
    </div>
  );
};

export default Dashboard;
