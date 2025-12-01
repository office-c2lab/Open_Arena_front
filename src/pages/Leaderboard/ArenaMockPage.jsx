import React, { useState, useEffect } from "react";

import LeaderboardTabs from "./components/LeaderboardTabs";
import LeaderboardTable from "./components/LeaderboardTable";
import TotalLeaderboard from "./components/TotalLeaderboard";
import UnifiedRankBoard from "./components/UnifiedRankBoard";

const TAB_LIST = ["팀별 점수 차트", "통합 랭크보드"];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState(TAB_LIST[0]);

  // ⭐ 5초마다 자동 탭 변경
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => {
        const currentIndex = TAB_LIST.indexOf(prev);
        const nextIndex = (currentIndex + 1) % TAB_LIST.length;
        return TAB_LIST[nextIndex];
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-20 py-10">

      {/* 탭 */}
      <LeaderboardTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* 페이지 */}
      {activeTab === "팀별 점수 차트" && <TotalLeaderboard />}
      {activeTab === "통합 랭크보드" && <LeaderboardTable />}
    </div>
  );
}
