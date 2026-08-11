import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminCategory,
  createAdminEndpoint,
  createProtectedTerm,
  deleteAdminCategory,
  deleteAdminEndpoint,
  deleteProtectedTerm,
  getAdminCategories,
  getAdminChallengeSetting,
  getAdminEndpoints,
  getProtectedTerms,
  updateAdminCategory,
  updateAdminChallengeSetting,
  updateAdminEndpoint,
} from '@/api/adminProblemsApi';

export const ADMIN_CATEGORIES_KEY = ['adminCategories'];
export const ADMIN_ENDPOINTS_KEY = ['adminEndpoints'];
export const ADMIN_CHALLENGE_SETTING_KEY = ['adminChallengeSetting'];
export const ADMIN_PROTECTED_TERMS_KEY = ['adminProtectedTerms'];

export const useAdminCategories = () =>
  useQuery({ queryKey: ADMIN_CATEGORIES_KEY, queryFn: getAdminCategories });

export const useAdminEndpoints = kind =>
  useQuery({
    queryKey: [...ADMIN_ENDPOINTS_KEY, kind],
    queryFn: () => getAdminEndpoints(kind),
  });

export const useAdminChallengeSetting = () =>
  useQuery({ queryKey: ADMIN_CHALLENGE_SETTING_KEY, queryFn: getAdminChallengeSetting });

export const useProtectedTerms = problemId =>
  useQuery({
    queryKey: [...ADMIN_PROTECTED_TERMS_KEY, problemId],
    queryFn: () => getProtectedTerms(problemId),
    enabled: Boolean(problemId),
  });

export const useAdminChallengeResourceActions = () => {
  const queryClient = useQueryClient();
  const invalidate = queryKey => queryClient.invalidateQueries({ queryKey });

  const createCategoryMutation = useMutation({
    mutationFn: createAdminCategory,
    onSuccess: () => invalidate(ADMIN_CATEGORIES_KEY),
  });
  const updateCategoryMutation = useMutation({
    mutationFn: updateAdminCategory,
    onSuccess: () => invalidate(ADMIN_CATEGORIES_KEY),
  });
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: () => invalidate(ADMIN_CATEGORIES_KEY),
  });
  const createEndpointMutation = useMutation({
    mutationFn: createAdminEndpoint,
    onSuccess: (_data, variables) => invalidate([...ADMIN_ENDPOINTS_KEY, variables.kind]),
  });
  const updateEndpointMutation = useMutation({
    mutationFn: updateAdminEndpoint,
    onSuccess: (_data, variables) => invalidate([...ADMIN_ENDPOINTS_KEY, variables.kind]),
  });
  const deleteEndpointMutation = useMutation({
    mutationFn: deleteAdminEndpoint,
    onSuccess: (_data, variables) => invalidate([...ADMIN_ENDPOINTS_KEY, variables.kind]),
  });
  const challengeSettingMutation = useMutation({
    mutationFn: updateAdminChallengeSetting,
    onSuccess: data => queryClient.setQueryData(ADMIN_CHALLENGE_SETTING_KEY, data),
  });
  const createTermMutation = useMutation({
    mutationFn: createProtectedTerm,
    onSuccess: (_data, variables) =>
      invalidate([...ADMIN_PROTECTED_TERMS_KEY, variables.problemId]),
  });
  const deleteTermMutation = useMutation({
    mutationFn: deleteProtectedTerm,
    onSuccess: (_data, variables) =>
      invalidate([...ADMIN_PROTECTED_TERMS_KEY, variables.problemId]),
  });

  return {
    createCategory: createCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    createEndpoint: createEndpointMutation.mutateAsync,
    updateEndpoint: updateEndpointMutation.mutateAsync,
    deleteEndpoint: deleteEndpointMutation.mutateAsync,
    updateChallengeSetting: challengeSettingMutation.mutateAsync,
    createProtectedTerm: createTermMutation.mutateAsync,
    deleteProtectedTerm: deleteTermMutation.mutateAsync,
    isSaving:
      createCategoryMutation.isPending ||
      updateCategoryMutation.isPending ||
      deleteCategoryMutation.isPending ||
      createEndpointMutation.isPending ||
      updateEndpointMutation.isPending ||
      deleteEndpointMutation.isPending ||
      challengeSettingMutation.isPending ||
      createTermMutation.isPending ||
      deleteTermMutation.isPending,
  };
};
