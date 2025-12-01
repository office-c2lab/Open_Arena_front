// src/pages/Leaderboard/components/LeaderboardTable.jsx

import React, { useEffect, useState, useRef } from "react";
import medalGold from "@/assets/icons/medal_gold.svg";
import medalSilver from "@/assets/icons/medal_silver.svg";
import medalBronze from "@/assets/icons/medal_bronze.svg";
import Skeleton from "@/components/Skeleton/Skeleton";
import { fetchLeaderboard } from "@/api/leaderboardApi";
import { useAuthStore } from "@/stores/authStore";

// 메달 매핑
const MEDAL_ICON_MAP = { 1: medalGold, 2: medalSilver, 3: medalBronze };

// 열 너비
const COL_WIDTHS = {
  rank: "w-[11%]",
  team: "w-[24%]",
  score: "w-[30%]",
  solved: "flex-1",
};

/* -----------------------------------------
   🟥 Skeleton — TotalLeaderboard와 톤 맞춤
------------------------------------------ */
const LeaderboardTableSkeleton = ({ rows = 12 }) => (
  <div
    className="
      relative w-full max-w-[1027px]
      rounded-[30px]
      bg-[#0B021C]/80
      border-[2px] border-[#FF4854]/60
      shadow-[0_0_40px_rgba(255,72,84,0.7)]
      overflow-hidden
    "
  >
    <div
      className="
        flex items-center h-[79px]
        heading-3 font-700
        border-b border-[#FF4854]
        text-[#FF4854]
        bg-[#1A0B15]/90
        shadow-[0_0_15px_rgba(255,72,84,0.6)]
      "
    >
      <div className={`${COL_WIDTHS.rank} text-center`}>순위</div>
      <div className={`${COL_WIDTHS.team} text-center`}>팀명</div>
      <div className={`${COL_WIDTHS.score} text-center`}>점수</div>
      <div className={`${COL_WIDTHS.solved} text-center`}>해결</div>
    </div>

    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="
          flex items-center h-[70px]
          border-b border-[#FF4854]/20
          bg-[#14020F]/60
        "
      >
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

/* ---------------------------------------------------
   🟥 LeaderboardTable — TotalLeaderboard 스타일 완전 적용
--------------------------------------------------- */
export default function LeaderboardTable() {
  const teamId = useAuthStore((s) => s.teamInfo?.id);
  const [data, setData] = useState(null);
  const [highlightedTeam, setHighlightedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const lastScoresRef = useRef({});

  /* ------------------ Polling ------------------ */
  useEffect(() => {
    let timer;

    const poll = async () => {
      try {
        const res = await fetchLeaderboard(teamId);
        setData(res);
        setIsLoading(false);

        const newScores = {};
        res.top.forEach((team) => {
          const prev = lastScoresRef.current[team.teamname];
          newScores[team.teamname] = team.score;

          if (prev !== undefined && team.score > prev) {
            setHighlightedTeam(team.teamname);
            setTimeout(() => setHighlightedTeam(null), 900);
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

  /* ------------------ Render ------------------ */
  if (isLoading) return <LeaderboardTableSkeleton />;
  if (error)
    return <div className="text-red-400 text-center">데이터 불러오기 실패</div>;

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
      <div
        className="
          flex items-center h-[79px]
          heading-3 font-700
          border-b border-[#FF4854]
          text-[#FF4854]
          bg-[#1A0B15]/90
          shadow-[0_0_20px_rgba(255,72,84,0.6)]
        "
      >
        <div className={`${COL_WIDTHS.rank} text-center`}>순위</div>
        <div className={`${COL_WIDTHS.team} text-center`}>팀명</div>
        <div className={`${COL_WIDTHS.score} text-center`}>점수</div>
        <div className={`${COL_WIDTHS.solved} text-center`}>해결</div>
      </div>

      {/* Body */}
      {rows.map((row, idx) => {
        const isMe = row.teamname === me?.teamname;
        const isFlash = highlightedTeam === row.teamname;

        return (
          <div
            key={idx}
            className={`
              flex items-center h-[74px]
              border-b border-[#FF4854]/20
              transition-all duration-300

              ${
                isFlash
                  ? "bg-[#FF4854]/25"
                  : "bg-[#120812]/50"
              }

              ${
                isMe
                  ? "bg-[#FF4854]/20 text-[#FF4854] shadow-[0_0_12px_rgba(255,72,84,0.4)]"
                  : "text-white"
              }
            `}
          >
            <div className={`${COL_WIDTHS.rank} flex justify-center`}>
              {row.rank <= 3 ? (
                <img
                  src={MEDAL_ICON_MAP[row.rank]}
                  className="w-[42px] h-[42px] drop-shadow-[0_0_8px_rgba(255,72,84,0.7)]"
                />
              ) : (
                <span className="font-700">{row.rank}</span>
              )}
            </div>

            <div className={`${COL_WIDTHS.team} text-center font-600`}>
              {row.teamname}
            </div>

            <div className={`${COL_WIDTHS.score} text-center font-600`}>
              {row.score}
            </div>

            <div className={`${COL_WIDTHS.solved} text-center font-600`}>
              {row.solved_count}
            </div>
          </div>
        );
      })}
    </div>
  );
}
