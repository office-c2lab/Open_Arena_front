// src/pages/Leaderboard/components/LeaderboardTable.jsx
import React, { useEffect, useState, useRef } from 'react';
import medalGold from '@/assets/icons/medal_gold.svg';
import medalSilver from '@/assets/icons/medal_silver.svg';
import medalBronze from '@/assets/icons/medal_bronze.svg';
import Skeleton from '@/components/Skeleton/Skeleton';
import { fetchLeaderboard, fetchScoreHead } from '@/api/leaderboardApi';
import { useAuthStore } from '@/stores/authStore';

const MEDAL_ICON_MAP = { 1: medalGold, 2: medalSilver, 3: medalBronze };
const COL_WIDTHS = { rank: 'w-[11%]', team: 'w-[24%]', score: 'w-[30%]', solved: 'flex-1' };

const LeaderboardTableSkeleton = ({ rows = 8 }) => (
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
  const teamId = useAuthStore(state => state.teamInfo?.id || 1);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedTeam, setHighlightedTeam] = useState(null); // ✨ 점수 오른 팀 강조
  const lastScoresRef = useRef({});
  const lastHeadRef = useRef(null);

  useEffect(() => {
    let timer;

    const poll = async () => {
      try {
        // 1️⃣ head 조회
        const headRes = await fetchScoreHead();
        const newTimestamp = headRes?.last_success_at;
        const changed = newTimestamp && newTimestamp !== lastHeadRef.current;
        const firstLoad = !lastHeadRef.current;

        if (!changed && !firstLoad) return;
        lastHeadRef.current = newTimestamp;

        // 2️⃣ 리더보드 갱신
        const res = await fetchLeaderboard(teamId);
        setData(res);
        setIsLoading(false);

        // 3️⃣ 점수 변화 감지
        const newScores = {};
        res.top.forEach(team => {
          newScores[team.teamname] = team.score;
          if (lastScoresRef.current[team.teamname] < team.score) {
            setHighlightedTeam(team.teamname);
            setTimeout(() => setHighlightedTeam(null), 3000); // 3초 반짝임
          }
        });
        lastScoresRef.current = newScores;
      } catch (err) {
        console.error('Leaderboard polling error:', err);
        setError(err);
      }
    };

    poll();
    timer = setInterval(poll, 5000);
    return () => clearInterval(timer);
  }, [teamId]);

  if (isLoading) return <LeaderboardTableSkeleton />;
  if (error) return <div className="text-red-500">데이터 불러오기 실패 😢</div>;

  const leaderboardData = data?.top || [];
  const myTeam = data?.me || null;
  const isMyTeamInTop = leaderboardData.some(row => row.teamname === myTeam?.teamname);
  const displayData = isMyTeamInTop ? leaderboardData : [...leaderboardData, { ...myTeam, isMyTeamRow: true }];

  return (
    <div className="relative w-full max-w-[1027px] rounded-[10px] bg-white/80 shadow-md">
      {/* 헤더 */}
      <div className="flex items-center h-[79px] heading-3 border-b border-[#FF4854] text-[#FF4854] font-500">
        <div className={`${COL_WIDTHS.rank} text-center`}>순위</div>
        <div className={`${COL_WIDTHS.team} text-center`}>팀명</div>
        <div className={`${COL_WIDTHS.score} text-center`}>획득한 점수</div>
        <div className={`${COL_WIDTHS.solved} text-center`}>해결한 챌린지</div>
      </div>

      {/* 데이터 행 */}
      {displayData.map((row, idx) => {
        const isMyTeam = row.teamname === myTeam?.teamname;
        const isHighlighted = highlightedTeam === row.teamname; // ✨ 반짝임 팀

        return (
          <div
            key={idx}
            className={`flex items-center h-[79px] border-b border-[#FF4854]/30 heading-3 font-700 transition-all duration-500
              ${isHighlighted ? 'bg-[#FFF5E1]' : ''}
              ${isMyTeam ? 'bg-[#FFF0F3] text-[#FF4854]' : 'text-[#010101]'}`}
          >
            <div className={`${COL_WIDTHS.rank} flex justify-center items-center`}>
              {row.rank <= 3 ? (
                <img src={MEDAL_ICON_MAP[row.rank]} alt={`${row.rank}등`} className="w-[45px] h-[45px]" />
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
