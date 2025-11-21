// src/hooks/useLeaderboardSetting.js

export const useLeaderboardSetting = () => {
  return {
    setting: true,       // 항상 공개
    isLoading: false,
    isError: false,
    toggle: () => {},    // 아무것도 안 함
    isPending: false,
  };
};
