import api from './axiosInstance';
import { getAdminProblems } from './adminProblemsApi';
import { getAdminUsers } from './adminUsersApi';

const compactParams = params =>
  Object.fromEntries(
    Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== '')
  );

const normalizeSearchValue = value => value?.trim().toLocaleLowerCase('ko-KR') || '';

const findExactMatch = (items, field, value) => {
  const normalizedValue = normalizeSearchValue(value);
  return items.find(item => normalizeSearchValue(item[field]) === normalizedValue);
};

export const resolveJudgeSessionFilterIds = async ({ nickname, problemTitle } = {}) => {
  const normalizedNickname = nickname?.trim();
  const normalizedProblemTitle = problemTitle?.trim();
  const [users, problems] = await Promise.all([
    normalizedNickname
      ? getAdminUsers({ query: normalizedNickname, offset: 0, limit: 100 })
      : Promise.resolve(null),
    normalizedProblemTitle
      ? getAdminProblems({ query: normalizedProblemTitle, offset: 0, limit: 100 })
      : Promise.resolve(null),
  ]);

  const user = normalizedNickname
    ? findExactMatch(users?.items ?? [], 'nickname', normalizedNickname)
    : null;
  const problem = normalizedProblemTitle
    ? findExactMatch(problems?.items ?? [], 'title', normalizedProblemTitle)
    : null;

  if (normalizedNickname && !user) {
    throw new Error(`닉네임이 '${normalizedNickname}'인 회원을 찾지 못했습니다.`);
  }
  if (normalizedProblemTitle && !problem) {
    throw new Error(`제목이 '${normalizedProblemTitle}'인 문제를 찾지 못했습니다.`);
  }

  return {
    userId: user?.id || '',
    problemId: problem?.id || '',
  };
};

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
