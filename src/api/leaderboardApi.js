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
 * @param {string} label - 표시 방식 ('code' | 'title')
 * @returns {Promise<{teams: [], problems: [], matrix: [][]}>}
 */
export const fetchSolveMatrix = async (label = 'title') => {
  const res = await api.get('/admin/solve-matrix', {
    params: { label },
  });
  return res.data;
};
