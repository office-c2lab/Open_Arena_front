import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProblem, deleteProblem } from '@/api/adminProblemsApi';

export const useAdminProblemActions = () => {
  const queryClient = useQueryClient();

  // 문제 수정(PATCH)
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateProblem(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProblems'] });
    },
  });

  // 문제 삭제(DELETE)
  const deleteMutation = useMutation({
    mutationFn: ({ id, confirmation }) => deleteProblem(id, confirmation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProblems'] });
    },
  });

  return {
    // 기능
    updateProblem: updateMutation.mutateAsync,
    deleteProblem: deleteMutation.mutateAsync,

    // 로딩 상태
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
