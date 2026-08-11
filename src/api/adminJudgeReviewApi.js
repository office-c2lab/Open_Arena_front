import api from './axiosInstance';
import { getAdminUsers } from './adminUsersApi';

const compactParams = params =>
  Object.fromEntries(
    Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== '')
  );

export const fetchAllJudgeUsers = async ({ nickname } = {}) => {
  const items = [];
  let offset = 0;
  let total = 0;

  do {
    const page = await getAdminUsers({
      query: nickname?.trim() || undefined,
      offset,
      limit: 100,
    });
    const pageItems = page.items ?? [];
    items.push(...pageItems);
    total = page.total ?? items.length;
    offset += pageItems.length;

    if (pageItems.length === 0) break;
  } while (offset < total);

  return items;
};

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

export const fetchAllJudgeSessions = async filters => {
  const items = [];
  let offset = 0;
  let total = 0;

  do {
    const page = await fetchJudgeSessions({ ...filters, offset, limit: 100 });
    const pageItems = page.items ?? [];
    items.push(...pageItems);
    total = page.total ?? items.length;
    offset += pageItems.length;

    if (pageItems.length === 0) break;
  } while (offset < total);

  return items;
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
