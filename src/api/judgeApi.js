import api from './axiosInstance';

const JUDGE_JOB_ERROR_MESSAGES = {
  JUDGE_ENDPOINT_UNAVAILABLE: '현재 Judge 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
  JUDGE_PROVIDER_ERROR: '판정 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  NO_CANDIDATE_MESSAGE: '판정할 AI 응답이 없습니다. 먼저 AI와 대화해 주세요.',
  SUBMISSION_COOLDOWN: '동일한 대화는 30초 후 다시 제출할 수 있습니다.',
  FREE_SUBMISSION_LIMIT_EXCEEDED: '오늘 사용할 수 있는 무료 제출 횟수를 모두 사용했습니다.',
  JOB_CANCELLED: 'Judge 요청이 취소되었습니다.',
};

const createIdempotencyKey = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `judge-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const createAbortError = () => {
  const error = new Error('Judge 요청이 취소되었습니다.');
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

export const getJudgeJobErrorMessage = errorCode =>
  JUDGE_JOB_ERROR_MESSAGES[errorCode] ||
  (errorCode ? `Judge 판정에 실패했습니다. (${errorCode})` : 'Judge 판정에 실패했습니다.');

export const submitForJudgement = async ({ sessionId, idempotencyKey, signal }) => {
  const { data } = await api.post(`/judge/sessions/${sessionId}/submissions`, undefined, {
    headers: { 'Idempotency-Key': idempotencyKey || createIdempotencyKey() },
    signal,
  });
  return data;
};

export const getJudgeJob = async ({ jobId, signal }) => {
  const { data } = await api.get(`/judge/jobs/${jobId}`, { signal });
  return data;
};

export const waitForJudgeJob = async ({ jobId, signal, interval = 1_000 }) => {
  while (!signal?.aborted) {
    const job = await getJudgeJob({ jobId, signal });

    if (job.status === 'succeeded') return job;
    if (job.status === 'failed' || job.status === 'cancelled') {
      const error = new Error(
        getJudgeJobErrorMessage(
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

export const getJudgeSubmissions = async ({ problemId, offset = 0, limit = 20 } = {}) => {
  const { data } = await api.get('/judge/submissions', {
    params: {
      ...(problemId ? { problem_id: problemId } : {}),
      offset,
      limit,
    },
  });
  return data;
};

export const getJudgeSubmission = async submissionId => {
  const { data } = await api.get(`/judge/submissions/${submissionId}`);
  return data;
};
