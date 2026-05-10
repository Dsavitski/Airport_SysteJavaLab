import React, { useState } from 'react';
import { Card, Button, Badge, Collapse, Row, Col } from 'react-bootstrap';

const AirplaneCard = ({ airplane, onEdit, onDelete, onViewFlights }) => {
    const [open, setOpen] = useState(false);

    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <Row>
                    <Col md={8}>
                        <Card.Title>
                            ✈️ {airplane.name}
                            <Badge bg="secondary" className="ms-2">
                                ID: {airplane.id}
                            </Badge>
                            <Badge bg="info" className="ms-2">
                                Вместимость: {airplane.capacity} мест
                            </Badge>
                        </Card.Title>
                        <Card.Text>
                            <strong>📊 Статистика:</strong>
                            <ul className="mt-2">
                                <li>Всего рейсов: {airplane.flights?.length || 0}</li>
                                <li>Активных рейсов: {airplane.flights?.filter(f => f.status === 'ACTIVE').length || 0}</li>
                                <li>Загрузка: {airplane.flights?.length > 0 ? Math.round((airplane.flights.filter(f => f.status === 'ACTIVE').length / airplane.flights.length) * 100) : 0}%</li>
                            </ul>
                        </Card.Text>
                    </Col>
                    <Col md={4} className="text-end">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => onEdit(airplane)}
                        >
                            ✏️ Редактировать
                        </Button>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => onDelete(airplane.id)}
                        >
                            🗑️ Удалить
                        </Button>
                    </Col>
                </Row>

                <Button
                    variant="link"
                    onClick={() => setOpen(!open)}
                    className="mt-2 p-0"
                >
                    {open ? '▼ Скрыть рейсы' : '▶ Показать рейсы'} ({airplane.flights?.length || 0})
                </Button>

                <Collapse in={open}>
                    <div className="mt-3">
                        {airplane.flights && airplane.flights.length > 0 ? (
                            <div className="border rounded p-3 bg-light">
                                <h6>Список рейсов на этом самолёте:</h6>
                                <div className="table-responsive">
                                    <table className="table table-sm table-hover">
                                        <thead>
                                        <tr>
                                            <th>№ рейса</th>
                                            <th>Откуда</th>
                                            <th>Куда</th>
                                            <th>Дата вылета</th>
                                            <th>Статус</th>
                                            <th>Билетов</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {airplane.flights.map(flight => (
                                            <tr key={flight.id} style={{ cursor: 'pointer' }} onClick={() => onViewFlights(flight)}>
                                                <td><strong>{flight.flightNumber}</strong></td>
                                                <td>{flight.departureAirportCode?.city || 'N/A'}</td>
                                                <td>{flight.arrivalAirportCode?.city || 'N/A'}</td>
                                                <td>{flight.departureDate}</td>
                                                <td>
                                                    <Badge bg={flight.status === 'ACTIVE' ? 'success' : 'secondary'}>
                                                        {flight.status}
                                                    </Badge>
                                                </td>
                                                <td>{flight.tickets?.length || 0}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => onViewFlights(airplane)}
                                    className="mt-2"
                                >
                                    📋 Управление всеми рейсами
                                </Button>
                            </div>
                        ) : (
                            <Alert variant="info" className="mt-2">
                                На этом самолёте пока нет рейсов
                            </Alert>
                        )}
                    </div>
                </Collapse>
            </Card.Body>
        </Card>
    );
};

export default AirplaneCard;