import api from './axiosInstance';

export const getAdminSubmission = async submissionId => {
  const { data } = await api.get(`/admin/submissions/${submissionId}`);
  return data;
};

export const setAdminManualVerdict = async ({ submissionId, verdict, reason }) => {
  const { data } = await api.patch(`/admin/submissions/${submissionId}/verdict`, {
    verdict,
    reason,
  });
  return data;
};
