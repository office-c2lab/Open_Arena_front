import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProblem } from '@/api/adminProblemsApi';
import { ADMIN_PROBLEMS_QUERY_KEY } from './useAdminProblemsQuery';

export const useCreateProblem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProblem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_PROBLEMS_QUERY_KEY }),
  });
};
