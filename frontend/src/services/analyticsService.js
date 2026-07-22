import api from '../api/axiosConfig';

export const analyticsService = {
  getDashboardAnalytics: async (page = 0, size = 10, sort = 'createdAt,desc') => {
    const response = await api.get(`/analytics?page=${page}&size=${size}&sort=${sort}`);
    return response.data;
  },

  getUrlAnalytics: async (urlId) => {
    const response = await api.get(`/analytics/${urlId}`);
    return response.data;
  }
};
