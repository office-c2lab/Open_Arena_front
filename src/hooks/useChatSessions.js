import { useQuery } from '@tanstack/react-query';
import { getSessions } from '@/api/chatApi';

export const chatSessionKeys = {
  all: ['chatSessions'],
  list: (problemId, offset = 0, limit = 20) => ['chatSessions', problemId, offset, limit],
};

export const useChatSessions = (problemId, { offset = 0, limit = 20, enabled = true } = {}) =>
  useQuery({
    queryKey: chatSessionKeys.list(problemId, offset, limit),
    queryFn: () => getSessions({ problemId, offset, limit }),
    enabled: Boolean(problemId) && enabled,
    staleTime: 10_000,
    refetchOnMount: 'always',
  });
