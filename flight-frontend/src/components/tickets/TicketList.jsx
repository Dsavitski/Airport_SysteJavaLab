import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Alert, Spinner, Pagination } from 'react-bootstrap';
import { ticketService } from '../../services/ticketService';
import TicketForm from './TicketForm';

const TicketList = ({ flightId, flight, onTicketChange }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        if (flightId) fetchTickets();
    }, [flightId, currentPage, pageSize]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const response = await ticketService.getByFlightId(flightId, currentPage, pageSize);
            setTickets(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
        } catch (err) {
            console.error('❌ Ошибка:', err);
            setError('Не удалось загрузить билеты');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data) => {
        setLoading(true);
        try {
            const payload = {
                ...data,
                flightId: flightId
            };

            console.log('📤 Отправка билета:', payload);

            if (editingTicket) {
                await ticketService.update(editingTicket.id, flightId, payload);
                setSuccess('Билет обновлён');
            } else {
                await ticketService.create(flightId, payload);
                setSuccess('Билет добавлен');
            }
            setShowForm(false);
            setEditingTicket(null);
            await fetchTickets();
            if (onTicketChange) onTicketChange();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('❌ Ошибка сохранения:', err);
            setError('Ошибка сохранения');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (ticketId) => {
        if (!window.confirm('Удалить билет?')) return;
        setLoading(true);
        try {
            await ticketService.delete(ticketId);
            setSuccess('Билет удалён');
            await fetchTickets();
            if (onTicketChange) onTicketChange();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('❌ Ошибка удаления:', err);
            setError('Не удалось удалить');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'BYN',
            minimumFractionDigits: 2
        }).format(price || 0);
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const items = [];
        for (let i = 0; i < totalPages; i++) {
            items.push(
                <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
                    {i + 1}
                </Pagination.Item>
            );
        }
        return <Pagination className="justify-content-center mb-0">{items}</Pagination>;
    };

    return (
        <div>
            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <strong>Билетов:</strong> {totalElements}
                    {flight?.airplaneId?.capacity && (
                        <Badge bg="secondary" className="ms-2">
                            Свободно: {Math.max(0, flight.airplaneId.capacity - totalElements)} / {flight.airplaneId.capacity}
                        </Badge>
                    )}
                </div>
                <Button
                    variant="success"
                    size="sm"
                    onClick={() => { setEditingTicket(null); setShowForm(true); }}
                >
                    + Добавить билет
                </Button>
            </div>

            {loading && !showForm ? (
                <div className="text-center py-3"><Spinner animation="border" size="sm" /> Загрузка...</div>
            ) : showForm ? (
                <TicketForm
                    flightId={flightId}
                    flight={flight}
                    initialData={editingTicket}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingTicket(null); }}
                />
            ) : tickets.length === 0 ? (
                <Alert variant="info">Билетов пока нет</Alert>
            ) : (
                <>
                    <Table striped bordered hover responsive size="sm">
                        <thead>
                        <tr>
                            <th>Пассажир</th>
                            <th>Паспорт</th>
                            <th>Место</th>
                            <th>Цена</th>
                            <th style={{ width: '100px' }}>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket.id}>
                                <td>{ticket.passengerName}</td>
                                <td>{ticket.passportNumber}</td>
                                <td><Badge bg="info">{ticket.seat}</Badge></td>
                                <td className="fw-bold">{formatPrice(ticket.price)}</td>
                                <td>
                                    <Button size="sm" variant="outline-primary" className="me-1" onClick={() => { setEditingTicket(ticket); setShowForm(true); }}>✏️</Button>
                                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(ticket.id)}>🗑️</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    {renderPagination()}
                </>
            )}
        </div>
    );
};

export default TicketList;