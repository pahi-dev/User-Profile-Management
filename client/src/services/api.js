import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProfile = () => api.get('/users/me');
export const updateProfile = (data) => api.put('/users/me', data);
export const updateAvatar = (formData) => api.patch('/users/me/avatar', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default api;
