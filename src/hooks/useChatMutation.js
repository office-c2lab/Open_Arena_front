// src/hooks/useChatMutation.js

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChatSession, sendMessage } from '@/api/chat';

// ----------------------------------------------------
// 1. 세션 생성 Mutation (ChallengePage에서 사용)
// ----------------------------------------------------
export const useCreateChatSession = () => {
    return useMutation({
        mutationFn: createChatSession,
        onError: (error) => {
            console.error("세션 생성 실패:", error);
            alert("세션 생성에 실패했습니다. 로그인 상태와 서버 상태를 확인하세요.");
        }
    });
};

// ----------------------------------------------------
// 2. 메시지 전송 Mutation (Challenge.jsx에서 사용)
// ----------------------------------------------------
export const useSendMessage = (sessionId, options) => {
    const queryClient = useQueryClient();

    return useMutation({
        // messageBody는 { content: string } 형태
        mutationFn: ({ messageBody }) => sendMessage({ sessionId, messageBody }),
        
        // onSuccess에서 쿼리 무효화 (Challenge.jsx의 refetch 대신 사용 가능)
        onSuccess: () => {
            // 메시지 전송 성공 후 백그라운드에서 최신 메시지 목록을 다시 가져옴
            queryClient.invalidateQueries({ queryKey: ['chatMessages', sessionId] });
        },
        onError: (error) => {
            console.error("메시지 전송 실패:", error);
            // 롤백은 Challenge.jsx의 onError에서 처리합니다.
        },
        ...options, // Challenge.jsx에서 onMutate, onError 등을 오버라이드할 수 있도록 허용
    });
};