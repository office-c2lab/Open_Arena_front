import api from '@/api/axiosInstance';

// 💬 세션 생성
export const createSession = (data) =>
  api.post('/chat/sessions', data).then((res) => res.data);

// 💬 메시지 전송
export const sendMessage = (data) =>
  api.post('/chat/send', data).then((res) => res.data);

// 💬 세션별 메시지 조회
export const getSessionMessages = (sessionId, params) =>
  api
    .get(`/chat/sessions/${sessionId}/messages`, { params })
    .then((res) => res.data);
