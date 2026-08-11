import { getChallengeProblem } from './challengesApi';

export const fetchProblemBundle = async ({ problem_id }) => {
  const problem = await getChallengeProblem(problem_id);

  return {
    problem: {
      ...problem,
      category: problem.category?.name ?? problem.category,
      score: problem.max_score,
    },
    sessions: [],
  };
};
