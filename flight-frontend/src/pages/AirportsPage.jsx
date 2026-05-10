import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { airportService } from '../services/airportService';

const AirportsPage = () => {
    const [airports, setAirports] = useState([]);
    const [filteredAirports, setFilteredAirports] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingAirport, setEditingAirport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [countryFilter, setCountryFilter] = useState('');

    const [formData, setFormData] = useState({
        city: '',
        country: ''
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        filterAirports();
    }, [searchTerm, countryFilter, airports]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const airportsRes = await airportService.getAll();
            setAirports(airportsRes.data || []);
            setFilteredAirports(airportsRes.data || []);
        } catch (err) {
            console.error('❌ Ошибка загрузки:', err);
            setError('Не удалось загрузить данные');
        } finally {
            setLoading(false);
        }
    };

    const filterAirports = () => {
        let filtered = [...airports];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(airport =>
                airport.city?.toLowerCase().includes(term) ||
                airport.country?.toLowerCase().includes(term)
            );
        }

        if (countryFilter) {
            filtered = filtered.filter(airport => airport.country === countryFilter);
        }

        setFilteredAirports(filtered);
    };

    const getUniqueCountries = () => {
        const countries = new Set(airports.map(a => a.country).filter(Boolean));
        return Array.from(countries).sort();
    };

    const handleSave = async () => {
        if (!formData.city || !formData.country) {
            setError('Заполните обязательные поля');
            setTimeout(() => setError(null), 3000);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                city: formData.city.trim(),
                country: formData.country.trim()
            };

            if (editingAirport) {
                await airportService.update(editingAirport.id, payload);
                setSuccess('Аэропорт обновлён');
            } else {
                await airportService.create(payload);
                setSuccess('Аэропорт добавлен');
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

    const handleDelete = async (id, city, country) => {
        if (!window.confirm(`Удалить аэропорт "${city}, ${country}"?`)) return;

        setLoading(true);
        try {
            await airportService.delete(id);
            setSuccess('Аэропорт удалён');
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

    const openEditModal = (airport) => {
        setEditingAirport(airport);
        setFormData({
            city: airport.city || '',
            country: airport.country || ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingAirport(null);
        setFormData({ city: '', country: '' });
    };

    return (
        <Container fluid className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>🛫 Аэропорты</h1>
                    <p className="text-muted mb-0">Управление аэропортами и направлениями</p>
                </div>
                <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }} disabled={loading}>
                    + Добавить аэропорт
                </Button>
            </div>

            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

            {}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center shadow-sm border-primary">
                        <Card.Body>
                            <h3 className="text-primary">{airports.length}</h3>
                            <p className="text-muted mb-0">🛫 Всего аэропортов</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm border-success">
                        <Card.Body>
                            <h3 className="text-success">{getUniqueCountries().length}</h3>
                            <p className="text-muted mb-0">🌍 Стран</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm border-info">
                        <Card.Body>
                            <h3 className="text-info">{new Set(airports.map(a => a.city).filter(Boolean)).size}</h3>
                            <p className="text-muted mb-0">🏙️ Городов</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {}
            <Row className="mb-4">
                <Col md={7}>
                    <Form.Control
                        type="text"
                        placeholder="🔍 Поиск по городу или стране..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={3}>
                    <Form.Select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
                        <option value="">Все страны</option>
                        {getUniqueCountries().map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={2} className="d-flex align-items-center justify-content-end">
                    <Badge bg="secondary" className="fs-6 p-2">
                        Найдено: {filteredAirports.length}
                    </Badge>
                </Col>
            </Row>

            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Загрузка...</p>
                </div>
            )}

            {!loading && filteredAirports.length === 0 && (
                <Alert variant="info">
                    {airports.length === 0
                        ? 'Аэропорты не найдены. Нажмите "Добавить аэропорт", чтобы создать первый.'
                        : 'По вашему запросу ничего не найдено.'}
                </Alert>
            )}

            {!loading && filteredAirports.length > 0 && (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                    <tr>
                        {}
                        <th>Страна</th>
                        <th>Город</th>
                        <th style={{ width: '150px' }}>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredAirports.map(airport => (
                        <tr key={airport.id}>
                            <td>{airport.country}</td>
                            {}
                            <td>{airport.city}</td>
                            <td>
                                <Button size="sm" variant="outline-primary" className="me-1" onClick={() => openEditModal(airport)}>✏️</Button>
                                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(airport.id, airport.city, airport.country)}>🗑️</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}

            {}
            <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{editingAirport ? '✏️ Редактирование' : '➕ Новый аэропорт'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Город *</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.city}
                                onChange={e => setFormData({...formData, city: e.target.value})}
                                placeholder="Москва"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Страна *</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.country}
                                onChange={e => setFormData({...formData, country: e.target.value})}
                                placeholder="Россия"
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

export default AirportsPage;