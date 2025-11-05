// src/api/chat.js (최종 정리 - Uncaught SyntaxError 수정 완료)

import api from './axiosInstance'; 

/**
 * POST /chat/sessions: 세션 생성
 * @param {object} sessionData - 세션 생성에 필요한 데이터 (예: problem_id, team_id, title)
 */
export const createChatSession = async (sessionData) => {
    const response = await api.post('/chat/sessions', sessionData);
    // API 응답 구조에 따라 필요한 데이터 반환 (id는 sessionId로 매핑)
    return { sessionId: response.data.id, ...response.data };
};

/**
 * GET /chat/sessions/{session_id}/messages: 세션 메시지 조회
 * @param {number} sessionId - 조회할 세션 ID (Path Parameter)
 * @param {number} teamId - 세션 소유 팀 ID (Query Parameter)
 * @param {number} problemId - 세션이 속한 문제 ID (Query Parameter)
 */
export const getSessionMessages = async (sessionId, teamId, problemId) => {
    // 세션 ID, 팀 ID, 문제 ID 중 하나라도 유효하지 않으면 요청하지 않고 빈 배열 반환
    if (!sessionId || !teamId || !problemId) {
        console.warn("API 요청 불가: sessionId, teamId, 또는 problemId가 유효하지 않습니다.");
        return [];
    }
    
    // 🚀 [핵심 수정] team_id와 problem_id를 쿼리 파라미터로 추가
    const response = await api.get(`/chat/sessions/${sessionId}/messages`, {
        params: {
            team_id: teamId,
            problem_id: problemId,
        }
    });
    
    // API 응답 구조 ({"session": {...}, "messages": [...]})에 맞게 messages 배열만 추출하여 반환
    return response.data.messages || [];
};

/**
 * POST /chat/sessions/{session_id}/send: 메시지 전송
 * @param {object} params
 * @param {number} params.sessionId - 메시지를 보낼 세션 ID
 * @param {object} params.messageBody - 전송할 메시지 내용 (예: { content: "user message" })
 */
export const sendMessage = async ({ sessionId, messageBody }) => {
    // 💥 [수정 완료] 'const' 중복 제거
    const response = await api.post(`/chat/sessions/${sessionId}/send`, messageBody);
    return response.data;
};