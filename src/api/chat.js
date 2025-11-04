// src/api/chat.js

import api from './axiosInstance'; // VITE_API_BASE_URL이 설정된 인스턴스

/**
 * 1. POST /chat/sessions: 세션 생성
 * @param {object} sessionData - { team_id, problem_id, title }
 * @returns {Promise<object>} 생성된 세션 정보 { id, team_id, problem_id, title }
 */
export const createChatSession = async (sessionData) => {
  const response = await api.post('/chat/sessions', sessionData);
  return response.data;
};

/**
 * 2. GET /chat/sessions/{session_id}/messages: 세션 메시지 조회
 * @param {number} sessionId - 조회할 세션 ID
 * @returns {Promise<Array<object>>} 메시지 목록
 */
export const getSessionMessages = async (sessionId) => {
  if (!sessionId) {
    return [];
  }
  const response = await api.get(`/chat/sessions/${sessionId}/messages`);
  return response.data;
};

/**
 * 3. POST /chat/sessions/{session_id}/send: 메시지 전송 (프록시 호출)
 * @param {number} sessionId - 메시지를 보낼 세션 ID
 * @param {object} messageBody - 전송할 메시지 본문 (서버 스키마에 따라 조정됨)
 * @returns {Promise<object>} 응답 객체 (예: { assistant_message_id, assistant_content })
 */
export const sendMessage = async ({ sessionId, messageBody }) => {
  // messageBody는 사용자 메시지 내용이 포함된 객체입니다.
  const response = await api.post(`/chat/sessions/${sessionId}/send`, messageBody); 
  return response.data;
};