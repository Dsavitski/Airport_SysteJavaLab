import React, { useState } from 'react';
import { Card, Button, Badge, Collapse, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

const TicketCard = ({ ticket, onEdit, onDelete, flight }) => {
    const [open, setOpen] = useState(false);

    const getSeatClass = (seat) => {
        if (seat?.startsWith('A') || seat?.startsWith('F')) return 'success';
        if (seat?.startsWith('B') || seat?.startsWith('E')) return 'warning';
        return 'secondary';
    };

    return (
        <Card className="mb-2 shadow-sm">
            <Card.Body>
                <Row>
                    <Col md={8}>
                        <Card.Title>
                            🎫 Билет {ticket.id}
                            <Badge bg="info" className="ms-2">
                                Место: {ticket.seat}
                            </Badge>
                            <Badge bg={getSeatClass(ticket.seat)} className="ms-2">
                                {ticket.seat?.startsWith('A') || ticket.seat?.startsWith('F') ? 'Окно' :
                                    ticket.seat?.startsWith('B') || ticket.seat?.startsWith('E') ? 'Середина' : 'Проход'}
                            </Badge>
                        </Card.Title>

                        <Card.Text className="mt-2">
                            <strong>👤 Пассажир:</strong> {ticket.passengerName}<br/>
                            <strong>📘 Паспорт:</strong> {ticket.passportNumber}<br/>
                            <strong>💰 Цена:</strong> ${ticket.price.toLocaleString()}<br/>
                            {flight && (
                                <>
                                    <strong>✈️ Рейс:</strong> {flight.flightNumber}<br/>
                                    <strong>📍 Маршрут:</strong> {flight.departureAirportCode?.city} → {flight.arrivalAirportCode?.city}<br/>
                                    <strong>📅 Дата вылета:</strong> {flight.departureDate}
                                </>
                            )}
                        </Card.Text>
                    </Col>

                    <Col md={4} className="text-end">
                        <OverlayTrigger placement="top" overlay={<Tooltip>Редактировать билет</Tooltip>}>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => onEdit(ticket)}
                            >
                                ✏️ Редактировать
                            </Button>
                        </OverlayTrigger>

                        <OverlayTrigger placement="top" overlay={<Tooltip>Удалить билет</Tooltip>}>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => onDelete(ticket.id)}
                            >
                                🗑️ Удалить
                            </Button>
                        </OverlayTrigger>
                    </Col>
                </Row>

                <Button
                    variant="link"
                    onClick={() => setOpen(!open)}
                    className="mt-2 p-0"
                    size="sm"
                >
                    {open ? '▼ Скрыть детали' : '▶ Показать детали рейса'}
                </Button>

                <Collapse in={open}>
                    <div className="mt-3">
                        {flight && (
                            <div className="border rounded p-3 bg-light">
                                <h6>📋 Детали рейса</h6>
                                <Row>
                                    <Col md={6}>
                                        <p className="mb-1"><strong>Номер рейса:</strong> {flight.flightNumber}</p>
                                        <p className="mb-1"><strong>Самолёт:</strong> {flight.airplaneId?.name}</p>
                                        <p className="mb-1"><strong>Статус:</strong> {flight.status}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p className="mb-1"><strong>Вылет:</strong> {flight.departureAirportCode?.city} ({flight.departureAirportCode?.country})</p>
                                        <p className="mb-1"><strong>Прилёт:</strong> {flight.arrivalAirportCode?.city} ({flight.arrivalAirportCode?.country})</p>
                                        <p className="mb-0"><strong>Даты:</strong> {flight.departureDate} → {flight.arrivalDate}</p>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </div>
                </Collapse>
            </Card.Body>
        </Card>
    );
};

export default TicketCard;