import React, { useState } from 'react';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';

const FlightFilter = ({ onFilter, onReset }) => {
    const [filters, setFilters] = useState({
        flightNumber: '',
        status: '',
        departureDate: '',
        arrivalDate: '',
        departureCity: '',
        arrivalCity: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v?.trim())
        );
        onFilter(activeFilters);
    };

    const handleReset = () => {
        const emptyFilters = {
            flightNumber: '',
            status: '',
            departureDate: '',
            arrivalDate: '',
            departureCity: '',
            arrivalCity: ''
        };
        setFilters(emptyFilters);
        onReset();
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <h6 className="mb-3">🔍 Фильтрация рейсов</h6>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={3}>
                            <Form.Group className="mb-2">
                                <Form.Label>Номер рейса</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="flightNumber"
                                    value={filters.flightNumber}
                                    onChange={handleChange}
                                    placeholder="SU1234"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group className="mb-2">
                                <Form.Label>Статус</Form.Label>
                                <Form.Select name="status" value={filters.status} onChange={handleChange}>
                                    <option value="">Все</option>
                                    <option value="ACTIVE">🟢 Активен</option>
                                    <option value="CANCELLED">🔴 Отменён</option>
                                    <option value="COMPLETED">✅ Завершён</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group className="mb-2">
                                <Form.Label>Дата вылета</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="departureDate"
                                    value={filters.departureDate}
                                    onChange={handleChange}
                                    max="2100-12-31"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group className="mb-2">
                                <Form.Label>Дата прилёта</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="arrivalDate"
                                    value={filters.arrivalDate}
                                    onChange={handleChange}
                                    max="2100-12-31"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Город вылета</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="departureCity"
                                    value={filters.departureCity}
                                    onChange={handleChange}
                                    placeholder="Москва"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Город прилёта</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="arrivalCity"
                                    value={filters.arrivalCity}
                                    onChange={handleChange}
                                    placeholder="Париж"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button variant="secondary" onClick={handleReset}>
                            Сбросить
                        </Button>
                        <Button variant="primary" type="submit">
                            Применить
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default FlightFilter;