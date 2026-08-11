import { useQuery } from '@tanstack/react-query';
import { getPublicUserProfile } from '@/api/usersApi';

export const publicUserProfileKeys = {
  detail: userId => ['users', userId, 'public-profile'],
};

export const usePublicUserProfile = userId =>
  useQuery({
    queryKey: publicUserProfileKeys.detail(userId),
    queryFn: () => getPublicUserProfile(userId),
    enabled: Boolean(userId),
    staleTime: 30_000,
    retry: (failureCount, error) => error?.status !== 404 && failureCount < 1,
  });
