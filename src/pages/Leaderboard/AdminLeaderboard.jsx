// src/pages/Leaderboard/Leaderboard.jsx

import React from 'react';
import Banner from '../../components/Banner/Banner';
import LeaderboardTable from './components/LeaderboardTable';
import PointChart from './components/PointChart'; // <-- PointChart로 파일 이름 변경
import ProblemStatusMatrix from './components/ProblemStatusMatrix';

// =======================================================
// 메인 리더보드 페이지
// =======================================================

const Leaderboard = () => {
  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-[40px]">
      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1
          className="text-[36px] leading-[44px] font-bold font-['Noto Sans KR'] mb-5"
          style={{ color: '#FF4854' }}
        >
          팀별 문제풀이 현황
        </h1>
        <ProblemStatusMatrix />
      </div>
      {/* 2. 팀별 점수 차트 */}
      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1
          className="text-[36px] leading-[44px] font-bold font-['Noto Sans KR'] mb-5"
          style={{ color: '#FF4854' }}
        >
          팀별 점수 차트
        </h1>
        <PointChart /> {/* <-- PointChart 컴포넌트 사용 */}
      </div>
      {/* 3. 팀별 순위 현황 (순위표) */}
      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1
          className="text-[36px] leading-[44px] font-bold font-['Noto Sans KR'] mb-5"
          style={{ color: '#FF4854' }}
        >
          팀별 순위 현황
        </h1>
        <LeaderboardTable />
      </div>
    </div>
  );
};

export default Leaderboard;
