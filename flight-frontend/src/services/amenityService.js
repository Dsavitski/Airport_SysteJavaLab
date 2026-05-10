import api from './api';

export const amenityService = {
    getAll: () => api.get('/amenities'),
    getById: (id) => api.get(`/amenities/${id}`),
    create: (data) => api.post('/amenities', data),
    update: (id, data) => api.put(`/amenities/${id}`, data),
    delete: (id) => api.delete(`/amenities/${id}`)
};