import { useQuery } from '@tanstack/react-query';
import { fetchAllLeaderboardEntries, fetchLeaderboard } from '@/api/leaderboardApi';

export const leaderboardKeys = {
  all: ['leaderboard'],
  page: (offset, limit) => ['leaderboard', 'page', offset, limit],
  search: keyword => ['leaderboard', 'search', keyword],
};

export const useLeaderboardQuery = ({ offset = 0, limit = 20, enabled = true } = {}) =>
  useQuery({
    queryKey: leaderboardKeys.page(offset, limit),
    queryFn: () => fetchLeaderboard({ offset, limit }),
    enabled,
    placeholderData: previous => previous,
    staleTime: 30_000,
    retry: 1,
  });

export const useLeaderboardSearchQuery = keyword =>
  useQuery({
    queryKey: leaderboardKeys.search(keyword),
    queryFn: fetchAllLeaderboardEntries,
    enabled: Boolean(keyword),
    staleTime: 30_000,
    select: data => ({
      ...data,
      items: data.items.filter(entry =>
        entry.nickname.toLocaleLowerCase('ko-KR').includes(keyword.toLocaleLowerCase('ko-KR'))
      ),
    }),
  });
