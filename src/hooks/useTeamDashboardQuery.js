// src/hooks/useTeamDashboardQuery.js
import { useQuery } from '@tanstack/react-query';
import { fetchTeamDashboard } from '@/api/dashboardApi';

export const useTeamDashboardQuery = teamId => {
  return useQuery({
    queryKey: ['teamDashboard', teamId],
    queryFn: () => fetchTeamDashboard(teamId),
    enabled: !!teamId, // teamId 있을 때만 실행
    staleTime: 0,
    refetchInterval: 5000,
  });
};
