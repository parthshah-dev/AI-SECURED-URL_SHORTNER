import api from '../api/axiosConfig';

export const urlService = {
  getMyUrls: async (sortParams = '') => {
    // sortParams could be ?sort=createdAt,desc
    const response = await api.get(`/urls${sortParams}`);
    return response.data;
  },

  searchUrls: async (query) => {
    const response = await api.get(`/urls/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  createUrl: async (data) => {
    const response = await api.post('/urls', data);
    return response.data;
  },

  updateUrl: async (id, data) => {
    const response = await api.put(`/urls/${id}`, data);
    return response.data;
  },

  deleteUrl: async (id) => {
    const response = await api.delete(`/urls/${id}`);
    return response.data;
  },

  activateUrl: async (id) => {
    const response = await api.patch(`/urls/${id}/activate`);
    return response.data;
  },

  deactivateUrl: async (id) => {
    const response = await api.patch(`/urls/${id}/deactivate`);
    return response.data;
  }
};
