import api from './axiosInstance';
import { disabledSetting, emptyList } from './localMockData';

export const fetchLeaderboard = async ({ offset = 0, limit = 20 } = {}) => {
  const { data } = await api.get('/leaderboard', { params: { offset, limit } });
  return data;
};

export const fetchAllLeaderboardEntries = async () => {
  const items = [];
  let offset = 0;
  let total = 0;
  let currentUserRank = null;

  do {
    const page = await fetchLeaderboard({ offset, limit: 100 });
    const pageItems = page.items ?? [];
    items.push(...pageItems);
    total = page.total ?? items.length;
    currentUserRank = page.current_user_rank ?? currentUserRank;
    offset += pageItems.length;

    if (pageItems.length === 0) break;
  } while (offset < total);

  return { items, total, current_user_rank: currentUserRank };
};

export const fetchUserLeaderboardSetting = async () => disabledSetting;
export const fetchSolveMatrix = async () => emptyList;
export const fetchScoreSeriesTotal = async () => emptyList;
