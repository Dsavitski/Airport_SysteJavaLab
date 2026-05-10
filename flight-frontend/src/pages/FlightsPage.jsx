import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Alert, Spinner, Badge, Row, Col, Card, Collapse, Modal } from 'react-bootstrap';
import { flightService } from '../services/flightService';
import { airportService } from '../services/airportService';
import { airplaneService } from '../services/airplaneService';
import { amenityService } from '../services/amenityService';
import TicketList from '../components/tickets/TicketList';

// ✅ Валидация даты в формате YYYY-MM-DD
const isValidISODate = (dateStr) => {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
    const date = new Date(dateStr);
    const year = date.getFullYear();
    return !isNaN(date.getTime()) && year >= 1900 && year <= 2100;
};

// ✅ Конвертация различных форматов в ISO (YYYY-MM-DD)
const toISODate = (dateStr) => {
    if (!dateStr) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
        const [d, m, y] = dateStr.split('.');
        return `${y}-${m}-${d}`;
    }
    try {
        const dt = new Date(dateStr);
        if (!isNaN(dt.getTime())) return dt.toISOString().split('T')[0];
    } catch (e) {}
    return null;
};

const FlightsPage = () => {
    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingFlight, setEditingFlight] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // ✅ Состояние для раскрытых строк с билетами
    const [expandedFlightId, setExpandedFlightId] = useState(null);

    // ✅ Справочники для отображения
    const [airports, setAirports] = useState([]);
    const [airplanes, setAirplanes] = useState([]);
    const [amenities, setAmenities] = useState([]);

    const [formData, setFormData] = useState({
        flightNumber: '',
        departureDate: '',
        arrivalDate: '',
        departureAirportId: '',
        arrivalAirportId: '',
        airplaneId: '',
        status: 'SCHEDULED',
        amenities: []
    });

    const statusOptions = [
        { value: 'SCHEDULED', label: '📅 Запланирован', color: 'info' },
        { value: 'DELAYED', label: '⏳ Задержан', color: 'warning' },
        { value: 'CANCELLED', label: '🚫 Отменён', color: 'danger' },
        { value: 'ARRIVED', label: '🛬 Прибыл', color: 'success' },
        { value: 'DEPARTED', label: '🛫 Вылетел', color: 'primary' }
    ];

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        filterFlights();
    }, [searchTerm, statusFilter, flights]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [flightsRes, airportsRes, airplanesRes, amenitiesRes] = await Promise.all([
                flightService.getAll(),
                airportService.getAll(),
                airplaneService.getAll(),
                amenityService.getAll()
            ]);
            setFlights(flightsRes.data || []);
            setFilteredFlights(flightsRes.data || []);
            setAirports(airportsRes.data || []);
            setAirplanes(airplanesRes.data || []);
            setAmenities(amenitiesRes.data || []);
        } catch (err) {
            console.error('❌ Ошибка загрузки:', err);
            setError('Не удалось загрузить данные');
        } finally {
            setLoading(false);
        }
    };

    const filterFlights = () => {
        let filtered = [...flights];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(f =>
                f.flightNumber?.toLowerCase().includes(term) ||
                getAirportCity(f.departureAirportCode).toLowerCase().includes(term) ||
                getAirportCity(f.arrivalAirportCode).toLowerCase().includes(term)
            );
        }
        if (statusFilter) {
            filtered = filtered.filter(f => f.status === statusFilter);
        }
        setFilteredFlights(filtered);
    };

    // ✅ Вспомогательные функции для отображения
    const getAirportById = (id) => {
        return airports.find(a => a.id === Number(id)) || null;
    };

    const getAirportCity = (id) => {
        const airport = getAirportById(id);
        return airport ? airport.city : '—';
    };

    const getAirportFullName = (id) => {
        const airport = getAirportById(id);
        return airport ? `${airport.city} (${airport.country})` : '—';
    };

    const getAirplaneById = (id) => {
        return airplanes.find(a => a.id === Number(id)) || null;
    };

    const getAirplaneName = (id) => {
        const airplane = getAirplaneById(id);
        return airplane ? airplane.name : '—';
    };

    const handleSave = async () => {
        if (!formData.flightNumber?.trim()) {
            setError('Номер рейса обязателен');
            setTimeout(() => setError(null), 3000);
            return;
        }
        if (!formData.departureDate || !isValidISODate(formData.departureDate)) {
            setError('Неверная дата вылета');
            setTimeout(() => setError(null), 3000);
            return;
        }
        if (!formData.arrivalDate || !isValidISODate(formData.arrivalDate)) {
            setError('Неверная дата прилёта');
            setTimeout(() => setError(null), 3000);
            return;
        }
        if (new Date(formData.departureDate) > new Date(formData.arrivalDate)) {
            setError('Прилёт не может быть раньше вылета');
            setTimeout(() => setError(null), 3000);
            return;
        }
        if (!formData.departureAirportId || !formData.arrivalAirportId) {
            setError('Выберите аэропорты');
            setTimeout(() => setError(null), 3000);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                flightNumber: formData.flightNumber.trim(),
                departureDate: toISODate(formData.departureDate),
                arrivalDate: toISODate(formData.arrivalDate),
                flightStatus: formData.status,
                departureAirportCode: Number(formData.departureAirportId),
                arrivalAirportCode: Number(formData.arrivalAirportId),
                airplaneId: formData.airplaneId ? Number(formData.airplaneId) : null,
                amenities: formData.amenities.map(id => Number(id))
            };

            console.log('📤 Payload для отправки:', payload);

            if (editingFlight) {
                await flightService.update(editingFlight.id, payload);
                setSuccess('Рейс обновлён');
            } else {
                await flightService.create(payload);
                setSuccess('Рейс добавлен');
            }

            setShowModal(false);
            resetForm();
            await fetchAllData();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('❌ Ошибка сохранения:', err);
            const msg = err.response?.data?.message || err.response?.data?.error || 'Ошибка сохранения';
            setError(msg);
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, number) => {
        if (!window.confirm(`Удалить рейс ${number}?`)) return;
        setLoading(true);
        try {
            await flightService.delete(id);
            setSuccess('Рейс удалён');
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

    const openEditModal = (flight) => {
        setEditingFlight(flight);
        setFormData({
            flightNumber: flight.flightNumber || '',
            departureDate: flight.departureDate || '',
            arrivalDate: flight.arrivalDate || '',
            departureAirportId: flight.departureAirportCode || '',
            arrivalAirportId: flight.arrivalAirportCode || '',
            airplaneId: flight.airplaneId || '',
            status: flight.status || 'SCHEDULED',
            amenities: flight.amenities?.map(a => a.id || a) || []
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingFlight(null);
        setFormData({
            flightNumber: '', departureDate: '', arrivalDate: '',
            departureAirportId: '', arrivalAirportId: '', airplaneId: '',
            status: 'SCHEDULED', amenities: []
        });
    };

    // ✅ Переключение раскрытия строки с билетами
    const toggleTicketExpansion = (flightId) => {
        setExpandedFlightId(expandedFlightId === flightId ? null : flightId);
    };

    const getStatusBadge = (status) => {
        const opt = statusOptions.find(s => s.value === status);
        return opt ? <Badge bg={opt.color}>{opt.label}</Badge> : <Badge bg="secondary">{status}</Badge>;
    };

    return (
        <Container fluid className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>🗺️ Управление рейсами</h1>
                    <p className="text-muted mb-0">Расписание и статусы</p>
                </div>
                <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }} disabled={loading}>
                    + Добавить рейс
                </Button>
            </div>

            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

            {/* ✅ Статистика */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="text-center shadow-sm border-primary">
                        <Card.Body>
                            <h3 className="text-primary display-6">{flights.length}</h3>
                            <p className="text-muted mb-0 fs-5">✈️ Всего рейсов</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="text-center shadow-sm border-success">
                        <Card.Body>
                            <h3 className="text-success display-6">
                                {flights.filter(f =>
                                    f.status === 'DEPARTED' || f.status === 'SCHEDULED'
                                ).length}
                            </h3>
                            <p className="text-muted mb-0 fs-5">✈️ Активных</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Поиск и фильтр */}
            <Row className="mb-4">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="🔍 Поиск по номеру или городу..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={6}>
                    <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">Все статусы</option>
                        {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Form.Select>
                </Col>
            </Row>

            {loading && <div className="text-center py-5"><Spinner animation="border" /><p className="mt-2">Загрузка...</p></div>}

            {!loading && filteredFlights.length === 0 && (
                <Alert variant="info">Рейсы не найдены</Alert>
            )}

            {!loading && filteredFlights.length > 0 && (
                <Table striped bordered hover responsive className="align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th style={{ width: '40px' }}></th>
                        <th>Рейс</th>
                        <th>Маршрут</th>
                        <th>Даты</th>
                        <th>Самолёт</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredFlights.map(flight => {
                        const depAirport = getAirportById(flight.departureAirportCode);
                        const arrAirport = getAirportById(flight.arrivalAirportCode);
                        const airplane = getAirplaneById(flight.airplaneId);
                        const isExpanded = expandedFlightId === flight.id;

                        return (
                            <React.Fragment key={flight.id}>
                                {/* Основная строка рейса */}
                                <tr
                                    className={isExpanded ? 'table-info' : ''}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => toggleTicketExpansion(flight.id)}
                                >
                                    <td className="text-center">
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className={`p-0 ${isExpanded ? 'rotate-180' : ''}`}
                                            style={{ transition: 'transform 0.3s' }}
                                        >
                                            ▼
                                        </Button>
                                    </td>
                                    <td><strong>{flight.flightNumber}</strong></td>
                                    <td>
                                        {depAirport ? (
                                            <span title={getAirportFullName(flight.departureAirportCode)}>
                                                    {depAirport.city}
                                                </span>
                                        ) : '—'}
                                        {' → '}
                                        {arrAirport ? (
                                            <span title={getAirportFullName(flight.arrivalAirportCode)}>
                                                    {arrAirport.city}
                                                </span>
                                        ) : '—'}
                                    </td>
                                    <td>
                                        {flight.departureDate}
                                        <br/>
                                        <small className="text-muted">{flight.arrivalDate}</small>
                                    </td>
                                    <td>
                                        {airplane ? (
                                            <span title={`Вместимость: ${airplane.capacity} мест`}>
                                                    {airplane.name}
                                                </span>
                                        ) : '—'}
                                    </td>
                                    <td>{getStatusBadge(flight.status)}</td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            className="me-1"
                                            onClick={() => openEditModal(flight)}
                                            title="Редактировать"
                                        >
                                            ✏️
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => handleDelete(flight.id, flight.flightNumber)}
                                            title="Удалить"
                                        >
                                            🗑️
                                        </Button>
                                    </td>
                                </tr>

                                {/* ✅ Раскрывающаяся панель с билетами (БЕЙДЖИ УДАЛЕНЫ) */}
                                <tr>
                                    <td colSpan="7" className="p-0 border-0">
                                        <Collapse in={isExpanded}>
                                            <div className="bg-light p-4">
                                                <TicketList
                                                    flightId={flight.id}
                                                    flight={{
                                                        ...flight,
                                                        departureAirportCode: depAirport,
                                                        arrivalAirportCode: arrAirport,
                                                        airplaneId: airplane
                                                    }}
                                                    onTicketChange={fetchAllData}
                                                />
                                            </div>
                                        </Collapse>
                                    </td>
                                </tr>
                            </React.Fragment>
                        );
                    })}
                    </tbody>
                </Table>
            )}

            {/* Модальное окно: форма рейса */}
            <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{editingFlight ? '✏️ Редактирование' : '➕ Новый рейс'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Номер рейса *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.flightNumber}
                                        onChange={e => setFormData({...formData, flightNumber: e.target.value})}
                                        placeholder="SU1234"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Дата вылета *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.departureDate}
                                        onChange={e => setFormData({...formData, departureDate: e.target.value})}
                                        min="1900-01-01" max="2100-12-31"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Дата прилёта</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.arrivalDate}
                                        onChange={e => setFormData({...formData, arrivalDate: e.target.value})}
                                        min={formData.departureDate || "1900-01-01"} max="2100-12-31"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Аэропорт вылета *</Form.Label>
                                    <Form.Select
                                        value={formData.departureAirportId}
                                        onChange={e => setFormData({...formData, departureAirportId: e.target.value})}
                                    >
                                        <option value="">-- Выберите --</option>
                                        {airports.map(a => (
                                            <option key={a.id} value={a.id}>
                                                {a.city} ({a.country})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Аэропорт прилёта *</Form.Label>
                                    <Form.Select
                                        value={formData.arrivalAirportId}
                                        onChange={e => setFormData({...formData, arrivalAirportId: e.target.value})}
                                    >
                                        <option value="">-- Выберите --</option>
                                        {airports.map(a => (
                                            <option key={a.id} value={a.id}>
                                                {a.city} ({a.country})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Самолёт</Form.Label>
                                    <Form.Select
                                        value={formData.airplaneId}
                                        onChange={e => setFormData({...formData, airplaneId: e.target.value})}
                                    >
                                        <option value="">-- Не назначен --</option>
                                        {airplanes.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} (вместимость: {p.capacity})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Статус</Form.Label>
                                    <Form.Select
                                        value={formData.status}
                                        onChange={e => setFormData({...formData, status: e.target.value})}
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Удобства</Form.Label>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {amenities.map(a => (
                                    <Form.Check
                                        key={a.id}
                                        type="checkbox"
                                        label={a.name || a.amenities}
                                        checked={formData.amenities.includes(a.id)}
                                        onChange={() => {
                                            const checked = formData.amenities.includes(a.id);
                                            setFormData({...formData, amenities: checked ? formData.amenities.filter(id => id !== a.id) : [...formData.amenities, a.id]});
                                        }}
                                        className="me-2"
                                    />
                                ))}
                            </div>
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

export default FlightsPage;