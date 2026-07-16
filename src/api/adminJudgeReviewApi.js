import { emptyList } from './localMockData';

export const fetchJudgeTeams = async () => emptyList;
export const fetchJudgeProblems = async () => emptyList;
export const fetchJudgeSessions = async () => emptyList;
export const fetchJudgeMessages = async () => emptyList;
export const fetchJudgeResult = async () => null;
export const markSessionFail = async () => ({ ok: true });
export const markSessionSuccess = async () => ({ ok: true });
