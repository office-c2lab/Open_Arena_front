import { useQuery } from '@tanstack/react-query';
import { getJudgeSubmission, getJudgeSubmissions } from '@/api/judgeApi';

export const judgeSubmissionKeys = {
  all: ['judgeSubmissions'],
  list: (problemId, offset = 0, limit = 20) => ['judgeSubmissions', problemId, offset, limit],
  detail: submissionId => ['judgeSubmissions', 'detail', submissionId],
};

export const useJudgeSubmissions = (problemId, { offset = 0, limit = 20, enabled = true } = {}) =>
  useQuery({
    queryKey: judgeSubmissionKeys.list(problemId, offset, limit),
    queryFn: () => getJudgeSubmissions({ problemId, offset, limit }),
    enabled: Boolean(problemId) && enabled,
    staleTime: 10_000,
    refetchOnMount: 'always',
  });

export const useJudgeSubmission = (submissionId, { enabled = true } = {}) =>
  useQuery({
    queryKey: judgeSubmissionKeys.detail(submissionId),
    queryFn: () => getJudgeSubmission(submissionId),
    enabled: Boolean(submissionId) && enabled,
    staleTime: 30_000,
  });
