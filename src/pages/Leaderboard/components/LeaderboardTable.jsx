// src/pages/Leaderboard/components/LeaderboardTable.jsx

import React, { useEffect, useState, useRef } from 'react';
import medalGold from '@/assets/icons/medal_gold.svg';
import medalSilver from '@/assets/icons/medal_silver.svg';
import medalBronze from '@/assets/icons/medal_bronze.svg';
import Skeleton from '@/components/Skeleton/Skeleton';
import { fetchLeaderboard } from '@/api/leaderboardApi';
import { useAuthStore } from '@/stores/authStore';

const MEDAL_ICON_MAP = { 1: medalGold, 2: medalSilver, 3: medalBronze };
const COL_WIDTHS = { rank: 'w-[11%]', team: 'w-[24%]', score: 'w-[30%]', solved: 'flex-1' };

const LeaderboardTableSkeleton = ({ rows = 12 }) => (
  <div className="relative w-full max-w-[1027px] rounded-[10px] bg-white/80 shadow-md">
    <div className="flex items-center h-[79px] heading-3 border-b border-[#FF4854] text-[#FF4854] font-500">
      <div className={`${COL_WIDTHS.rank} text-center`}>순위</div>
      <div className={`${COL_WIDTHS.team} text-center`}>팀명</div>
      <div className={`${COL_WIDTHS.score} text-center`}>획득한 점수</div>
      <div className={`${COL_WIDTHS.solved} text-center`}>해결한 챌린지</div>
    </div>

    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center h-[79px] border-b border-[#FF4854]/30 px-3">
        <div className={`${COL_WIDTHS.rank} flex justify-center`}><Skeleton className="h-6 w-6 rounded-full" /></div>
        <div className={`${COL_WIDTHS.team} flex justify-center`}><Skeleton className="h-6 w-3/4" /></div>
        <div className={`${COL_WIDTHS.score} flex justify-center`}><Skeleton className="h-6 w-2/3" /></div>
        <div className={`${COL_WIDTHS.solved} flex justify-center`}><Skeleton className="h-6 w-1/2" /></div>
      </div>
    ))}
  </div>
);

export default function LeaderboardTable() {
  const teamId = useAuthStore(state => state.teamInfo?.id || undefined);

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [highlightedTeam, setHighlightedTeam] = useState(null);

  const lastScoresRef = useRef({});

  /* -------------------- 리더보드 데이터 상시 폴링 -------------------- */
  useEffect(() => {
    let timer;

    const poll = async () => {
      try {
        const res = await fetchLeaderboard(teamId);
        setData(res);
        setIsLoading(false);

        const newScores = {};
        res.top.forEach(team => {
          const prevScore = lastScoresRef.current[team.teamname];
          newScores[team.teamname] = team.score;

          if (prevScore !== undefined && team.score > prevScore) {
            setHighlightedTeam(team.teamname);
            setTimeout(() => setHighlightedTeam(null), 1000);
          }
        });

        lastScoresRef.current = newScores;

      } catch (err) {
        console.error("Leaderboard polling error:", err);
        setError(err);
      }
    };

    poll();
    timer = setInterval(poll, 5000);
    return () => clearInterval(timer);
  }, [teamId]);

  /* ---------------------- UI 렌더링 ------------------------ */

  if (isLoading) return <LeaderboardTableSkeleton />;
  if (error) return <div className="text-red-500">데이터 불러오기 실패 😢</div>;

  const leaderboardData = data?.top || [];
  const myTeam = data?.me || null;
  const isMyTeamInTop = leaderboardData.some(row => row.teamname === myTeam?.teamname);

  const displayData = isMyTeamInTop
    ? leaderboardData
    : [...leaderboardData, { ...myTeam, isMyTeamRow: true }];

  return (
    <div className="relative w-full max-w-[1027px] bg-white/80 shadow-md rounded-[10px]">
      <div className="flex items-center h-[79px] heading-3 border-b border-[#FF4854] text-[#FF4854] font-500">
        <div className={`${COL_WIDTHS.rank} text-center`}>순위</div>
        <div className={`${COL_WIDTHS.team} text-center`}>팀명</div>
        <div className={`${COL_WIDTHS.score} text-center`}>획득한 점수</div>
        <div className={`${COL_WIDTHS.solved} text-center`}>해결한 챌린지</div>
      </div>

      {displayData.map((row, idx) => {
        const isMyTeam = row.teamname === myTeam?.teamname;
        const isHighlighted = highlightedTeam === row.teamname;

        return (
          <div
            key={idx}
            className={`flex items-center h-[79px] border-b border-[#FF4854]/30 heading-3 font-700 transition-all 
              ${isHighlighted ? "bg-[#FFF5E1]" : ""} 
              ${isMyTeam ? "bg-[#FFF0F3] text-[#FF4854]" : "text-[#010101]"}
            `}
          >
            <div className={`${COL_WIDTHS.rank} flex justify-center`}>
              {row.rank <= 3 ? (
                <img src={MEDAL_ICON_MAP[row.rank]} className="w-[45px] h-[45px]" />
              ) : (
                <span>{row.rank}</span>
              )}
            </div>

            <div className={`${COL_WIDTHS.team} text-center`}>{row.teamname}</div>
            <div className={`${COL_WIDTHS.score} text-center`}>{row.score}</div>
            <div className={`${COL_WIDTHS.solved} text-center`}>{row.solved_count}</div>
          </div>
        );
      })}
    </div>
  );
}
