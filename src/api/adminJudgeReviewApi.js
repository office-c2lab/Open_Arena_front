import api from './axiosInstance';

const compactParams = params =>
  Object.fromEntries(
    Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== '')
  );

export const fetchJudgeSessions = async ({
  userId,
  problemId,
  submissionStatus,
  verdict,
  offset = 0,
  limit = 20,
} = {}) => {
  const { data } = await api.get('/admin/chat-sessions', {
    params: compactParams({
      user_id: userId,
      problem_id: problemId,
      submission_status: submissionStatus,
      verdict,
      offset,
      limit,
    }),
  });
  return data;
};

export const fetchJudgeMessages = async sessionId => {
  const { data } = await api.get(`/admin/chat-sessions/${sessionId}/messages`);
  return data;
};

export const fetchJudgeSubmissions = async ({ sessionId, offset = 0, limit = 20 }) => {
  const { data } = await api.get(`/admin/chat-sessions/${sessionId}/submissions`, {
    params: { offset, limit },
  });
  return data;
};
