// /src/hooks/useChatMutation.js (수정된 전체 코드)

import { useMutation } from '@tanstack/react-query';
import { createChatSession, sendMessage } from '../api/chatApi';

/**
 * 🧩 챌린지 시작 시 세션 생성 Mutation 훅
 */
export const useCreateChatSession = () => { // export const O
  return useMutation({
    mutationFn: createChatSession,
  });
};

/**
 * 🚀 채팅 메시지 전송 Mutation 훅
 */
export const useSendMessage = () => { // export const O (중복 제거)
  return useMutation({
    mutationFn: sendMessage,
  });
};