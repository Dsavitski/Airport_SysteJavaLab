import api from './api';

export const airplaneService = {
    getAll: () => api.get('/airplanes'),
    getById: (id) => api.get(`/airplanes/${id}`),
    create: (data) => api.post('/airplanes', data),
    update: (id, data) => api.put(`/airplanes/${id}`, data),
    delete: (id) => api.delete(`/airplanes/${id}`),
};