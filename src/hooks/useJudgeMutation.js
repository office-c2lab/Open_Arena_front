import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitForJudgement, waitForJudgeJob } from '@/api/judgeApi';
import { chatSessionKeys } from '@/hooks/useChatSessions';
import { judgeSubmissionKeys } from '@/hooks/useJudgeSubmissions';

export const useJudgeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    retry: false,
    mutationFn: async ({ sessionId, signal, onAccepted }) => {
      const accepted = await submitForJudgement({ sessionId, signal });
      onAccepted?.(accepted);
      return waitForJudgeJob({ jobId: accepted.job_id, signal });
    },
    onSuccess: job => {
      if (job.submission?.id) {
        queryClient.setQueryData(judgeSubmissionKeys.detail(job.submission.id), job.submission);
      }
      queryClient.invalidateQueries({ queryKey: judgeSubmissionKeys.all });
      queryClient.invalidateQueries({ queryKey: chatSessionKeys.all });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['account', 'usage', 'today'] });
    },
  });
};
