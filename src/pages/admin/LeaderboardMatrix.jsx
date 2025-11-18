// src/pages/Leaderboard/LeaderboardMatrix.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemStatusMatrix from './ProblemStatusMatrix';

const LeaderboardMatrix = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6 gap-[40px] pb-40">

      {/* 🔙 돌아가기 버튼 */}
      <div className="w-full max-w-[1069px] flex justify-end">
        <button
          onClick={() => navigate('/leaderboard')}
          className="px-5 py-2 bg-[#580093] hover:bg-[#7212b8] text-white heading-3 font-500 rounded-lg"
        >
          ← 순위 차트로 돌아가기
        </button>
      </div>

      {/* 매트릭스 */}
      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1 className="heading-1 font-700 mb-5 text-[#FF4854]">팀별 문제풀이 현황</h1>
        <ProblemStatusMatrix />
      </div>

    </div>
  );
};

export default LeaderboardMatrix;
