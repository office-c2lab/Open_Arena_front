import React from 'react';
import medalGold from '@/assets/icons/medal_gold.svg';
import medalSilver from '@/assets/icons/medal_silver.svg';
import medalBronze from '@/assets/icons/medal_bronze.svg';
import Skeleton from '@/components/Skeleton/Skeleton';

const MEDAL_ICON_MAP = {
  1: medalGold,
  2: medalSilver,
  3: medalBronze,
};

const COL_WIDTHS = {
  rank: 'w-[11%]',
  team: 'w-[24%]',
  score: 'w-[30%]',
  solved: 'flex-1',
};

// 💡 스켈레톤 UI
const LeaderboardTableSkeleton = ({ rows = 8 }) => (
  <div className="relative w-full max-w-[1027px] rounded-[10px] bg-white/80 shadow-md">
    {/* 헤더 */}
    <div className="flex items-center h-[79px] heading-3 border-b border-[#FF4854] text-[#FF4854] font-500">
      <div className={`${COL_WIDTHS.rank} text-center`}>순위</div>
      <div className={`${COL_WIDTHS.team} text-center`}>팀명</div>
      <div className={`${COL_WIDTHS.score} text-center`}>획득한 점수</div>
      <div className={`${COL_WIDTHS.solved} text-center`}>해결한 챌린지</div>
    </div>

    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center h-[79px] border-b border-[#FF4854]/30 px-3">
        <div className={`${COL_WIDTHS.rank} flex justify-center`}>
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div className={`${COL_WIDTHS.team} flex justify-center`}>
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className={`${COL_WIDTHS.score} flex justify-center`}>
          <Skeleton className="h-6 w-2/3" />
        </div>
        <div className={`${COL_WIDTHS.solved} flex justify-center`}>
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export default function LeaderboardTable({
  isLoading = false,
  leaderboardData = [],
  myTeam = null,
}) {
  if (isLoading) return <LeaderboardTableSkeleton />;

  // ✅ 내 팀이 Top 8 안에 포함되어 있는지 확인
  const isMyTeamInTop = leaderboardData.some(row => row.teamname === myTeam?.teamname);

  // ✅ 표시할 데이터 (내 팀이 없으면 아래 추가)
  const displayData = isMyTeamInTop
    ? leaderboardData
    : [...leaderboardData, { ...myTeam, isMyTeamRow: true }];

  return (
    <div className="relative w-full max-w-[1027px] rounded-[10px] bg-white/80 shadow-md">
      {/* 헤더 */}
      <div className="flex items-center h-[79px] heading-3 border-b border-[#FF4854] text-[#FF4854] font-500">
        <div className={`${COL_WIDTHS.rank} text-center`}>순위</div>
        <div className={`${COL_WIDTHS.team} text-center`}>팀명</div>
        <div className={`${COL_WIDTHS.score} text-center`}>획득한 점수</div>
        <div className={`${COL_WIDTHS.solved} text-center`}>해결한 챌린지</div>
      </div>

      {/* 본문 데이터 */}
      {displayData.map((row, idx) => {
        const isMyTeam = row.teamname === myTeam?.teamname;

        // Top 8 끝나고 내 팀이 추가된 경우, 자연스럽게 경계선 추가
        const showSeparator =
          row.isMyTeamRow && displayData.length > 8 && idx === displayData.length - 1;

        return (
          <React.Fragment key={idx}>
            {showSeparator && <div className="h-[1px] bg-[#ccc] opacity-50 w-[95%] mx-auto my-2" />}

            <div
              className={`flex items-center h-[79px] border-b border-[#FF4854]/30 heading-3 font-700 
                ${isMyTeam ? 'bg-[#FFF0F3] text-[#FF4854]' : 'text-[#010101]'}`}
            >
              {/* 순위 */}
              <div className={`${COL_WIDTHS.rank} flex justify-center items-center`}>
                {row.rank <= 3 ? (
                  <img
                    src={MEDAL_ICON_MAP[row.rank]}
                    alt={`${row.rank}등`}
                    className="w-[45px] h-[45px]"
                  />
                ) : (
                  <span>{row.rank}</span>
                )}
              </div>

              {/* 팀명 */}
              <div className={`${COL_WIDTHS.team} text-center`}>{row.teamname}</div>

              {/* 점수 */}
              <div className={`${COL_WIDTHS.score} text-center`}>{row.score}</div>

              {/* 해결한 챌린지 */}
              <div className={`${COL_WIDTHS.solved} text-center`}>{row.solved_count}</div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
