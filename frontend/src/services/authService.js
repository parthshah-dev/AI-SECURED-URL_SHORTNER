import api from '../api/axiosConfig';

export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  activate: async (token) => {
    const response = await api.get(`/auth/activate?token=${token}`);
    return response.data;
  },
  
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  changePassword: async (data) => {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },
};
