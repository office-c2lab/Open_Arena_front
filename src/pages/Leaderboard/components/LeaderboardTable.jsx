// src/pages/Leaderboard/components/LeaderboardTable.jsx

import React from "react";
import medalGold from "@/assets/icons/medal_gold.svg";
import medalSilver from "@/assets/icons/medal_silver.svg";
import medalBronze from "@/assets/icons/medal_bronze.svg";
import Skeleton from "@/components/Skeleton/Skeleton";

import { useAuthStore } from "@/stores/authStore";
import { useLeaderboardQuery } from "@/hooks/useLeaderboardQuery";
import { useUserLeaderboardSetting } from "@/hooks/useUserLeaderboardSetting";

// 메달 매핑
const MEDAL_ICON_MAP = { 1: medalGold, 2: medalSilver, 3: medalBronze };

// 열 너비
const COL_WIDTHS = {
  rank: "w-[11%]",
  team: "w-[24%]",
  score: "w-[30%]",
  solved: "flex-1",
};

/* Skeleton */
const LeaderboardTableSkeleton = ({ rows = 12 }) => (
  <div className="relative w-full max-w-[1027px] rounded-[30px] bg-[#0B021C]/80 border-[2px] border-[#FF4854]/60 shadow-[0_0_40px_rgba(255,72,84,0.7)] overflow-hidden">
    <div className="flex items-center h-[79px] heading-3 font-700 border-b border-[#FF4854] text-[#FF4854] bg-[#1A0B15]/90 shadow-[0_0_15px_rgba(255,72,84,0.6)]">
      <div className={`${COL_WIDTHS.rank} text-center`}>순위</div>
      <div className={`${COL_WIDTHS.team} text-center`}>팀명</div>
      <div className={`${COL_WIDTHS.score} text-center`}>점수</div>
      <div className={`${COL_WIDTHS.solved} text-center`}>해결</div>
    </div>

    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center h-[70px] border-b border-[#FF4854]/20 bg-[#14020F]/60">
        <div className={`${COL_WIDTHS.rank} flex justify-center`}>
          <Skeleton className="h-6 w-6 rounded-full bg-[#FF4854]/30" />
        </div>
        <div className={`${COL_WIDTHS.team} flex justify-center`}>
          <Skeleton className="h-6 w-3/4 bg-[#FF4854]/30" />
        </div>
        <div className={`${COL_WIDTHS.score} flex justify-center`}>
          <Skeleton className="h-6 w-2/3 bg-[#FF4854]/30" />
        </div>
        <div className={`${COL_WIDTHS.solved} flex justify-center`}>
          <Skeleton className="h-6 w-1/2 bg-[#FF4854]/30" />
        </div>
      </div>
    ))}
  </div>
);

/* =========================================================
   LeaderboardTable
   ========================================================= */
export default function LeaderboardTable() {
  const teamId = useAuthStore((s) => s.teamInfo?.id);

  // 🔥 공개 상태 조회
  const { data: settingData, isLoading: settingLoading } = useUserLeaderboardSetting();
  const leaderboardEnabled = settingData?.leaderboard_enabled ?? false;

  // 🔥 리더보드 데이터 조회
  const { data, isLoading, error } = useLeaderboardQuery(teamId);

  /* -----------------------------------------
      1) 공개 상태 체크 (OFF면 리턴)
  ----------------------------------------- */
  if (settingLoading) return <div className="text-white">리더보드 설정 확인 중...</div>;

  if (!leaderboardEnabled) {
    return (
      <div className="text-center text-red-400 text-[22px] font-bold py-10">
        ⚠ 리더보드는 현재 <span className="text-[#FF4854]">비공개</span> 상태입니다.
      </div>
    );
  }

  /* -----------------------------------------
      2) Skeleton
  ----------------------------------------- */
  if (isLoading) return <LeaderboardTableSkeleton />;

  if (error) {
    return <div className="text-red-400 text-center">데이터 불러오기 실패</div>;
  }

  /* -----------------------------------------
      3) 정상 데이터 렌더링
  ----------------------------------------- */
  const leaderboard = data?.top ?? [];
  const me = data?.me;

  const rows = leaderboard.some((t) => t.teamname === me?.teamname)
    ? leaderboard
    : [...leaderboard, { ...me, isMyTeamRow: true }];

  return (
    <div
      className="
        relative w-full max-w-[1027px]
        rounded-[30px]
        bg-[#0B021C]/80
        border-[2px] border-[#FF4854]
        shadow-[0_0_40px_rgba(255,72,84,0.7)]
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="flex items-center h-[79px] heading-3 font-700 border-b border-[#FF4854] text-[#FF4854] bg-[#1A0B15]/90 shadow-[0_0_20px_rgba(255,72,84,0.6)]">
        <div className={`${COL_WIDTHS.rank} text-center`}>순위</div>
        <div className={`${COL_WIDTHS.team} text-center`}>팀명</div>
        <div className={`${COL_WIDTHS.score} text-center`}>점수</div>
        <div className={`${COL_WIDTHS.solved} text-center`}>해결</div>
      </div>

      {/* Body */}
      {rows.map((row, idx) => {
        const isMe = row.teamname === me?.teamname;

        return (
          <div
            key={idx}
            className={`
              flex items-center h-[74px]
              border-b border-[#FF4854]/20
              ${isMe ? "bg-[#FF4854]/20 text-[#FF4854] shadow-[0_0_12px_rgba(255,72,84,0.4)]" : "text-white bg-[#120812]/50"}
            `}
          >
            <div className={`${COL_WIDTHS.rank} flex justify-center`}>
              {row.rank <= 3 ? (
                <img src={MEDAL_ICON_MAP[row.rank]} className="w-[42px] h-[42px]" />
              ) : (
                <span className="font-700">{row.rank}</span>
              )}
            </div>

            <div className={`${COL_WIDTHS.team} text-center font-600`}>{row.teamname}</div>
            <div className={`${COL_WIDTHS.score} text-center font-600`}>{row.score}</div>
            <div className={`${COL_WIDTHS.solved} text-center font-600`}>{row.solved_count}</div>
          </div>
        );
      })}
    </div>
  );
}
