import api from './api';

export const flightService = {
    getAll: () => api.get('/flights'),

    getById: (id) => api.get(`/flights/${id}`),

    create: (data) => api.post('/flights', data),

    update: (id, data) => api.put(`/flights/${id}`, data),

    delete: (id) => api.delete(`/flights/${id}`),

    getFlightsWithDetails: () => api.get('/flights/with-details'),

    findByFlightNumberAndDate: (flightNumber, departureDate, passportNumber) =>
        api.get('/flights/search', {
            params: {
                flightNumber,
                departureDate,
                passportNumber
            }
        })
};

export default flightService;