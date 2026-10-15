import api from './api';

export const notificationService = {
  getUserNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
};

export const settingsService = {
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  updateSettings: async (settingsMap) => {
    const response = await api.put('/settings', settingsMap);
    return response.data;
  },
};

export const dashboardService = {
  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getManagerDashboard: async () => {
    const response = await api.get('/dashboard/manager');
    return response.data;
  },

  getMemberDashboard: async () => {
    const response = await api.get('/dashboard/member');
    return response.data;
  },
};

export const reportService = {
  getFullReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },
};
