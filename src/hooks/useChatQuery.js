// src/hooks/useChatQuery.js (최종 수정)

import { useQuery } from '@tanstack/react-query';
import { getSessionMessages } from '@/api/chat';

// ----------------------------------------------------
// 메시지 조회 Query (Challenge.jsx에서 사용)
// ----------------------------------------------------
/**
 * 세션 메시지 목록을 조회하는 React Query 훅
 * @param {number | null} sessionId - 조회할 세션 ID
 * @param {number | null} teamId - 세션 소유 팀 ID
 * @param {number | null} problemId - 세션이 속한 문제 ID
 */
export const useChatMessages = (sessionId, teamId, problemId) => {
    // 💡 [핵심 수정 1] queryKey에 teamId와 problemId 추가 (캐싱 분리)
    // 💡 [핵심 수정 2] queryFn에 teamId와 problemId 인자 전달
    // 💡 [핵심 수정 3] enabled 조건 강화: 세 값이 모두 유효할 때만 쿼리 활성화
    const isEnabled = !!sessionId && !!teamId && !!problemId;

    if (!isEnabled) {
        // enabled: false일 때 불필요한 API 요청을 방지합니다.
        // console.log("useChatMessages: 쿼리 비활성화 (필수 파라미터 부족)");
    }

    return useQuery({
        // queryKey에 세 파라미터 모두 포함
        queryKey: ['chatMessages', sessionId, teamId, problemId],
        
        // queryFn에서 세 파라미터를 모두 전달
        queryFn: () => getSessionMessages(sessionId, teamId, problemId),
        
        // 세 값이 모두 유효할 때만 쿼리 실행
        enabled: isEnabled, 
        
        // 5초 폴링 (실제 환경에서는 웹소켓 권장)
        refetchInterval: 5000, 
        staleTime: 5000, 
    });
};