// src/hooks/useTeamDashboardQuery.js
import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '@/api/dashboardApi';

export const DASHBOARD_QUERY_KEY = ['dashboard'];

export const useDashboardQuery = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: getDashboard,
    staleTime: 0,
    refetchOnMount: 'always',
    retry: 1,
  });
};

export const useTeamDashboardQuery = useDashboardQuery;
