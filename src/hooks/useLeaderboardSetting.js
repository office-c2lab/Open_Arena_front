// src/hooks/useLeaderboardSetting.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchLeaderboardSetting,
  toggleLeaderboardSetting,
} from '@/api/adminLeaderboardSettingApi';

export const useLeaderboardSetting = () => {
  const queryClient = useQueryClient();

  // ⭐ 현재 설정 조회
  const { data, isLoading, isError } = useQuery({
    queryKey: ['leaderboard-setting'],
    queryFn: fetchLeaderboardSetting,
  });

  // ⭐ 토글 요청
  const currentSetting = data?.enabled ?? data?.leaderboard_enabled ?? false;

  const { mutate: update, mutateAsync: updateAsync, isPending } = useMutation({
    mutationFn: toggleLeaderboardSetting,
    onSuccess: () => {
      // 최신 설정 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ['leaderboard-setting'] });
      queryClient.invalidateQueries({ queryKey: ['user-leaderboard-setting'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });

  const toggle = nextEnabled => {
    update(typeof nextEnabled === 'boolean' ? nextEnabled : !currentSetting);
  };

  const toggleAsync = nextEnabled =>
    updateAsync(typeof nextEnabled === 'boolean' ? nextEnabled : !currentSetting);

  return {
    setting: currentSetting,
    data,
    isLoading,
    isError,
    update,
    updateAsync,
    toggle,
    toggleAsync,
    isPending,
  };
};
