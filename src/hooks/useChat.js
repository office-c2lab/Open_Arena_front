import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSession, sendMessage, getSessionMessages } from '@/api/chatApi';

// ✅ 세션 생성 훅
export const useCreateSession = (onSuccessCallback) => {
  return useMutation({
    mutationFn: createSession,
    onSuccess: (data) => {
      console.log('세션 생성 성공:', data);
      if (onSuccessCallback) onSuccessCallback(data);
    },
    onError: (error) => {
      console.error('세션 생성 실패:', error);
      alert(`세션 생성 실패: ${error.message}`);
    },
  });
};

// ✅ 메시지 전송 훅
export const useSendMessage = (sessionId, onSessionUpdate) => {
  const queryClient = useQueryClient();

  return useMutation({
    // ✅ 여기 수정됨
    mutationFn: ({ content, team_id, problem_id }) =>
      sendMessage({
        content,
        team_id,
        problem_id,
        session_id: sessionId, // 서버 요구 필드
      }),

    onSuccess: (data) => {
      console.log('메시지 전송 성공:', data);
      console.log(
        `✅ 메시지 전송 성공! 서버 반환 세션 ID: ${data.session_id}, 현재 세션 ID: ${sessionId}`
      );

      // 새로운 세션이면 세션 갱신
      if (!sessionId && data.session_id && onSessionUpdate) {
        console.log('🆕 새로운 세션 ID 저장:', data.session_id);
        onSessionUpdate(data.session_id);
      }

      // 메시지 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['sessionMessages', sessionId || data.session_id],
      });
    },

    onError: (error) => {
      console.error('메시지 전송 실패:', error);
      alert(
        `메시지 전송 실패: ${
          error.response?.data?.detail || error.message
        }`
      );
    },
  });
};

// ✅ 메시지 조회 훅
export const useSessionMessages = (sessionId, params) => {
  return useQuery({
    queryKey: ['sessionMessages', sessionId],
    queryFn: () => getSessionMessages(sessionId, params),
    enabled: !!sessionId, // sessionId 있을 때만 실행
    staleTime: 5000,
  });
};
