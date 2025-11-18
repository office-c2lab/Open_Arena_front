// src/hooks/useLeaderboardSetting.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLeaderboardSetting, toggleLeaderboardSetting } from "@/api/adminLeaderboardSettingApi";

export const useLeaderboardSetting = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["leaderboard-setting"],
    queryFn: fetchLeaderboardSetting,
  });

  const { mutate: toggle, isPending } = useMutation({
    mutationFn: toggleLeaderboardSetting,
    onSuccess: () => {
      queryClient.invalidateQueries(["leaderboard-setting"]);
    },
  });

  return {
    setting: data?.leaderboard_enabled ?? false,
    isLoading,
    isError,
    toggle,
    isPending,
  };
};
