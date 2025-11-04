// src/hooks/useChatQuery.js

import { useQuery } from '@tanstack/react-query';
import { getSessionMessages } from '@/api/chat';

// ----------------------------------------------------
// 메시지 조회 Query (Challenge.jsx에서 사용)
// ----------------------------------------------------
export const useChatMessages = (sessionId) => {
    return useQuery({
        queryKey: ['chatMessages', sessionId],
        queryFn: () => getSessionMessages(sessionId),
        enabled: !!sessionId,
        // 5초 폴링 (실제 환경에서는 웹소켓 권장)
        refetchInterval: 5000, 
        staleTime: 5000, 
    });
};