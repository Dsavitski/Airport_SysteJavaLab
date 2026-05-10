import React, { useState } from 'react';
import { Card, Button, Badge, Collapse, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

const AirportCard = ({ airport, onEdit, onDelete, onViewFlights }) => {
    const [open, setOpen] = useState(false);
    const departureFlights = airport.departureFlights?.length || 0;
    const arrivalFlights = airport.arrivalFlights?.length || 0;
    const totalFlights = departureFlights + arrivalFlights;

    const getFlightStatusIcon = (status) => {
        switch(status) {
            case 'ACTIVE': return '🟢';
            case 'CANCELLED': return '🔴';
            case 'COMPLETED': return '✅';
            default: return '⚪';
        }
    };

    return (
        <Card className="mb-3 shadow-sm hover-shadow">
            <Card.Body>
                <Row>
                    <Col md={8}>
                        <Card.Title>
                            🏢 {airport.city}
                            <Badge bg="primary" className="ms-2">
                                ID: {airport.id}
                            </Badge>
                            <Badge bg="info" className="ms-2">
                                {airport.country}
                            </Badge>
                        </Card.Title>

                        <Card.Text className="mt-2">
                            <strong>📍 Аэропорт:</strong> {airport.city}, {airport.country}<br/>
                            <strong>📊 Статистика рейсов:</strong>
                            <ul className="mt-2">
                                <li>Всего рейсов: {totalFlights}</li>
                                <li>📤 Вылетающих: {departureFlights}</li>
                                <li>📥 Прилетающих: {arrivalFlights}</li>
                            </ul>
                        </Card.Text>
                    </Col>

                    <Col md={4} className="text-end">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Редактировать аэропорт</Tooltip>}
                        >
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => onEdit(airport)}
                            >
                                ✏️ Редактировать
                            </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Удалить аэропорт</Tooltip>}
                        >
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => onDelete(airport.id)}
                            >
                                🗑️ Удалить
                            </Button>
                        </OverlayTrigger>
                    </Col>
                </Row>

                {totalFlights > 0 && (
                    <>
                        <Button
                            variant="link"
                            onClick={() => setOpen(!open)}
                            className="mt-2 p-0"
                        >
                            {open ? '▼ Скрыть рейсы' : '▶ Показать рейсы'}
                            <Badge bg="secondary" className="ms-2">{totalFlights}</Badge>
                        </Button>

                        <Collapse in={open}>
                            <div className="mt-3">
                                <Row>
                                    <Col md={6}>
                                        <div className="border rounded p-3 bg-light">
                                            <h6>📤 Вылетающие рейсы ({departureFlights})</h6>
                                            {departureFlights > 0 ? (
                                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                    {airport.departureFlights?.map(flight => (
                                                        <div key={flight.id} className="border-bottom pb-2 mb-2">
                                                            <div>
                                                                <strong>{flight.flightNumber}</strong>
                                                                <Badge bg={flight.status === 'ACTIVE' ? 'success' : 'secondary'} className="ms-2">
                                                                    {getFlightStatusIcon(flight.status)} {flight.status}
                                                                </Badge>
                                                            </div>
                                                            <small className="text-muted">
                                                                → {flight.arrivalAirportCode?.city} ({flight.arrivalAirportCode?.country})
                                                                <br/>
                                                                📅 {flight.departureDate}
                                                                <br/>
                                                                ✈️ {flight.airplaneId?.name}
                                                            </small>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted">Нет вылетающих рейсов</p>
                                            )}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="border rounded p-3 bg-light">
                                            <h6>📥 Прилетающие рейсы ({arrivalFlights})</h6>
                                            {arrivalFlights > 0 ? (
                                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                    {airport.arrivalFlights?.map(flight => (
                                                        <div key={flight.id} className="border-bottom pb-2 mb-2">
                                                            <div>
                                                                <strong>{flight.flightNumber}</strong>
                                                                <Badge bg={flight.status === 'ACTIVE' ? 'success' : 'secondary'} className="ms-2">
                                                                    {getFlightStatusIcon(flight.status)} {flight.status}
                                                                </Badge>
                                                            </div>
                                                            <small className="text-muted">
                                                                ← {flight.departureAirportCode?.city} ({flight.departureAirportCode?.country})
                                                                <br/>
                                                                📅 {flight.arrivalDate}
                                                                <br/>
                                                                ✈️ {flight.airplaneId?.name}
                                                            </small>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted">Нет прилетающих рейсов</p>
                                            )}
                                        </div>
                                    </Col>
                                </Row>

                                <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => onViewFlights(airport)}
                                    className="mt-3"
                                >
                                    📋 Управление всеми рейсами из этого аэропорта
                                </Button>
                            </div>
                        </Collapse>
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default AirportCard;