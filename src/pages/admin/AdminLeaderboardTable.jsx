// src/pages/Leaderboard/components/AdminLeaderboardTable.jsx

import React, { useRef, useEffect, useState } from "react";
import medalGold from "@/assets/icons/medal_gold.svg";
import medalSilver from "@/assets/icons/medal_silver.svg";
import medalBronze from "@/assets/icons/medal_bronze.svg";
import Skeleton from "@/components/Skeleton/Skeleton";
import { useAuthStore } from "@/stores/authStore";
import { useAdminLeaderboardQuery } from "@/hooks/useAdminLeaderboardQuery";

const MEDAL_ICON_MAP = { 1: medalGold, 2: medalSilver, 3: medalBronze };
const COL_WIDTHS = { rank: "w-[11%]", team: "w-[24%]", score: "w-[30%]", solved: "flex-1" };

// 스켈레톤 UI
const TableSkeleton = ({ rows = 8 }) => (
  <div className="relative w-full max-w-[1027px] rounded-[10px] bg-white/80 shadow-md">
    <div className="flex items-center h-[79px] heading-3 border-b border-[#FF4854] text-[#FF4854] font-500">
      <div className={`${COL_WIDTHS.rank} text-center`}>순위</div>
      <div className={`${COL_WIDTHS.team} text-center`}>팀명</div>
      <div className={`${COL_WIDTHS.score} text-center`}>획득 점수</div>
      <div className={`${COL_WIDTHS.solved} text-center`}>해결한 문제</div>
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

export default function AdminLeaderboardTable() {
  const teamId = useAuthStore((state) => state.teamInfo?.id || 1);

  const [highlightedTeam, setHighlightedTeam] = useState(null);
  const lastScoresRef = useRef({});

  // 🔥 관리자용 리더보드 데이터
  const { data, isLoading, error } = useAdminLeaderboardQuery(teamId);

  useEffect(() => {
    if (!data || !data.top) return;

    const newScores = {};
    data.top.forEach((team) => {
      newScores[team.teamname] = team.score;

      if (lastScoresRef.current[team.teamname] < team.score) {
        setHighlightedTeam(team.teamname);
        setTimeout(() => setHighlightedTeam(null), 3000);
      }
    });

    lastScoresRef.current = newScores;
  }, [data]);

  if (isLoading) return <TableSkeleton />;
  if (error) return <div className="text-red-500">데이터 불러오기 실패</div>;

  const leaderboard = data.top || [];
  const myTeam = data.me || null;

  return (
    <div className="relative w-full max-w-[1027px] rounded-[10px] bg-white/80 shadow-md">
      {/* 헤더 */}
      <div className="flex items-center h-[79px] heading-3 border-b border-[#FF4854] text-[#FF4854] font-500">
        <div className={`${COL_WIDTHS.rank} text-center`}>순위</div>
        <div className={`${COL_WIDTHS.team} text-center`}>팀명</div>
        <div className={`${COL_WIDTHS.score} text-center`}>획득 점수</div>
        <div className={`${COL_WIDTHS.solved} text-center`}>해결 문제</div>
      </div>

      {/* 본문 */}
      {leaderboard.map((row, idx) => {
        const isHighlighted = highlightedTeam === row.teamname;

        return (
          <div
            key={idx}
            className={`flex items-center h-[79px] border-b border-[#FF4854]/30 heading-3 font-700 transition-all duration-500
              ${isHighlighted ? "bg-[#FFF5E1]" : "text-[#010101]"}`}
          >
            <div className={`${COL_WIDTHS.rank} flex justify-center items-center`}>
              {row.rank <= 3 ? (
                <img
                  src={MEDAL_ICON_MAP[row.rank]}
                  alt="medal"
                  className="w-[45px] h-[45px]"
                />
              ) : (
                <span>{row.rank}</span>
              )}
            </div>

            <div className={`${COL_WIDTHS.team} text-center`}>{row.teamname}</div>
            <div className={`${COL_WIDTHS.score} text-center`}>{row.score}</div>
            <div className={`${COL_WIDTHS.solved} text-center`}>
              {row.solved_count}
            </div>
          </div>
        );
      })}

      {/* 내 팀 정보 */}
      {myTeam && (
        <div className="flex items-center h-[79px] bg-[#FFF0F3] border-t border-[#FF4854] text-[#FF4854] heading-3 font-700">
          <div className={`${COL_WIDTHS.rank} text-center`}>{myTeam.rank}</div>
          <div className={`${COL_WIDTHS.team} text-center`}>{myTeam.teamname}</div>
          <div className={`${COL_WIDTHS.score} text-center`}>{myTeam.score}</div>
          <div className={`${COL_WIDTHS.solved} text-center`}>
            {myTeam.solved_count}
          </div>
        </div>
      )}
    </div>
  );
}
