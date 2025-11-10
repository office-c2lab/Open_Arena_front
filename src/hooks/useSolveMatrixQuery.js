// src/hooks/useSolveMatrixQuery.js
import { useQuery } from '@tanstack/react-query';
import { fetchSolveMatrix } from '@/api/leaderboardApi';

/**
 * React Query 훅 - solve matrix 데이터 조회
 */
export const useSolveMatrixQuery = (label = 'title') => {
  return useQuery({
    queryKey: ['solveMatrix', label],
    queryFn: () => fetchSolveMatrix(label),
    staleTime: 5 * 60 * 1000, // 5분 동안 캐싱
    retry: 1, // 실패 시 1회 재시도
  });
};
