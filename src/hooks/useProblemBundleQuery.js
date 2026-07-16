// src/hooks/useProblemBundleQuery.js

import { useQuery } from '@tanstack/react-query';
import { emptyProblemBundle } from '@/api/localMockData';

/**
 * 로컬 스타터용 챌린지 번들 placeholder를 반환합니다.
 */
export const useProblemBundleQuery = (problemId, teamId) => {
  const isEnabled = problemId > 0 && teamId > 0;

  return useQuery({
    queryKey: ['problemBundle', problemId, teamId],
    queryFn: async () => emptyProblemBundle,
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  });
};
