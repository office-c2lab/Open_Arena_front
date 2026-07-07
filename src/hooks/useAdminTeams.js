import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminTeams,
  resetAdminTeamPassword,
  toggleAdminTeamActive,
} from '@/api/adminTeamsApi';

export const ADMIN_TEAMS_QUERY_KEY = ['adminTeams'];

export const useAdminTeams = ({ activeOnly = false } = {}) =>
  useQuery({
    queryKey: [...ADMIN_TEAMS_QUERY_KEY, { activeOnly }],
    queryFn: () => fetchAdminTeams({ activeOnly }),
  });

export const useAdminTeamActions = () => {
  const queryClient = useQueryClient();

  const invalidateTeams = () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_TEAMS_QUERY_KEY });
  };

  const toggleActiveMutation = useMutation({
    mutationFn: toggleAdminTeamActive,
    onSuccess: invalidateTeams,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetAdminTeamPassword,
    onSuccess: invalidateTeams,
  });

  return {
    toggleActive: toggleActiveMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    isToggling: toggleActiveMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
  };
};
