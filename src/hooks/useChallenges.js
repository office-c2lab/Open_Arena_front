import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  favoriteChallengeProblem,
  getChallengeCategories,
  getChallengeProblem,
  getChallengeProblemRanking,
  getChallengeProblems,
  getChallengeStatus,
  getFavoriteChallengeProblems,
  unfavoriteChallengeProblem,
  unlockChallengeProblem,
} from '@/api/challengesApi';

export const challengeKeys = {
  all: ['challenges'],
  status: ['challenges', 'status'],
  categories: ['challenges', 'categories'],
  problems: ['challenges', 'problems'],
  favorites: ['challenges', 'favorites'],
  detail: problemId => ['challenges', 'problem', problemId],
  ranking: (problemId, offset, limit) => [
    'challenges',
    'problem',
    problemId,
    'ranking',
    offset,
    limit,
  ],
};

export const useChallengeStatus = () =>
  useQuery({
    queryKey: challengeKeys.status,
    queryFn: getChallengeStatus,
    staleTime: 60_000,
  });

export const useChallengeCategories = () =>
  useQuery({
    queryKey: challengeKeys.categories,
    queryFn: getChallengeCategories,
    staleTime: 5 * 60_000,
  });

export const useChallengeProblems = () =>
  useQuery({
    queryKey: challengeKeys.problems,
    queryFn: getChallengeProblems,
    staleTime: 60_000,
  });

export const useFavoriteChallengeProblems = ({ enabled = true } = {}) =>
  useQuery({
    queryKey: challengeKeys.favorites,
    queryFn: getFavoriteChallengeProblems,
    enabled,
    staleTime: 30_000,
  });

export const useChallengeProblem = (problemId, { enabled = true } = {}) =>
  useQuery({
    queryKey: challengeKeys.detail(problemId),
    queryFn: () => getChallengeProblem(problemId),
    enabled: Boolean(problemId) && enabled,
    staleTime: 30_000,
  });

export const useChallengeProblemRanking = (problemId, { offset = 0, limit = 20, enabled } = {}) =>
  useQuery({
    queryKey: challengeKeys.ranking(problemId, offset, limit),
    queryFn: () => getChallengeProblemRanking({ problemId, offset, limit }),
    enabled: Boolean(problemId) && enabled !== false,
    staleTime: 30_000,
  });

export const useUnlockChallengeProblem = problemId => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unlockChallengeProblem(problemId),
    onSuccess: problem => {
      queryClient.setQueryData(challengeKeys.detail(problemId), problem);
      queryClient.invalidateQueries({ queryKey: challengeKeys.problems });
    },
  });
};

export const useChallengeFavoriteMutation = problemId => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: isFavorite =>
      isFavorite ? unfavoriteChallengeProblem(problemId) : favoriteChallengeProblem(problemId),
    onMutate: async isFavorite => {
      await queryClient.cancelQueries({ queryKey: challengeKeys.detail(problemId) });
      const previous = queryClient.getQueryData(challengeKeys.detail(problemId));
      queryClient.setQueryData(challengeKeys.detail(problemId), current =>
        current ? { ...current, is_favorite: !isFavorite } : current
      );
      return { previous };
    },
    onError: (_error, _isFavorite, context) => {
      if (context?.previous) {
        queryClient.setQueryData(challengeKeys.detail(problemId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.problems });
      queryClient.invalidateQueries({ queryKey: challengeKeys.favorites });
      queryClient.invalidateQueries({ queryKey: challengeKeys.detail(problemId) });
    },
  });
};
