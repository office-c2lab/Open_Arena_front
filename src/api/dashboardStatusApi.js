// src/api/dashboardStatusApi.js
import api from '@/api/axiosInstance';

/**
 * GET /admin/arena/dashboard-summary-setting
 * => { enabled: boolean }
 */
export const fetchDashboardStatusSetting = async () => {
  const res = await api.get('/admin/arena/dashboard-summary-setting');
  return res.data;
};

/**
 * POST /admin/arena/dashboard-summary-setting/toggle
 * => { enabled: boolean }
 */
export const toggleDashboardStatusSetting = async () => {
  const res = await api.post('/admin/arena/dashboard-summary-setting/toggle');
  return res.data;
};
