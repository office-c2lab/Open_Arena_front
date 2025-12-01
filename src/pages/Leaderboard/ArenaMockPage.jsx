// src/pages/Leaderboard/ArenaMockPage.jsx

import React, { useState } from "react";

import LeaderboardTabs from "./components/LeaderboardTabs";
import LeaderboardTable from "./components/LeaderboardTable";
import TotalLeaderboard from "./components/TotalLeaderboard";
import UnifiedRankBoard from "./components/UnifiedRankBoard";

import {
  mockTotalLeaderboard,
  mockProblemScores,
  mockHackingBoard,
} from "@/hooks/mock/arenaMockData";

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("문제별 상세 현황");

  return (
    <div className="w-full flex flex-col items-center gap-20 py-10">

      {/* ⭐ 탭 */}
      <LeaderboardTabs onChange={setActiveTab} />

      {/* ⭐ 탭별 내용 */}
      {activeTab === "문제별 상세 현황" && (
        <UnifiedRankBoard
          mockProblemScores={mockProblemScores}
          mockHackingBoard={mockHackingBoard}
        />
      )}

      {activeTab === "총점 변화 차트" && (
        <TotalLeaderboard mockData={mockTotalLeaderboard} />
      )}

      {activeTab === "통합 랭크보드" && <LeaderboardTable />}
    </div>
  );
}
