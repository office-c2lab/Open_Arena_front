// src/hooks/useTeamDashboardQuery.js
import { useQuery } from '@tanstack/react-query';
import { fetchTeamDashboard } from '@/api/dashboardApi';

export const useTeamDashboardQuery = (teamId) => {
  return useQuery({
    queryKey: ['teamDashboard', teamId],
    queryFn: () => fetchTeamDashboard(teamId),
    enabled: !!teamId,
    staleTime: 1000 * 60 * 5,
  });
};
