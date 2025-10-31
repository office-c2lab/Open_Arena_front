// /src/api/chatApi.js

import api from "./axiosInstance"; 

/**
 * 🧩 새로운 채팅 세션 생성 API (POST /chat/sessions)
 */
export const createChatSession = async ({ problem_id, team_id, title }) => {
  try {
    const response = await api.post("/chat/sessions", {
      problem_id,
      team_id,
      title,
    });
    // ✅ 성공 메시지 추가
    console.log(`[API] ✅ 세션 생성 성공: ID ${response.data.session.id}`);
    return { sessionId: response.data.session.id }; 
  } catch (error) {
    console.error("[API] ❌ 세션 생성 실패:", error);
    throw error;
  }
};

/**
 * 💬 기존 채팅 메시지 조회 API (GET /chat/sessions/{session_id}/messages)
 */
export const fetchMessages = async (sessionId) => {
  try {
    const response = await api.get(`/chat/sessions/${sessionId}/messages`);
    const count = response.data.messages ? response.data.messages.length : 0;
    // ✅ 성공 메시지 추가
    console.log(`[API] ✅ 메시지 조회 성공: 세션 ${sessionId}에서 ${count}개 메시지 로드`);
    return response.data.messages || [];
  } catch (error) {
    console.error("[API] ❌ 메시지 조회 실패:", error);
    throw error;
  }
};

/**
 * 🚀 메시지 전송 API (POST /chat/sessions/{session_id}/send)
 */
export const sendMessage = async ({ sessionId, message }) => {
  try {
    const response = await api.post(`/chat/sessions/${sessionId}/send`, { 
      // 백엔드에서 기대하는 필드를 모두 포함
      content: message,           
      user_id: sessionId,         
      options: {}                 
    });
    // ✅ 성공 메시지 추가
    console.log(`[API] ✅ 메시지 전송 성공: 세션 ${sessionId}`);
    return response.data; // { user_message, assistant_message }
  } catch (error) {
    // ❌ 502 Bad Gateway 발생 시 이 블록이 실행됩니다.
    console.error("[API] ❌ 메시지 전송 실패:", error);
    throw error;
  }
};