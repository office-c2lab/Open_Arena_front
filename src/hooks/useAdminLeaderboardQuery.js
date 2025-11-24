// src/hooks/useAdminLeaderboardQuery.js
import { useQuery } from "@tanstack/react-query";
import { fetchAdminLeaderboard } from "@/api/adminLeaderboardApi";

export const useAdminLeaderboardQuery = (teamId) => {
  return useQuery({
    queryKey: ["adminLeaderboard", teamId],
    queryFn: () => fetchAdminLeaderboard({ teamId }),
    refetchInterval: 5000, // 5초 폴링 유지
  });
};
