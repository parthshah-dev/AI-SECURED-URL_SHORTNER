import api from '../api/axiosConfig';

export const profileService = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  
  updateName: async (data) => {
    const response = await api.put('/profile/name', data);
    return response.data;
  },
  
  requestEmailUpdate: async (data) => {
    const response = await api.put('/profile/email', data);
    return response.data;
  },
  
  verifyEmail: async (token) => {
    const response = await api.get(`/profile/email/verify?token=${token}`);
    return response.data;
  },
  
  changePassword: async (data) => {
    const response = await api.put('/profile/password', data);
    return response.data;
  }
};
