// src/api/leaderboardApi.js
import api from '@/api/axiosInstance';

/**
 * 🏆 팀별 리더보드 데이터 조회
 */
export const fetchLeaderboard = async (teamId, limit = 8) => {
  const res = await api.get('/dashboard/leaderboard', {
    params: { team_id: teamId, limit },
  });
  return res.data;
};

/**
 * 📊 관리자용 팀별 문제풀이 현황 조회
 */
export const fetchSolveMatrix = async (label = 'title') => {
  const res = await api.get('/admin/solve-matrix', {
    params: { label },
  });
  return res.data;
};

/**
 * 📈 관리자용 실시간 점수 시계열 데이터 조회
 * @returns {Promise<{asof: string, top_teams: Array}>}
 */
export const fetchScoreSeries = async () => {
  const res = await api.get('/admin/score-series');
  return res.data;
};

/**
 * 🕒 관리자용 최신 success 변경 감지 (폴링용)
 * @returns {Promise<{last_success_at: string}>}
 */
export const fetchScoreHead = async () => {
  const res = await api.get('/admin/score-series/head');
  return res.data;
};
