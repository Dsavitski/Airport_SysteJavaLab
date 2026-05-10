import api from './api';

export const ticketService = {
    getByFlightId: (flightId, page = 0, size = 10) =>
        api.get('/tickets', {
            params: { flightId, page, size }
        }),

    create: (flightId, data) =>
        api.post(`/tickets/${flightId}`, data),

    update: (ticketId, flightId, data) =>
        api.put(`/tickets/${ticketId}/${flightId}`, data),

    delete: (ticketId) =>
        api.delete(`/tickets/${ticketId}`),

    createAsync: (flightId, data) =>
        api.post(`/tickets/async/${flightId}`, data)
};

export default ticketService;