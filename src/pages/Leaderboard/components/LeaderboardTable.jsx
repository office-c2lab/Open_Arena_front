import React from 'react';
import medalGold from '@/assets/icons/medal_gold.svg';
import medalSilver from '@/assets/icons/medal_silver.svg';
import medalBronze from '@/assets/icons/medal_bronze.svg';
import Skeleton from '@/components/Skeleton/Skeleton';

import { useAuthStore } from '@/stores/authStore';
import { useLeaderboardQuery } from '@/hooks/useLeaderboardQuery';
import { useUserLeaderboardSetting } from '@/hooks/useUserLeaderboardSetting';

// 메달 매핑
const MEDAL_ICON_MAP = { 1: medalGold, 2: medalSilver, 3: medalBronze };

// 열 너비
const COL_WIDTHS = {
  rank: 'w-[10%]',
  team: 'w-[23%]',
  score: 'w-[18%]',
  solved: 'w-[12%]',
  time: 'flex-1', // 해결 시간
};

// 시간 포맷 함수
const formatTime = iso => {
  if (!iso) return '-';
  const date = new Date(iso);
  return (
    date.toLocaleDateString('ko-KR') +
    ' ' +
    date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  );
};

/* ============================================================== */
/* Skeleton Loader */
/* ============================================================== */
const LeaderboardTableSkeleton = ({ rows = 12 }) => (
  <div className="relative w-full max-w-[1027px] rounded-[30px] bg-[#0B021C]/80 border-[2px] border-[#FF4854]/60 shadow-[0_0_40px_rgba(255,72,84,0.7)] overflow-hidden">
    <div className="flex items-center h-[79px] heading-3 font-700 border-b border-[#FF4854] text-[#FF4854] bg-[#1A0B15]/90 shadow-[0_0_15px_rgba(255,72,84,0.6)]">
      <div className={`${COL_WIDTHS.rank} text-center`}>순위</div>
      <div className={`${COL_WIDTHS.team} text-center`}>팀명</div>
      <div className={`${COL_WIDTHS.score} text-center`}>점수</div>
      <div className={`${COL_WIDTHS.solved} text-center`}>해결</div>
      <div className={`${COL_WIDTHS.time} text-center`}>해결 시간</div>
    </div>

    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="flex items-center h-[70px] border-b border-[#FF4854]/20 bg-[#14020F]/60"
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
        <div className={`${COL_WIDTHS.time} flex justify-center`}>
          <Skeleton className="h-6 w-3/4 bg-[#FF4854]/30" />
        </div>
      </div>
    ))}
  </div>
);

/* ============================================================== */
/* LeaderboardTable 본체 */
/* ============================================================== */
export default function LeaderboardTable() {
  const myTeamName = useAuthStore(s => s.teamInfo?.teamname);

  const { data: settingData, isLoading: settingLoading } = useUserLeaderboardSetting();
  const leaderboardEnabled = settingData?.leaderboard_enabled ?? false;

  const { data, isLoading, error } = useLeaderboardQuery();

  if (settingLoading) return <div className="text-white">리더보드 설정 확인 중...</div>;

  if (!leaderboardEnabled) {
    return (
      <div className="text-gray-300 text-center py-10 text-[22px] font-bold">
        공용 리더보드가 현재 비공개 상태입니다.
      </div>
    );
  }

  if (isLoading) return <LeaderboardTableSkeleton />;
  if (error) return <div className="text-red-400 text-center">데이터 불러오기 실패</div>;

  /* ===========================================
     ⭐⭐⭐ “클래스”로 시작하는 팀만 필터링 후
          점수 기반 정렬 + 새 rank 부여
  ============================================ */
  let rows = (data ?? [])
    .filter(row => row.teamname.startsWith("클래스"))
    .sort((a, b) => {
      // 점수 높은 순 → 동일하면 해결 시간 빠른 순
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.last_solved_at) - new Date(b.last_solved_at);
    })
    .map((row, index) => ({
      ...row,
      displayedRank: index + 1 // 새 등수
    }));

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
        <div className={`${COL_WIDTHS.time} text-center`}>최근 해결 시간</div>
      </div>

      {/* Body */}
      {rows.map((row, idx) => {
        const isMe = row.teamname === myTeamName;

        return (
          <div
            key={idx}
            className={`
              flex items-center h-[74px]
              border-b border-[#FF4854]/20
              ${
                isMe
                  ? 'bg-[#FF4854]/20 text-[#FF4854] shadow-[0_0_12px_rgba(255,72,84,0.4)]'
                  : 'text-white bg-[#120812]/50'
              }
            `}
          >
            {/* 순위 또는 메달 */}
            <div className={`${COL_WIDTHS.rank} flex justify-center`}>
              {row.displayedRank <= 3 ? (
                <img src={MEDAL_ICON_MAP[row.displayedRank]} className="w-[42px] h-[42px]" />
              ) : (
                <span className="font-700">{row.displayedRank}</span>
              )}
            </div>

            {/* 팀명 */}
            <div className={`${COL_WIDTHS.team} text-center font-600`}>
              {row.teamname}
            </div>

            {/* 점수 */}
            <div className={`${COL_WIDTHS.score} text-center font-600`}>
              {row.score}
            </div>

            {/* 해결 문제 수 */}
            <div className={`${COL_WIDTHS.solved} text-center font-600`}>
              {row.solved_count}
            </div>

            {/* 해결 시간 */}
            <div className={`${COL_WIDTHS.time} text-center font-600`}>
              {formatTime(row.last_solved_at)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
