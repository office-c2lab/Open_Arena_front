import { useQuery } from '@tanstack/react-query';
import useChatSessionStore from '@/stores/useChatSessionStore';

/**
 * 로컬 스타터용 세션 메시지 placeholder를 반환합니다.
 */
export const useFetchSessionMessages = (problemId, teamId) => {
  const { sessionId } = useChatSessionStore();
  const isSessionActive = problemId && teamId && sessionId;

  return useQuery({
    queryKey: ['sessionMessages', problemId, teamId, sessionId],
    queryFn: async () => [],
    enabled: !!isSessionActive,
    staleTime: 5 * 60 * 1000,
  });
};
