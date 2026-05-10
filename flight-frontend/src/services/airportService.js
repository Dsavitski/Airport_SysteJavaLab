import api from './api';

export const airportService = {
    getAll: () => api.get('/airports'),
    getById: (id) => api.get(`/airports/${id}`),
    create: (data) => api.post('/airports', data),
    createBulk: (data) => api.post('/airports/bulk', data),
    update: (id, data) => api.put(`/airports/${id}`, data),
    delete: (id) => api.delete(`/airports/${id}`),
};