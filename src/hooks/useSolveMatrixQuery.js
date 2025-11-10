// src/hooks/useSolveMatrixQuery.js
import { useQuery } from '@tanstack/react-query';
import { fetchSolveMatrix, fetchScoreHead } from '@/api/leaderboardApi';

/**
 * 🧩 실시간 Solve Matrix 자동 갱신 훅
 * - /admin/score-series/head 변화 감지 → solve-matrix 재요청
 * - 5초 간격으로 폴링
 */
export const useSolveMatrixQuery = (label = 'title', interval = 5000) => {
  return useQuery({
    queryKey: ['solveMatrix', label],
    queryFn: async () => {
      // head 먼저 확인
      try {
        await fetchScoreHead(); // 변경 감지용 (응답만 확인)
      } catch (err) {
        console.warn('⚠️ head fetch 실패, solve-matrix 직접 호출');
      }
      // solve-matrix 요청
      return await fetchSolveMatrix(label);
    },
    refetchInterval: interval, // ✅ 5초마다 자동 갱신
    refetchOnWindowFocus: true, // 창 포커스 돌아오면 갱신
    staleTime: 0, // 매번 새 데이터
    retry: 1, // 실패 시 1회 재시도
  });
};
