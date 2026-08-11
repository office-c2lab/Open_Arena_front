// src/hooks/useProblemBundleQuery.js

import { useQuery } from '@tanstack/react-query';
import { fetchProblemBundle } from '@/api/problemApi';

/**
 * 로컬 스타터용 챌린지 번들 placeholder를 반환합니다.
 */
export const useProblemBundleQuery = (problemId, teamId) => {
  const isEnabled = Boolean(problemId);

  return useQuery({
    queryKey: ['problemBundle', problemId, teamId],
    queryFn: () => fetchProblemBundle({ problem_id: problemId, team_id: teamId }),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  });
};
