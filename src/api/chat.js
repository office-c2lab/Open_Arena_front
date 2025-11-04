// src/api/chat.js (최종 정리)

import api from './axiosInstance'; 

/**
 * POST /chat/sessions: 세션 생성
 */
export const createChatSession = async (sessionData) => {
    const response = await api.post('/chat/sessions', sessionData);
    return { sessionId: response.data.id, ...response.data };
};

/**
 * GET /chat/sessions/{session_id}/messages: 세션 메시지 조회
 */
export const getSessionMessages = async (sessionId) => {
    if (!sessionId) {
        return [];
    }
    const response = await api.get(`/chat/sessions/${sessionId}/messages`);
    return response.data;
};

/**
 * POST /chat/sessions/{session_id}/send: 메시지 전송
 */
export const sendMessage = async ({ sessionId, messageBody }) => {
    const response = await api.post(`/chat/sessions/${sessionId}/send`, messageBody);
    return response.data;
};