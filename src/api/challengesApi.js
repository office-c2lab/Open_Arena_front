import api from './axiosInstance';

export const getChallengeStatus = async () => {
  const { data } = await api.get('/challenges/status');
  return data;
};

export const getChallengeCategories = async () => {
  const { data } = await api.get('/challenges/categories');
  return data;
};

export const getChallengeProblems = async () => {
  const { data } = await api.get('/challenges/problems');
  return data;
};

export const getFavoriteChallengeProblems = async () => {
  const { data } = await api.get('/challenges/favorites');
  return data;
};

export const getChallengeProblem = async problemId => {
  const { data } = await api.get(`/challenges/problems/${problemId}`);
  return data;
};

export const getChallengeProblemRanking = async ({ problemId, offset = 0, limit = 20 }) => {
  const { data } = await api.get(`/challenges/problems/${problemId}/ranking`, {
    params: { offset, limit },
  });
  return data;
};

export const unlockChallengeProblem = async problemId => {
  const { data } = await api.post(`/challenges/problems/${problemId}/unlock`);
  return data;
};

export const favoriteChallengeProblem = async problemId => {
  await api.put(`/challenges/problems/${problemId}/favorite`);
};

export const unfavoriteChallengeProblem = async problemId => {
  await api.delete(`/challenges/problems/${problemId}/favorite`);
};
