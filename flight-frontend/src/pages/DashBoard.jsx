import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { flightService } from '../services/flightService';
import { airportService } from '../services/airportService';
import { airplaneService } from '../services/airplaneService';

const Dashboard = () => {
    const [flights, setFlights] = useState([]);
    const [airports, setAirports] = useState([]);
    const [airplanes, setAirplanes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [flightsRes, airportsRes, airplanesRes] = await Promise.all([
                flightService.getAll(),
                airportService.getAll(),
                airplaneService.getAll()
            ]);

            setFlights(flightsRes.data || []);
            setAirports(airportsRes.data || []);
            setAirplanes(airplanesRes.data || []);
        } catch (err) {
            console.error('❌ Ошибка загрузки данных:', err);
        } finally {
            setLoading(false);
        }
    };

    const getAirportById = (id) => {
        return airports.find(a => a.id === Number(id));
    };

    const getAirplaneById = (id) => {
        return airplanes.find(a => a.id === Number(id));
    };


    const getStatusBadge = (status) => {
        const statusConfig = {
            'SCHEDULED': { label: '📅 Запланирован', variant: 'info' },
            'DELAYED': { label: '⏳ Задержан', variant: 'warning' },
            'CANCELLED': { label: '🚫 Отменён', variant: 'danger' },
            'ARRIVED': { label: '🛬 Прибыл', variant: 'success' },
            'DEPARTED': { label: '🛫 Вылетел', variant: 'primary' }
        };
        const config = statusConfig[status] || { label: status, variant: 'secondary' };
        return <Badge bg={config.variant}>{config.label}</Badge>;
    };

    const getTotalFlights = () => flights.length;

    const getScheduledFlights = () =>
        flights.filter(f => f.status === 'SCHEDULED').length;

    const getDelayedOrCancelledFlights = () =>
        flights.filter(f => f.status === 'DELAYED' || f.status === 'CANCELLED').length;

    const getUpcomingFlights = () => {
        const today = new Date().toISOString().split('T')[0];
        return flights
            .filter(f => f.departureDate >= today)
            .sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate))
            .slice(0, 5);
    };

    return (
        <Container fluid className="p-4">
            <div className="mb-4">
                <h1>📊 Обзор системы</h1>
                <p className="text-muted">Добро пожаловать в систему управления авиаперевозками</p>
            </div>

            {}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center text-white bg-secondary">
                        <Card.Body>
                            <h2>{getTotalFlights()}</h2>
                            <p>Всего рейсов</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center text-white bg-primary">
                        <Card.Body>
                            <h2>{getScheduledFlights()}</h2>
                            <p>Запланировано</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center text-white bg-danger">
                        <Card.Body>
                            <h2>{getDelayedOrCancelledFlights()}</h2>
                            <p>Задержки / Отмены</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {}
            <Card>
                <Card.Header>
                    <h5 className="mb-0">✈️ Ближайшие вылеты</h5>
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-3">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Загрузка...</span>
                            </div>
                        </div>
                    ) : getUpcomingFlights().length === 0 ? (
                        <p className="text-muted text-center mb-0">Нет запланированных рейсов</p>
                    ) : (
                        <Table responsive hover>
                            <thead>
                            <tr>
                                <th>Рейс</th>
                                <th>Маршрут</th>
                                <th>Даты</th>
                                <th>Самолёт</th>
                                <th>Статус</th>
                            </tr>
                            </thead>
                            <tbody>
                            {getUpcomingFlights().map(flight => {
                                const depAirport = getAirportById(flight.departureAirportCode);
                                const arrAirport = getAirportById(flight.arrivalAirportCode);
                                const airplane = getAirplaneById(flight.airplaneId);

                                return (
                                    <tr key={flight.id}>
                                        <td>
                                            <strong>{flight.flightNumber}</strong>
                                        </td>
                                        <td>
                                            {depAirport && arrAirport ? (
                                                <span>{depAirport.city} → {arrAirport.city}</span>
                                            ) : (
                                                <span className="text-muted">N/A → N/A</span>
                                            )}
                                        </td>
                                        <td>
                                            {flight.departureDate} — {flight.arrivalDate}
                                        </td>
                                        <td>
                                            {airplane ? (
                                                <span>{airplane.name}</span>
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )}
                                        </td>
                                        <td>{getStatusBadge(flight.status)}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Dashboard;