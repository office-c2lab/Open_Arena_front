// src/api/leaderboardApi.js
import api from '@/api/axiosInstance';

/**
 * 🏆 팀별 리더보드 데이터 조회 (사용자용)
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
 */
export const fetchScoreSeries = async () => {
  const res = await api.get('/admin/score-series');
  return res.data;
};

/**
 * 🕒 관리자용 최신 success 변경 감지 (폴링용)
 */
export const fetchScoreHead = async () => {
  const res = await api.get('/admin/score-series/head');
  return res.data;
};

/* -----------------------------------------------------
   ⭐️ 관리자용 리더보드 공개 여부 조회 / 토글 추가!
----------------------------------------------------- */

/**
 * 🔍 리더보드 공개 여부 조회 (GET)
 * @returns {Promise<{leaderboard_enabled: boolean}>}
 */
export const fetchLeaderboardSetting = async () => {
  const res = await api.get('/admin/arena/leaderboard-setting');
  return res.data;
};

/**
 * 🔄 리더보드 on/off 토글 (POST)
 * @returns {Promise<{leaderboard_enabled: boolean}>}
 */
export const toggleLeaderboardSetting = async () => {
  const res = await api.post('/admin/arena/leaderboard-setting/toggle');
  return res.data;
};
