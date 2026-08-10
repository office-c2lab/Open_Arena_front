import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addAdminUserQuota,
  changeAdminUserMembership,
  changeAdminUserStatus,
  getAdminFreeDailyLimits,
  getAdminUsers,
  getAdminUserTodayUsage,
  revokeAdminUserSessions,
  sendAdminUserPasswordResetEmail,
  updateAdminFreeDailyLimits,
} from '@/api/adminUsersApi';

export const ADMIN_USERS_QUERY_KEY = ['adminUsers'];
export const ADMIN_USER_USAGE_QUERY_KEY = ['adminUserUsage'];
export const ADMIN_FREE_LIMITS_QUERY_KEY = ['adminFreeDailyLimits'];

export const useAdminTeams = (filters = {}) =>
  useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, filters],
    queryFn: () => getAdminUsers(filters),
    placeholderData: previousData => previousData,
  });

export const useAdminUserUsage = userId =>
  useQuery({
    queryKey: [...ADMIN_USER_USAGE_QUERY_KEY, userId],
    queryFn: () => getAdminUserTodayUsage(userId),
    enabled: Boolean(userId),
  });

export const useAdminFreeDailyLimits = enabled =>
  useQuery({
    queryKey: ADMIN_FREE_LIMITS_QUERY_KEY,
    queryFn: getAdminFreeDailyLimits,
    enabled,
  });

export const useAdminTeamActions = () => {
  const queryClient = useQueryClient();

  const invalidateUsers = () => queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
  const invalidateUsage = userId =>
    queryClient.invalidateQueries({ queryKey: [...ADMIN_USER_USAGE_QUERY_KEY, userId] });

  const membershipMutation = useMutation({
    mutationFn: changeAdminUserMembership,
    onSuccess: invalidateUsers,
  });
  const statusMutation = useMutation({
    mutationFn: changeAdminUserStatus,
    onSuccess: invalidateUsers,
  });
  const revokeSessionsMutation = useMutation({
    mutationFn: revokeAdminUserSessions,
  });
  const resetPasswordMutation = useMutation({
    mutationFn: sendAdminUserPasswordResetEmail,
  });
  const quotaMutation = useMutation({
    mutationFn: addAdminUserQuota,
    onSuccess: (_data, variables) => invalidateUsage(variables.userId),
  });
  const freeLimitsMutation = useMutation({
    mutationFn: updateAdminFreeDailyLimits,
    onSuccess: data => {
      queryClient.setQueryData(ADMIN_FREE_LIMITS_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: ADMIN_USER_USAGE_QUERY_KEY });
    },
  });

  return {
    changeMembership: membershipMutation.mutateAsync,
    changeStatus: statusMutation.mutateAsync,
    revokeSessions: revokeSessionsMutation.mutateAsync,
    sendPasswordResetEmail: resetPasswordMutation.mutateAsync,
    addQuota: quotaMutation.mutateAsync,
    saveFreeDailyLimits: freeLimitsMutation.mutateAsync,
    isChangingMembership: membershipMutation.isPending,
    isChangingStatus: statusMutation.isPending,
    isRevokingSessions: revokeSessionsMutation.isPending,
    isSendingPasswordReset: resetPasswordMutation.isPending,
    isAddingQuota: quotaMutation.isPending,
    isSavingFreeDailyLimits: freeLimitsMutation.isPending,
  };
};
