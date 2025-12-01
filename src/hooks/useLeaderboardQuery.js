import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard } from '@/api/leaderboardApi';

/**
 * 🪄 리더보드 데이터 조회 훅
 * - 자동 캐싱, 10초마다 자동 새로고침
 */
export const useLeaderboardQuery = () => {
  return useQuery({
    queryKey: ['leaderboard'],   // teamId 제거
    queryFn: fetchLeaderboard,   // 인자 제거
    refetchInterval: 10000,      // 10초마다 새로고침
    staleTime: 5000,
    retry: 1,
  });
};
