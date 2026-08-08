import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getApplications = () => api.get('/applications');
export const getStats = () => api.get('/applications/stats');
export const createApplication = (data) => api.post('/applications', data);
export const updateApplication = (id, data) => api.put(`/applications/${id}`, data);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);

export default api;