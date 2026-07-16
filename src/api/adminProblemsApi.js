import { emptyList } from './localMockData';

export const toggleAdminProblemActive = async () => ({ ok: true });
export const getAdminProblems = async () => emptyList;
export const createProblem = async payload => ({ id: 'local-problem', ...payload });
export const updateProblem = async (_problemId, payload) => ({ ok: true, ...payload });
export const deleteProblem = async () => ({ ok: true });
