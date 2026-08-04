// src/pages/Leaderboard/LeaderboardMatrix.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemStatusMatrix from './ProblemStatusMatrix';
import AdminProblemToggleList from './AdminProblemToggleList';

const LeaderboardMatrix = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6 gap-[40px] pb-40">
      {/* 매트릭스 */}
      <div className="w-full flex flex-col items-start gap-4">
        <h1 className="text-page-title font-strong mb-5 text-[#FF4854]">팀별 문제풀이 현황</h1>
        <ProblemStatusMatrix />
      </div>
      <AdminProblemToggleList />
      {/* 🔙 돌아가기 버튼 */}
      <div className="w-full flex justify-center">
        <button
          onClick={() => navigate('/admin/leaderboard')}
          className="px-5 py-2 bg-[#FF4854] hover:bg-[#e13a47] text-white text-card-title font-medium rounded-lg"
        >
          ← 순위 차트로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default LeaderboardMatrix;
