import React from 'react';
import medalGold from '../../../assets/icons/medal_gold.svg';
import medalSilver from '../../../assets/icons/medal_silver.svg';
import medalBronze from '../../../assets/icons/medal_bronze.svg';
import { LEADERBOARD_DATA } from '../data/leaderboardData';

const MEDAL_ICON_MAP = {
  1: medalGold,
  2: medalSilver,
  3: medalBronze,
};

const LeaderboardTable = () => {
  // flex 비율을 px 기반 기존 디자인 비율 참고
  const COL_WIDTHS = {
    rank: 'w-[11%]',
    team: 'w-[24%]',
    score: 'w-[30%]',
    solved: 'flex-1',
  };

  const HEADER = [
    { label: '순위', key: 'rank' },
    { label: '팀명', key: 'team' },
    { label: '획득한 점수', key: 'score' },
    { label: '해결한 챌린지', key: 'solved' },
  ];

  return (
    <div
      className="relative w-[1027px] h-auto rounded-[10px] bg-white/80 z-20"
      style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
    >
      <div
        className="absolute inset-0 rounded-[10px] z-0"
        style={{ background: 'rgba(255,255,255,0.8)' }}
      />
      <div className="relative z-10 p-0">
        {/* 전체 데이터: 헤더 포함 */}
        {[{ isHeader: true, ...HEADER }, ...LEADERBOARD_DATA].map((row, idx) => (
          <div
            key={idx}
            className={`flex items-center text-[20px] leading-[26px] h-[79px] font-['Noto Sans KR']
              border-b border-[#FF4854] ${row.isHeader ? 'text-[#FF4854] font-medium' : 'text-[#010101] font-medium'}`}
          >
            {/* 순위 */}
            <div className={`${COL_WIDTHS.rank} flex justify-center items-center`}>
              {row.isHeader ? (
                '순위'
              ) : row.rank <= 3 ? (
                <img
                  src={MEDAL_ICON_MAP[row.rank]}
                  alt={`Rank ${row.rank} Medal`}
                  className="w-[45px] h-[45px]"
                />
              ) : (
                <span>{row.rank}</span>
              )}
            </div>

            {/* 팀명 */}
            <div
              className={`${COL_WIDTHS.team} text-center`}
              style={{ color: row.isHeader ? undefined : row.color }}
            >
              {row.isHeader ? '팀명' : row.team}
            </div>

            {/* 점수 */}
            <div className={`${COL_WIDTHS.score} text-center`}>
              {row.isHeader ? '획득한 점수' : row.score}
            </div>

            {/* 해결한 챌린지 */}
            <div className={`${COL_WIDTHS.solved} text-center`}>
              {row.isHeader ? '해결한 챌린지' : row.solved}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardTable;
