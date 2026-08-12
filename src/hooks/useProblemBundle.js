// src/hooks/useProblemBundle.js (수정)

import { useQuery } from '@tanstack/react-query';
// ⭐️ 순수 API 함수만 임포트
import { fetchProblemBundle } from '@/api/problemApi';

/**
 * 특정 챌린지의 번들 정보(챌린지 상세, API 정보, 세션 목록)를 불러오는 훅
 * @param {number} problemId - 현재 챌린지의 ID (예: 1)
 * @param {number} teamId - 현재 인증된 사용자의 팀 ID (예: 1)
 * @returns {object} React Query 결과 객체
 */
export const useProblemBundle = (problemId, teamId) => {
  const isEnabled = Boolean(problemId);

  return useQuery({
    queryKey: ['problemBundle', problemId, teamId],
    // ⭐️ queryFn에서 순수 API 함수 사용
    queryFn: () => fetchProblemBundle({ problem_id: problemId, team_id: teamId }),
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  });
};
