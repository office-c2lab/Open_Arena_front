import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSession } from '@/api/chatApi';
import { useSessionStore } from '@/stores/useSessionStore';
import { chatSessionKeys } from '@/hooks/useChatSessions';
import { appToast } from '@/components/Toast/appToast';

export function useChatSession(teamId, problemId) {
  const queryClient = useQueryClient();
  const { sessionId, setSessionId, setSessionStatus, clearSession } = useSessionStore();

  const createSessionMutation = useMutation({
    mutationFn: title => createSession({ teamId, problemId, title }),
    onSuccess: data => {
      const newSessionId = data?.id ?? data;
      if (newSessionId) {
        setSessionId(newSessionId);
        setSessionStatus('unsubmitted');
        queryClient.invalidateQueries({ queryKey: chatSessionKeys.all });
        queryClient.invalidateQueries({ queryKey: ['chatMessages', newSessionId] });
      }
    },
    onError: error => appToast.error(error.message || '새로운 채팅 세션을 만들지 못했습니다.'),
  });

  const handleSessionClick = newSessionId => {
    if (newSessionId === sessionId) return;
    setSessionId(newSessionId);
    queryClient.invalidateQueries({ queryKey: ['chatMessages', newSessionId, teamId, problemId] });
  };

  return {
    sessionId,
    setSessionId,
    clearSession,
    createSessionMutation,
    handleSessionClick,
  };
}
