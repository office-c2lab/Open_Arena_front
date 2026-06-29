// src/hooks/useDashboardStatusSetting.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchDashboardStatusSetting,
  toggleDashboardStatusSetting,
} from '@/api/dashboardStatusApi';

export function useDashboardStatusSetting() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboardStatusSetting'],
    queryFn: fetchDashboardStatusSetting,
  });

  const { mutate: toggle, isPending } = useMutation({
    mutationFn: toggleDashboardStatusSetting,
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboardStatusSetting']);
      queryClient.invalidateQueries(['teamDashboard']);
    },
  });

  return {
    setting: data?.enabled ?? data?.dashboard_summary_enabled ?? false,
    isLoading,
    isPending,
    toggle,
  };
}
