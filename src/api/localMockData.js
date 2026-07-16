export const emptyList = [];

export const disabledSetting = {
  enabled: false,
  leaderboard_enabled: false,
};

export const emptyProblemBundle = {
  problem: null,
  api_info: null,
  sessions: [],
  messages: [],
};

export const localJudgeResult = {
  status: 'failed',
  results: [
    {
      model: 'Local Judge',
      verdict: 'REVIEW',
      output: 'Backend integration is disabled in this starter project.',
    },
  ],
};
