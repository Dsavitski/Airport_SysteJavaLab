import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import FlightCard from './FlightCard';
import FlightForm from './FlightForm';
import FlightFilter from './FlightFilter';
import TicketList from '../tickets/TicketList';
import { flightService } from '../../services/flightService';
import { airportService } from '../../services/airportService';
import { airplaneService } from '../../services/airplaneService';
import { amenityService } from '../../services/amenityService';

const FlightList = () => {
    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingFlight, setEditingFlight] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [showTicketsModal, setShowTicketsModal] = useState(false);

    const [airports, setAirports] = useState([]);
    const [airplanes, setAirplanes] = useState([]);
    const [amenities, setAmenities] = useState([]);

    useEffect(() => {
        fetchFlights();
        loadSelectData();
    }, []);

    const fetchFlights = async () => {
        setLoading(true);
        try {
            const response = await flightService.getAll();
            const data = Array.isArray(response.data) ? response.data : [];
            console.log('✅ Загружено рейсов:', data.length);
            setFlights(data);
            setFilteredFlights(data);
        } catch (err) {
            console.error('❌ Ошибка загрузки рейсов:', err);
            console.error('Response:', err.response);
            setError('Не удалось загрузить список рейсов. Проверьте подключение к серверу.');
        } finally {
            setLoading(false);
        }
    };

    const loadSelectData = async () => {
        try {
            const [airportsRes, airplanesRes, amenitiesRes] = await Promise.all([
                airportService.getAll(),
                airplaneService.getAll(),
                amenityService.getAll()
            ]);
            setAirports(airportsRes.data || []);
            setAirplanes(airplanesRes.data || []);
            setAmenities(amenitiesRes.data || []);
            console.log('✅ Загружены справочники:', {
                airports: airportsRes.data?.length,
                airplanes: airplanesRes.data?.length,
                amenities: amenitiesRes.data?.length
            });
        } catch (err) {
            console.error('❌ Ошибка загрузки справочников:', err);
        }
    };

    const handleFilter = (filters) => {
        let filtered = [...flights];

        if (filters.flightNumber) {
            const term = filters.flightNumber.toLowerCase();
            filtered = filtered.filter(f => f.flightNumber?.toLowerCase().includes(term));
        }
        if (filters.status) {
            filtered = filtered.filter(f => f.status === filters.status);
        }
        if (filters.departureDate) {
            filtered = filtered.filter(f => f.departureDate === filters.departureDate);
        }
        if (filters.arrivalDate) {
            filtered = filtered.filter(f => f.arrivalDate === filters.arrivalDate);
        }
        if (filters.departureCity) {
            const term = filters.departureCity.toLowerCase();
            filtered = filtered.filter(f =>
                f.departureAirportCode?.city?.toLowerCase().includes(term)
            );
        }
        if (filters.arrivalCity) {
            const term = filters.arrivalCity.toLowerCase();
            filtered = filtered.filter(f =>
                f.arrivalAirportCode?.city?.toLowerCase().includes(term)
            );
        }

        console.log('🔍 Отфильтровано:', filtered.length, 'из', flights.length);
        setFilteredFlights(filtered);
    };

    const handleResetFilter = () => {
        setFilteredFlights(flights);
    };

    const handleSave = async (data) => {
        setLoading(true);
        setError(null);

        console.log('📤 Сохранение рейса:', data);

        try {
            if (editingFlight) {
                console.log('✏️ Обновление рейса ID:', editingFlight.id);
                const response = await flightService.update(editingFlight.id, data);
                console.log('✅ Ответ сервера:', response);
                setSuccess('Рейс успешно обновлён');
            } else {
                console.log('➕ Создание нового рейса');
                const response = await flightService.create(data);
                console.log('✅ Ответ сервера:', response);
                setSuccess('Рейс успешно добавлен');
            }

            setShowForm(false);
            setEditingFlight(null);
            await fetchFlights();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('❌ Ошибка сохранения:', err);
            console.error('Response status:', err.response?.status);
            console.error('Response data:', err.response?.data);
            console.error('Response headers:', err.response?.headers);

            let errorMsg = 'Ошибка сохранения рейса';

            if (err.response) {
                const { status, data } = err.response;

                if (status === 400) {
                    errorMsg = data?.message || data?.error || 'Неверные данные. Проверьте формат дат и обязательные поля.';
                } else if (status === 409) {
                    errorMsg = 'Рейс с таким номером уже существует';
                } else if (status === 500) {
                    errorMsg = 'Внутренняя ошибка сервера. Обратитесь к администратору.';
                } else {
                    errorMsg = data?.message || data?.detail || `Ошибка ${status}`;
                }
            } else if (err.request) {
                errorMsg = 'Нет ответа от сервера. Проверьте подключение.';
            }

            setError(errorMsg);
            setTimeout(() => setError(null), 8000);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const flight = flights.find(f => f.id === id);
        const flightNumber = flight?.flightNumber || 'этот';

        if (!window.confirm(`Удалить рейс "${flightNumber}"? Все связанные билеты также будут удалены.`)) {
            return;
        }

        setLoading(true);
        try {
            await flightService.delete(id);
            setSuccess('Рейс успешно удалён');
            await fetchFlights();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('❌ Ошибка удаления:', err);
            setError('Не удалось удалить рейс');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (flight) => {
        setEditingFlight(flight);
        setShowForm(true);
    };

    const handleViewTickets = (flight) => {
        setSelectedFlight(flight);
        setShowTicketsModal(true);
    };

    const getStatistics = () => {
        return {
            total: flights.length,
            active: flights.filter(f => f.status === 'ACTIVE').length,
            cancelled: flights.filter(f => f.status === 'CANCELLED').length,
            completed: flights.filter(f => f.status === 'COMPLETED').length,
            scheduled: flights.filter(f => f.status === 'SCHEDULED').length,
            totalTickets: flights.reduce((sum, f) => sum + (f.tickets?.length || 0), 0)
        };
    };

    const stats = getStatistics();

    return (
        <Container fluid className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>✈️ Управление рейсами</h1>
                    <p className="text-muted mb-0">Создание, редактирование и мониторинг рейсов</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => { setEditingFlight(null); setShowForm(true); }}
                    disabled={loading}
                >
                    + Добавить рейс
                </Button>
            </div>

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    <Alert.Heading>❌ Ошибка</Alert.Heading>
                    <p className="mb-0">{error}</p>
                    <small className="text-muted">
                        Откройте консоль браузера (F12) для подробной информации
                    </small>
                </Alert>
            )}

            {success && (
                <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
                    <Alert.Heading>✅ Успешно</Alert.Heading>
                    <p className="mb-0">{success}</p>
                </Alert>
            )}

            {flights.length > 0 && (
                <Row className="mb-4">
                    <Col md={2}>
                        <div className="border rounded p-3 text-center bg-light">
                            <h3 className="mb-0">{stats.total}</h3>
                            <small className="text-muted">Всего рейсов</small>
                        </div>
                    </Col>
                    <Col md={2}>
                        <div className="border rounded p-3 text-center bg-info text-white">
                            <h3 className="mb-0">{stats.scheduled}</h3>
                            <small>📅 Запланировано</small>
                        </div>
                    </Col>
                    <Col md={2}>
                        <div className="border rounded p-3 text-center bg-success text-white">
                            <h3 className="mb-0">{stats.active}</h3>
                            <small>🟢 Активных</small>
                        </div>
                    </Col>
                    <Col md={2}>
                        <div className="border rounded p-3 text-center bg-danger text-white">
                            <h3 className="mb-0">{stats.cancelled}</h3>
                            <small>🔴 Отменённых</small>
                        </div>
                    </Col>
                    <Col md={2}>
                        <div className="border rounded p-3 text-center bg-secondary text-white">
                            <h3 className="mb-0">{stats.completed}</h3>
                            <small>✅ Завершённых</small>
                        </div>
                    </Col>
                    <Col md={2}>
                        <div className="border rounded p-3 text-center bg-light">
                            <h3 className="mb-0">{stats.totalTickets}</h3>
                            <small className="text-muted">Билетов</small>
                        </div>
                    </Col>
                </Row>
            )}

            <FlightFilter onFilter={handleFilter} onReset={handleResetFilter} />

            <div className="mb-3">
                <Badge bg="secondary">
                    Найдено: {filteredFlights.length} из {flights.length}
                </Badge>
            </div>

            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 mb-0">Загрузка...</p>
                </div>
            )}

            {!loading && filteredFlights.length === 0 && (
                <Alert variant="info">
                    {flights.length === 0
                        ? 'Рейсы не найдены. Нажмите "Добавить рейс", чтобы создать первый.'
                        : 'По вашему запросу ничего не найдено.'}
                </Alert>
            )}

            {!loading && filteredFlights.map(flight => (
                <FlightCard
                    key={flight.id}
                    flight={flight}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewTickets={handleViewTickets}
                />
            ))}

            {}
            <Modal show={showForm} onHide={() => { setShowForm(false); setEditingFlight(null); }} size="lg" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingFlight ? '✏️ Редактирование рейса' : '➕ Новый рейс'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FlightForm
                        initialData={editingFlight}
                        onSave={handleSave}
                        onCancel={() => { setShowForm(false); setEditingFlight(null); }}
                        airports={airports}
                        airplanes={airplanes}
                        amenities={amenities}
                    />
                </Modal.Body>
            </Modal>

            {}
            <Modal show={showTicketsModal} onHide={() => setShowTicketsModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        🎫 Билеты: {selectedFlight?.flightNumber}
                        <Badge bg="secondary" className="ms-2">
                            {selectedFlight?.tickets?.length || 0}
                        </Badge>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedFlight && <TicketList flightId={selectedFlight.id} />}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default FlightList;