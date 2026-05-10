import React, { useState } from 'react';
import { Card, Button, Badge, Collapse, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

const FlightCard = ({ flight, onEdit, onDelete, onViewTickets }) => {
    const [open, setOpen] = useState(false);

    const getStatusConfig = (status) => {
        const configs = {
            'SCHEDULED': { icon: '📅', label: 'Запланирован', variant: 'info' },
            'DELAYED': { icon: '⏳', label: 'Задержан', variant: 'warning' },
            'CANCELLED': { icon: '🚫', label: 'Отменён', variant: 'danger' },
            'ARRIVED': { icon: '🛬', label: 'Прибыл', variant: 'success' },
            'DEPARTED': { icon: '🛫', label: 'Вылетел', variant: 'primary' }
        };
        return configs[status] || { icon: '⚪', label: status, variant: 'light' };
    };

    const statusConfig = getStatusConfig(flight?.status);
    const ticketCount = flight?.tickets?.length || 0;
    const amenityCount = flight?.amenities?.length || 0;
    const capacity = flight?.airplaneId?.capacity || 0;
    const loadPercent = capacity ? Math.min(100, Math.round((ticketCount / capacity) * 100)) : 0;


    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'BYN', minimumFractionDigits: 2 }).format(price || 0);
    };

    const depAirport = flight?.departureAirportCode;
    const arrAirport = flight?.arrivalAirportCode;
    const airplane = flight?.airplaneId;

    return (
        <Card className="mb-3 shadow-sm hover-shadow">
            <Card.Body>
                <Row>
                    <Col md={8}>
                        <Card.Title className="d-flex flex-wrap align-items-center gap-2">
                            <span>✈️ Рейс {flight?.flightNumber || '—'}</span>
                            <Badge bg={statusConfig.variant}>
                                {statusConfig.icon} {statusConfig.label}
                            </Badge>
                            <Badge bg="secondary">ID: {flight?.id}</Badge>
                        </Card.Title>

                        <Card.Text className="mt-2">
                            <strong>📍 Маршрут:</strong><br/>
                            🛫 {depAirport?.city || '—'} ({depAirport?.country || '—'})<br/>
                            🛬 {arrAirport?.city || '—'} ({arrAirport?.country || '—'})<br/>

                            <strong>📅 Даты:</strong><br/>
                            🗓️ Вылет: {flight?.departureDate || '—'}<br/>
                            🗓️ Прилёт: {flight?.arrivalDate || '—'}<br/>

                            <strong>✈️ Самолёт:</strong> {airplane?.name || '—'} {capacity ? <Badge bg="light" text="dark" className="ms-1">{capacity} мест</Badge> : null}<br/>

                            <strong>📊 Статистика:</strong>
                            <ul className="mt-1 mb-0">
                                <li>🎫 Билетов: {ticketCount} / {capacity || 0}</li>
                                <li>📦 Удобств: {amenityCount}</li>
                                <li>
                                    📈 Загрузка: {loadPercent}%
                                    {capacity > 0 && (
                                        <div className="progress mt-1" style={{ height: '4px' }}>
                                            <div
                                                className={`progress-bar ${loadPercent >= 90 ? 'bg-danger' : loadPercent >= 70 ? 'bg-warning' : 'bg-success'}`}
                                                style={{ width: `${loadPercent}%` }}
                                            />
                                        </div>
                                    )}
                                </li>
                            </ul>
                        </Card.Text>
                    </Col>

                    <Col md={4} className="text-end d-flex flex-column justify-content-center">
                        <div className="d-flex flex-wrap justify-content-md-end gap-2">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Редактировать рейс</Tooltip>}>
                                <Button variant="outline-primary" size="sm" onClick={() => onEdit(flight)}>✏️</Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement="top" overlay={<Tooltip>Удалить рейс</Tooltip>}>
                                <Button variant="outline-danger" size="sm" onClick={() => onDelete(flight?.id)}>🗑️</Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement="top" overlay={<Tooltip>Управление билетами</Tooltip>}>
                                <Button
                                    variant={ticketCount > 0 ? 'outline-success' : 'success'}
                                    size="sm"
                                    onClick={() => onViewTickets(flight)}
                                >
                                    🎫 {ticketCount}
                                </Button>
                            </OverlayTrigger>
                        </div>
                    </Col>
                </Row>

                <Button variant="link" onClick={() => setOpen(!open)} className="mt-2 p-0 text-decoration-none">
                    {open ? '▼ Скрыть детали' : '▶ Показать детали'}
                </Button>

                <Collapse in={open}>
                    <div className="mt-3">
                        <Row>
                            {}
                            <Col md={6}>
                                <div className="border rounded p-3 bg-light mb-2">
                                    <h6 className="mb-2">🎁 Удобства ({amenityCount})</h6>
                                    {amenityCount > 0 ? (
                                        <div className="d-flex flex-wrap gap-1">
                                            {flight?.amenities?.map(amenity => (
                                                <Badge key={amenity?.id} bg="info" pill className="p-2">
                                                    {amenity?.name || '—'}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted mb-0 small">Нет добавленных удобств</p>
                                    )}
                                </div>
                            </Col>

                            {}
                            <Col md={6}>
                                <div className="border rounded p-3 bg-light mb-2">
                                    <h6 className="mb-2">✈️ Информация о самолёте</h6>
                                    <p className="mb-1 small"><strong>Модель:</strong> {airplane?.name || '—'}</p>
                                    <p className="mb-1 small"><strong>Вместимость:</strong> {capacity || '—'} мест</p>
                                    <p className="mb-0 small"><strong>Занято мест:</strong> {ticketCount}</p>
                                    {capacity > 0 && (
                                        <p className="mb-0 small text-muted">
                                            Свободно: {Math.max(0, capacity - ticketCount)} мест
                                        </p>
                                    )}
                                </div>
                            </Col>
                        </Row>

                        {}
                        {ticketCount > 0 && (
                            <div className="border rounded p-3 bg-light mt-2">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0">🎫 Последние билеты</h6>
                                    {ticketCount > 5 && (
                                        <Button variant="link" size="sm" className="p-0" onClick={() => onViewTickets(flight)}>
                                            Все {ticketCount} билетов →
                                        </Button>
                                    )}
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-sm table-hover mb-0 small">
                                        <thead className="table-light">
                                        <tr>
                                            <th>Пассажир</th>
                                            <th>Паспорт</th>
                                            <th>Место</th>
                                            <th className="text-end">Цена</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {flight?.tickets?.slice(0, 5).map(ticket => (
                                            <tr key={ticket?.id}>
                                                <td>{ticket?.passengerName || '—'}</td>
                                                <td><Badge bg="light" text="dark">{ticket?.passportNumber || '—'}</Badge></td>
                                                <td><Badge bg="info">{ticket?.seat || '—'}</Badge></td>
                                                <td className="text-end fw-bold">{formatPrice(ticket?.price)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </Collapse>
            </Card.Body>
        </Card>
    );
};

export default FlightCard;