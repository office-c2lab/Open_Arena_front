// src/pages/Leaderboard/Leaderboard.jsx (ArenaIcon 제거 및 Absolute/Relative 제거)

import React from 'react';
import Banner from '../../components/Banner/Banner';
// ArenaIcon import 제거 완료

// 리더보드 데이터 (하드코딩)
const LEADERBOARD_DATA = [
  { rank: 1, team: 'TEAM 1', score: 320, solved: 27, color: '#FFBA57', isTop3: true },
  { rank: 2, team: 'TEAM 2', score: 300, solved: 25, color: '#9E9E9E', isTop3: true },
  { rank: 3, team: 'TEAM 3', score: 295, solved: 25, color: '#CE7430', isTop3: true },
  { rank: 4, team: 'TEAM 4', score: 280, solved: 26, color: '#010101', isTop3: false },
  { rank: 5, team: 'TEAM 5', score: 270, solved: 20, color: '#010101', isTop3: false },
  { rank: 6, team: 'TEAM 6', score: 265, solved: 17, color: '#010101', isTop3: false },
  { rank: 7, team: 'TEAM 7', score: 250, solved: 15, color: '#010101', isTop3: false },
];

// 메달 아이콘 경로 (더미)
const MEDAL_ICON_MAP = {
  1: '/assets/icons/medal_gold.svg',
  2: '/assets/icons/medal_silver.svg',
  3: '/assets/icons/medal_bronze.svg',
};

// =======================================================
// 순위표 행 컴포넌트 (변경 없음)
// =======================================================

const LeaderboardRow = ({ data }) => {
  const { rank, team, score, solved, color, isTop3 } = data;

  const rowStyle = {
    borderBottom: '1px solid #FF4854',
  };

  return (
    <div
      className="flex items-center text-[20px] leading-[26px] h-[74px] p-4 font-['Noto Sans KR']"
      style={rowStyle}
    >
      {/* 순위 */}
      <div className="w-[121px] flex justify-start items-center ml-[30px]">
        {isTop3 ? (
          <img
            src={MEDAL_ICON_MAP[rank]}
            alt={`Rank ${rank} Medal`}
            className="w-[45px] h-[45px]"
          />
        ) : (
          <span className="w-[45px] text-center font-medium text-[#010101]">{rank}</span>
        )}
      </div>
      {/* 팀명 */}
      <div className="w-[241px] text-left">
        <span style={{ color }} className={isTop3 ? 'font-bold' : 'font-medium'}>
          {team}
        </span>
      </div>
      {/* 획득한 점수 */}
      <div className="w-[241px] text-left">
        <span className="font-medium text-[#010101]">{score}</span>
      </div>
      {/* 해결한 챌린지 */}
      <div className="flex-grow text-left">
        <span className="font-medium text-[#010101]">{solved}</span>
      </div>
    </div>
  );
};

// =======================================================
// 순위표 테이블 컴포넌트 (z-index 유지)
// =======================================================

const LeaderboardTable = () => {
  return (
    <div
      className="relative w-[1027px] h-auto rounded-[10px] backdrop-blur-[5px] z-20"
      style={{
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
      }}
    >
      {/* Rectangle 4240: 배경 */}
      <div
        className="absolute inset-0 rounded-[10px] z-0"
        style={{ background: 'rgba(255, 255, 255, 0.8)' }}
      />
      {/* 콘텐츠 (z-index 10) */}
      <div className="relative z-10 p-0">
        {/* 헤더 */}
        <div
          className="flex items-center text-[20px] leading-[26px] h-[79px] p-4 font-['Noto Sans KR'] font-medium"
          style={{ borderBottom: '1px solid #FF4854', color: '#FF4854' }}
        >
          <div className="w-[121px] text-left ml-[30px]">순위</div>
          <div className="w-[241px] text-left">팀명</div>
          <div className="w-[241px] text-left">획득한 점수</div>
          <div className="flex-grow text-left">해결한 챌린지</div>
        </div>
        {/* 데이터 행 */}
        {LEADERBOARD_DATA.map(data => (
          <LeaderboardRow key={data.rank} data={data} />
        ))}
      </div>
    </div>
  );
};

// =======================================================
// 팀별 점수 차트 컴포넌트 (z-index 유지)
// =======================================================

const ChartImage = () => {
  const CHART_IMAGE_URL = '/assets/images/team_score_chart.png';

  return (
    <div
      className="relative w-[1027px] h-[595px] rounded-[10px] backdrop-blur-[5px] z-20"
      style={{
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
      }}
    >
      {/* Rectangle 4242: 배경 */}
      <div
        className="absolute inset-0 rounded-[10px] z-0"
        style={{ background: 'rgba(255, 255, 255, 0.8)' }}
      />
      {/* image 308 (차트 이미지) */}
      <img
        src={CHART_IMAGE_URL}
        alt="팀별 점수 차트"
        className="absolute w-[896px] h-[375px] left-[95px] top-[122px] object-cover z-10"
      />
      {/* 텍스트 축 (실제는 차트 이미지에 포함되거나 차트 라이브러리에서 처리) */}
      <div className="absolute inset-0 flex justify-center items-center z-20 opacity-0">
        <span className="text-gray-700">실제 차트 라이브러리로 대체해야 합니다.</span>
      </div>
    </div>
  );
};

// =======================================================
// 메인 리더보드 페이지
// =======================================================

const Leaderboard = () => {
  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-[40px]">
      {/* 1. Banner 컴포넌트 렌더링 */}
      <div className="w-full max-w-[1069px] flex justify-center">
        <Banner />
      </div>
      {/* 2. 팀별 점수 차트 (차트 우선 유지) */}
      {/* z-index 제거. ChartImage 내부에서 relative/absolute를 사용하므로 여기서는 필요 없습니다. */}

      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4">
        <h1
          className="text-[36px] leading-[44px] font-bold font-['Noto Sans KR']"
          style={{ color: '#FF4854' }}
        >
          팀별 점수 차트
        </h1>
        <ChartImage />
      </div>
      {/* 3. 팀별 순위 현황 (순위표) */}
      {/* z-index 제거. LeaderboardTable 내부에서 relative/absolute를 사용하므로 여기서는 필요 없습니다. */}

      <div className="w-full max-w-[1069px] flex flex-col items-start gap-4 mb-[100px]">
        <h1
          className="text-[36px] leading-[44px] font-bold font-['Noto Sans KR']"
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
