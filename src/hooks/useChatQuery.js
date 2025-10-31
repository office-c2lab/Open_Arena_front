// /src/hooks/useChatQuery.js

import { useQuery } from '@tanstack/react-query';
import { fetchMessages } from '../api/chatApi';

/**
 * 💬 채팅 메시지 목록을 조회하는 Query 훅
 * @param {number} sessionId - 조회할 세션 ID
 */
export const useChatMessages = (sessionId) => {
  return useQuery({
    // 쿼리 키에 sessionId를 포함하여 세션별로 캐시 관리
    queryKey: ['chatMessages', sessionId],
    // sessionId가 유효할 때만 fetchMessages 실행
    queryFn: () => fetchMessages(sessionId),
    enabled: !!sessionId, 
    
    // =========================================================
    // 💡 메시지 로드 성공 시 콘솔 출력 (추가된 부분)
    onSuccess: (data) => {
      console.log('--- [useChatMessages 훅] 로드된 메시지 목록 ---');
      console.log(data); 
    },
    // =========================================================
    
    // ⚠️ 참고: defaultOptions에서 staleTime을 5분으로 설정했으므로, 
    // 5분 내에는 캐시된 데이터를 사용합니다.
  });
};