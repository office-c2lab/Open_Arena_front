// src/api/leaderboardApi.js
import api from '@/api/axiosInstance';

/**
 * 사용자 리더보드 조회
 */
export const fetchLeaderboard = async (teamId, limit = 12) => {
  const res = await api.get('/dashboard/leaderboard', {
    params: { team_id: teamId, limit },
  });
  return res.data;
};

/**
 * 🔥 사용자 리더보드 공개 여부 조회
 * GET /dashboard/arena/leaderboard-setting
 */
export const fetchUserLeaderboardSetting = async () => {
  const res = await api.get('/dashboard/arena/leaderboard-setting');
  return res.data;  // { leaderboard_enabled: true/false }
};

/**
 * 관리자용 문제풀이 매트릭스
 */
export const fetchSolveMatrix = async (label = 'title') => {
  const res = await api.get('/admin/solve-matrix', { params: { label } });
  return res.data;
};

export const fetchScoreSeries = async () => {
  const res = await api.get('/admin/score-series');
  return res.data;
};

export const fetchScoreHead = async () => {
  const res = await api.get('/admin/score-series/head');
  return res.data;
};
