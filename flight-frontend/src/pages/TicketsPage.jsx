import React, { useState } from 'react';
import { Container, Alert, Card, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import TicketList from '../components/tickets/TicketList';
import { flightService } from '../services/flightService';

const TicketsPage = () => {
    const [flightId, setFlightId] = useState('');
    const [flight, setFlight] = useState(null);
    const [showFlightSelector, setShowFlightSelector] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchParams, setSearchParams] = useState({
        flightNumber: '',
        departureDate: '',
        passportNumber: ''
    });

    const handleFlightSelect = async (id) => {
        if (!id) return;

        setLoading(true);
        setError(null);
        try {
            const response = await flightService.getById(id);
            setFlight(response.data);
            setFlightId(id);
            setShowFlightSelector(false);
        } catch (err) {
            setError('Рейс с таким ID не найден');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchFlight = async () => {
        if (!searchParams.flightNumber || !searchParams.departureDate || !searchParams.passportNumber) {
            setError('Заполните все поля для поиска');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await flightService.findByFlightNumberAndDate(
                searchParams.flightNumber,
                searchParams.departureDate,
                searchParams.passportNumber
            );
            setFlight(response.data);
            setFlightId(response.data.id);
            setShowFlightSelector(false);
            setShowSearchModal(false);
        } catch (err) {
            setError('Рейс не найден. Проверьте введённые данные.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToSelector = () => {
        setShowFlightSelector(true);
        setFlight(null);
        setFlightId('');
        setSearchParams({
            flightNumber: '',
            departureDate: '',
            passportNumber: ''
        });
    };

    return (
        <Container fluid className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>
                        <span role="img" aria-label="tickets">🎫</span>
                        Управление билетами
                    </h1>
                    <p className="text-muted">Просмотр, добавление и управление билетами на рейсы</p>
                </div>
                {!showFlightSelector && (
                    <Button variant="outline-secondary" onClick={handleBackToSelector}>
                        ← Выбрать другой рейс
                    </Button>
                )}
            </div>

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    <strong>Ошибка!</strong> {error}
                </Alert>
            )}

            {loading && (
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                    <p className="mt-2">Загрузка...</p>
                </div>
            )}

            {showFlightSelector && !loading && (
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="text-center mb-4">
                                    ✈️ Выберите рейс для управления билетами
                                </Card.Title>

                                <Row>
                                    <Col md={8}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>ID рейса</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Введите ID рейса"
                                                value={flightId}
                                                onChange={(e) => setFlightId(e.target.value)}
                                            />
                                            <Form.Text className="text-muted">
                                                Введите числовой ID рейса из списка рейсов
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} className="d-flex align-items-end">
                                        <Button
                                            variant="primary"
                                            onClick={() => handleFlightSelect(flightId)}
                                            disabled={!flightId}
                                            className="w-100 mb-3"
                                        >
                                            Выбрать по ID
                                        </Button>
                                    </Col>
                                </Row>

                                <hr />

                                <div className="text-center">
                                    <Button
                                        variant="outline-info"
                                        onClick={() => setShowSearchModal(true)}
                                    >
                                        🔍 Искать рейс по номеру и дате
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {!showFlightSelector && flight && (
                <TicketList flightId={flightId} />
            )}

            {}
            <Modal show={showSearchModal} onHide={() => setShowSearchModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>🔍 Поиск рейса</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Номер рейса</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Например: SU1234"
                                value={searchParams.flightNumber}
                                onChange={(e) => setSearchParams({ ...searchParams, flightNumber: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Дата вылета</Form.Label>
                            <Form.Control
                                type="date"
                                value={searchParams.departureDate}
                                onChange={(e) => setSearchParams({ ...searchParams, departureDate: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Номер паспорта</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите номер паспорта"
                                value={searchParams.passportNumber}
                                onChange={(e) => setSearchParams({ ...searchParams, passportNumber: e.target.value })}
                            />
                            <Form.Text className="text-muted">
                                Укажите номер паспорта пассажира, купившего билет на этот рейс
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSearchModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleSearchFlight}>
                        Найти рейс
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default TicketsPage;