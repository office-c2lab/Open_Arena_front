import api from './axiosInstance';

const CHAT_JOB_ERROR_MESSAGES = {
  CHAT_ENDPOINT_UNAVAILABLE: '현재 채팅 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
  CHAT_PROVIDER_ERROR: 'AI 응답 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  CONTENT_FILTERED: '요청한 메시지는 처리할 수 없습니다. 내용을 수정해 다시 시도해 주세요.',
  FREE_TOKEN_LIMIT_EXCEEDED: '오늘 사용할 수 있는 무료 AI 토큰을 모두 사용했습니다.',
  TOKEN_LIMIT_EXCEEDED: '사용 가능한 AI 토큰 한도를 초과했습니다.',
  JOB_CANCELLED: '채팅 요청이 취소되었습니다.',
};

const createIdempotencyKey = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const createAbortError = () => {
  const error = new Error('채팅 요청이 취소되었습니다.');
  error.name = 'AbortError';
  return error;
};

const wait = (milliseconds, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    const handleAbort = () => {
      window.clearTimeout(timeoutId);
      reject(createAbortError());
    };
    const timeoutId = window.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort);
      resolve();
    }, milliseconds);
    signal?.addEventListener('abort', handleAbort, { once: true });
  });

export const getChatJobErrorMessage = errorCode =>
  CHAT_JOB_ERROR_MESSAGES[errorCode] ||
  (errorCode ? `AI 응답 생성에 실패했습니다. (${errorCode})` : 'AI 응답 생성에 실패했습니다.');

export const createSession = async ({ problemId, title } = {}) => {
  const { data } = await api.post('/chats/sessions', {
    problem_id: problemId,
    title: title?.trim() || null,
  });
  return data;
};

export const getSessions = async ({ problemId, offset = 0, limit = 20 } = {}) => {
  const { data } = await api.get('/chats/sessions', {
    params: {
      ...(problemId ? { problem_id: problemId } : {}),
      offset,
      limit,
    },
  });
  return data;
};

export const getSessionMessages = async ({ sessionId, signal } = {}) => {
  const { data } = await api.get(`/chats/sessions/${sessionId}/messages`, { signal });
  return data;
};

export const sendMessage = async ({ sessionId, content, idempotencyKey, signal } = {}) => {
  const { data } = await api.post(
    `/chats/sessions/${sessionId}/messages`,
    { content: content.trim() },
    {
      headers: { 'Idempotency-Key': idempotencyKey || createIdempotencyKey() },
      signal,
    }
  );
  return data;
};

export const getChatJob = async ({ jobId, signal } = {}) => {
  const { data } = await api.get(`/chats/jobs/${jobId}`, { signal });
  return data;
};

export const waitForChatJob = async ({ jobId, signal, interval = 1_000 }) => {
  while (!signal?.aborted) {
    const job = await getChatJob({ jobId, signal });

    if (job.status === 'succeeded') return job;
    if (job.status === 'failed' || job.status === 'cancelled') {
      const error = new Error(
        getChatJobErrorMessage(
          job.error_code || (job.status === 'cancelled' ? 'JOB_CANCELLED' : null)
        )
      );
      error.code = job.error_code || job.status;
      throw error;
    }

    await wait(interval, signal);
  }

  throw createAbortError();
};
