import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { airplaneService } from '../services/airplaneService';
import { flightService } from '../services/flightService';

const AirplanesPage = () => {
    const [airplanes, setAirplanes] = useState([]);
    const [filteredAirplanes, setFilteredAirplanes] = useState([]);
    const [flights, setFlights] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingAirplane, setEditingAirplane] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        capacity: ''
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        filterAirplanes();
    }, [searchTerm, airplanes, flights]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [airplanesRes, flightsRes] = await Promise.all([
                airplaneService.getAll(),
                flightService.getAll()
            ]);
            setAirplanes(airplanesRes.data || []);
            setFlights(flightsRes.data || []);
            setFilteredAirplanes(airplanesRes.data || []);
        } catch (err) {
            console.error('❌ Ошибка загрузки:', err);
            setError('Не удалось загрузить данные');
        } finally {
            setLoading(false);
        }
    };

    const filterAirplanes = () => {
        let filtered = [...airplanes];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(plane =>
                plane.name?.toLowerCase().includes(term)
            );
        }

        setFilteredAirplanes(filtered);
    };

    const getActiveFlightsCount = (airplaneId) => {
        return flights.filter(f =>
            f.airplaneId === airplaneId &&
            (f.status === 'SCHEDULED' || f.status === 'DEPARTED')
        ).length;
    };

    const getTotalFlightsCount = (airplaneId) => {
        return flights.filter(f => f.airplaneId === airplaneId).length;
    };

    const handleSave = async () => {
        if (!formData.name?.trim() || !formData.capacity) {
            setError('Заполните обязательные поля');
            setTimeout(() => setError(null), 3000);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name.trim(),
                capacity: Number(formData.capacity)
            };

            if (editingAirplane) {
                await airplaneService.update(editingAirplane.id, payload);
                setSuccess('Самолёт обновлён');
            } else {
                await airplaneService.create(payload);
                setSuccess('Самолёт добавлен');
            }

            setShowModal(false);
            resetForm();
            await fetchAllData();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('❌ Ошибка сохранения:', err);
            setError('Ошибка сохранения');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Удалить самолёт "${name}"?`)) return;

        const flightsWithPlane = flights.filter(f => f.airplaneId === id);
        if (flightsWithPlane.length > 0) {
            setError(`Нельзя удалить: самолёт используется в ${flightsWithPlane.length} рейсах`);
            setTimeout(() => setError(null), 5000);
            return;
        }

        setLoading(true);
        try {
            await airplaneService.delete(id);
            setSuccess('Самолёт удалён');
            await fetchAllData();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('❌ Ошибка удаления:', err);
            setError('Не удалось удалить');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (airplane) => {
        setEditingAirplane(airplane);
        setFormData({
            name: airplane.name || '',
            capacity: airplane.capacity || ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingAirplane(null);
        setFormData({ name: '', capacity: '' });
    };

    return (
        <Container fluid className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>✈️ Самолёты</h1>
                    <p className="text-muted mb-0">Добавление и управление воздушными судами</p>
                </div>
                <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }} disabled={loading}>
                    + Добавить самолёт
                </Button>
            </div>

            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

            {/* Статистика */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center shadow-sm border-primary">
                        <Card.Body>
                            <h3 className="text-primary">{airplanes.length}</h3>
                            <p className="text-muted mb-0">✈️ Всего самолётов</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm border-success">
                        <Card.Body>
                            <h3 className="text-success">
                                {flights.filter(f =>
                                    f.status === 'SCHEDULED' || f.status === 'DEPARTED'
                                ).length}
                            </h3>
                            <p className="text-muted mb-0">✈️ Активных рейсов</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm border-info">
                        <Card.Body>
                            <h3 className="text-info">
                                {airplanes.filter(p => getTotalFlightsCount(p.id) > 0).length}
                            </h3>
                            <p className="text-muted mb-0">🛫 Задействовано</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Поиск */}
            <Row className="mb-4">
                <Col md={7}>
                    <Form.Control
                        type="text"
                        placeholder="🔍 Поиск по названию..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={5} className="d-flex align-items-center justify-content-end">
                    <Badge bg="secondary" className="fs-6 p-2">
                        Найдено: {filteredAirplanes.length}
                    </Badge>
                </Col>
            </Row>

            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Загрузка...</p>
                </div>
            )}

            {!loading && filteredAirplanes.length === 0 && (
                <Alert variant="info">
                    {airplanes.length === 0
                        ? 'Самолёты не найдены. Нажмите "Добавить самолёт", чтобы создать первый.'
                        : 'По вашему запросу ничего не найдено.'}
                </Alert>
            )}

            {/* Таблица */}
            {!loading && filteredAirplanes.length > 0 && (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                    <tr>
                        {/* ✅ Изменено название колонки */}
                        <th>Самолёт</th>
                        <th>Вместимость</th>
                        <th>Рейсов</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredAirplanes.map(plane => {
                        const totalFlights = getTotalFlightsCount(plane.id);
                        const activeFlights = getActiveFlightsCount(plane.id);

                        return (
                            <tr key={plane.id}>
                                {/* ✅ Убран тег <strong> — название не жирное */}
                                <td>{plane.name}</td>
                                <td>{plane.capacity} мест</td>
                                <td>
                                    <Badge bg={activeFlights > 0 ? 'success' : 'secondary'}>
                                        {totalFlights} всего / {activeFlights} активных
                                    </Badge>
                                </td>
                                <td>
                                    <Button size="sm" variant="outline-primary" className="me-1" onClick={() => openEditModal(plane)}>✏️</Button>
                                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(plane.id, plane.name)}>🗑️</Button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            )}

            {/* Модальное окно */}
            <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{editingAirplane ? '✏️ Редактирование' : '➕ Новый самолёт'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Название *</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="Boeing-747"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Вместимость (мест) *</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.capacity}
                                onChange={e => setFormData({...formData, capacity: e.target.value})}
                                placeholder="300"
                                min="1"
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>Отмена</Button>
                    <Button variant="primary" onClick={handleSave} disabled={loading}>
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AirplanesPage;