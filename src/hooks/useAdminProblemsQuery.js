import { useQuery } from '@tanstack/react-query';
import { getAdminProblem, getAdminProblems } from '@/api/adminProblemsApi';

export const ADMIN_PROBLEMS_QUERY_KEY = ['adminProblems'];

export const useAdminProblemsQuery = (filters = {}) =>
  useQuery({
    queryKey: [...ADMIN_PROBLEMS_QUERY_KEY, filters],
    queryFn: () => getAdminProblems(filters),
    placeholderData: previousData => previousData,
  });

export const useAdminProblemQuery = problemId =>
  useQuery({
    queryKey: [...ADMIN_PROBLEMS_QUERY_KEY, problemId],
    queryFn: () => getAdminProblem(problemId),
    enabled: Boolean(problemId),
  });
