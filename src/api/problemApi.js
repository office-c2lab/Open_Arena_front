import { getLocalProblemBundle } from './localMockData';

export const fetchProblemBundle = async ({ problem_id }) => getLocalProblemBundle(problem_id);
