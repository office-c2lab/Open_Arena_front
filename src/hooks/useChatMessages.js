import { useCallback, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSessionMessages, sendMessage, waitForChatJob } from '@/api/chatApi';
import { appToast } from '@/components/Toast/appToast';
import { chatSessionKeys } from '@/hooks/useChatSessions';

export const chatMessageKeys = {
  all: ['chatMessages'],
  list: (sessionId, problemId) => ['chatMessages', sessionId, problemId],
};

const isCancelledError = error => error?.name === 'AbortError' || error?.code === 'ERR_CANCELED';

export function useChatMessages(sessionId, _teamId, problemId, clearSession, setInputValue) {
  const queryClient = useQueryClient();
  const activeRequestControllerRef = useRef(null);
  const messageQueryKey = chatMessageKeys.list(sessionId, problemId);

  useEffect(
    () => () => {
      activeRequestControllerRef.current?.abort();
    },
    []
  );

  const messagesQuery = useQuery({
    queryKey: messageQueryKey,
    queryFn: async ({ signal }) => {
      try {
        const response = await getSessionMessages({ sessionId, signal });
        return response.items;
      } catch (error) {
        if (error.status === 404) {
          clearSession();
          queryClient.removeQueries({ queryKey: chatMessageKeys.all });
          return [];
        }
        throw error;
      }
    },
    enabled: Boolean(sessionId),
    staleTime: 5_000,
  });

  const sendMessageMutation = useMutation({
    retry: false,
    mutationFn: async messagePayload => {
      const content =
        typeof messagePayload === 'string' ? messagePayload : messagePayload?.content || '';
      const targetSessionId =
        typeof messagePayload === 'string' ? sessionId : messagePayload?.sessionId || sessionId;
      const controller = new AbortController();
      activeRequestControllerRef.current = controller;

      const acceptedJob = await sendMessage({
        sessionId: targetSessionId,
        content,
        signal: controller.signal,
      });
      const completedJob = await waitForChatJob({
        jobId: acceptedJob.job_id,
        signal: controller.signal,
      });
      const messageResponse = await getSessionMessages({
        sessionId: targetSessionId,
        signal: controller.signal,
      });
      const assistantMessage = completedJob.result?.assistant_message;
      const messages = [...messageResponse.items];

      if (assistantMessage && !messages.some(message => message.id === assistantMessage.id)) {
        messages.push(assistantMessage);
      }

      return { completedJob, messages, sessionId: targetSessionId };
    },
    onMutate: async messagePayload => {
      const content =
        typeof messagePayload === 'string' ? messagePayload : messagePayload?.content || '';
      const targetSessionId =
        typeof messagePayload === 'string' ? sessionId : messagePayload?.sessionId || sessionId;
      const trimmedContent = content.trim();
      const queryKey = chatMessageKeys.list(targetSessionId, problemId);

      await queryClient.cancelQueries({ queryKey });
      const previousMessages = queryClient.getQueryData(queryKey) ?? [];
      const timestamp = Date.now();

      queryClient.setQueryData(queryKey, [
        ...previousMessages,
        {
          id: `optimistic-user-${timestamp}`,
          role: 'user',
          content: trimmedContent,
          created_at: new Date(timestamp).toISOString(),
        },
        {
          id: `optimistic-assistant-${timestamp}`,
          role: 'assistant',
          content: 'AI가 응답을 생성 중입니다...',
          created_at: new Date(timestamp).toISOString(),
          isTyping: true,
        },
      ]);
      setInputValue?.('');

      return { content: trimmedContent, previousMessages, queryKey };
    },
    onSuccess: (result, _variables, context) => {
      queryClient.setQueryData(context.queryKey, result.messages);
      queryClient.invalidateQueries({ queryKey: chatSessionKeys.all });
      queryClient.invalidateQueries({ queryKey: ['account', 'usage', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['tokenUsage'] });
    },
    onError: (error, _variables, context) => {
      if (context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousMessages);
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
      if (context?.content && !isCancelledError(error)) setInputValue?.(context.content);
      if (!isCancelledError(error)) {
        appToast.error(error.message || '메시지를 전송하지 못했습니다.');
      }
    },
    onSettled: () => {
      activeRequestControllerRef.current = null;
    },
  });

  const cancelPendingMessage = useCallback(() => activeRequestControllerRef.current?.abort(), []);

  return {
    messages: messagesQuery.data ?? [],
    isMessagesLoading: messagesQuery.isLoading,
    messagesError: messagesQuery.error,
    sendMessageMutation,
    cancelPendingMessage,
  };
}
