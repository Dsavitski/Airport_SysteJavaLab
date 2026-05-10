import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Alert, Spinner, Badge, InputGroup, Modal } from 'react-bootstrap';
import AirportCard from './AirportCard';
import AirportForm from './AirportForm';
import { airportService } from '../../services/airportService';
import { flightService } from '../../services/flightService';

const AirportList = () => {
    const [airports, setAirports] = useState([]);
    const [filteredAirports, setFilteredAirports] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showBulkForm, setShowBulkForm] = useState(false);
    const [editingAirport, setEditingAirport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [uniqueCountries, setUniqueCountries] = useState([]);

    useEffect(() => {
        fetchAirports();
    }, []);

    useEffect(() => {
        filterAirports();
    }, [searchTerm, countryFilter, airports]);

    const fetchAirports = async () => {
        setLoading(true);
        try {
            const response = await airportService.getAll();
            setAirports(response.data);
            setFilteredAirports(response.data);

            const countries = [...new Set(response.data.map(a => a.country))].sort();
            setUniqueCountries(countries);
        } catch (err) {
            setError('Ошибка загрузки списка аэропортов');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filterAirports = () => {
        let filtered = [...airports];

        if (searchTerm) {
            filtered = filtered.filter(airport =>
                airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                airport.country.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (countryFilter) {
            filtered = filtered.filter(airport => airport.country === countryFilter);
        }

        setFilteredAirports(filtered);
    };

    const handleSave = async (data) => {
        setLoading(true);
        try {
            if (editingAirport) {
                await airportService.update(editingAirport.id, data);
                setSuccess('Аэропорт успешно обновлён');
            } else {
                await airportService.create(data);
                setSuccess('Аэропорт успешно добавлен');
            }
            setShowForm(false);
            setEditingAirport(null);
            await fetchAirports();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка сохранения аэропорта');
            console.error(err);
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkSave = async (airportsData) => {
        setLoading(true);
        try {
            for (const airport of airportsData) {
                await airportService.create(airport);
            }
            setSuccess(`Добавлено ${airportsData.length} аэропортов`);
            setShowBulkForm(false);
            await fetchAirports();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Ошибка при массовом добавлении аэропортов');
            console.error(err);
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const airport = airports.find(a => a.id === id);
        if (window.confirm(`Вы уверены, что хотите удалить аэропорт "${airport?.city}"? Связанные рейсы будут также удалены.`)) {
            setLoading(true);
            try {
                await airportService.delete(id);
                setSuccess('Аэропорт успешно удалён');
                await fetchAirports();
                setTimeout(() => setSuccess(null), 3000);
            } catch (err) {
                setError('Ошибка удаления аэропорта. Возможно, на него есть ссылки в рейсах.');
                console.error(err);
                setTimeout(() => setError(null), 3000);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = (airport) => {
        setEditingAirport(airport);
        setShowForm(true);
    };

    const handleViewFlights = (airport) => {
        alert(`Все рейсы через аэропорт ${airport.city}\nВылетающих: ${airport.departureFlights?.length || 0}\nПрилетающих: ${airport.arrivalFlights?.length || 0}`);
    };

    const getStatistics = () => {
        const totalCountries = uniqueCountries.length;
        const totalFlights = airports.reduce((sum, airport) =>
            sum + (airport.departureFlights?.length || 0) + (airport.arrivalFlights?.length || 0), 0);

        return { totalCountries, totalFlights };
    };

    const stats = getStatistics();

    return (
        <Container fluid className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>
                        <span role="img" aria-label="airports">🏢</span>
                        Управление аэропортами
                    </h1>
                    <p className="text-muted">Добавляйте, редактируйте и управляйте аэропортами по всему миру</p>
                </div>
                <div>
                    <Button
                        variant="outline-info"
                        className="me-2"
                        onClick={() => setShowBulkForm(true)}
                        disabled={loading}
                    >
                        📦 Массовое добавление
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setEditingAirport(null);
                            setShowForm(true);
                        }}
                        disabled={loading}
                    >
                        + Добавить аэропорт
                    </Button>
                </div>
            </div>

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    <Alert.Heading>Ошибка!</Alert.Heading>
                    <p>{error}</p>
                </Alert>
            )}

            {success && (
                <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
                    <Alert.Heading>Успешно!</Alert.Heading>
                    <p>{success}</p>
                </Alert>
            )}

            {}
            {airports.length > 0 && (
                <Row className="mb-4">
                    <Col md={3}>
                        <div className="border rounded p-3 text-center bg-light">
                            <h3>{airports.length}</h3>
                            <p className="text-muted mb-0">Всего аэропортов</p>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="border rounded p-3 text-center bg-light">
                            <h3>{stats.totalCountries}</h3>
                            <p className="text-muted mb-0">Стран</p>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="border rounded p-3 text-center bg-light">
                            <h3>{(airports.length / stats.totalCountries || 0).toFixed(1)}</h3>
                            <p className="text-muted mb-0">Аэропортов на страну</p>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="border rounded p-3 text-center bg-light">
                            <h3>{stats.totalFlights}</h3>
                            <p className="text-muted mb-0">Всего рейсов</p>
                        </div>
                    </Col>
                </Row>
            )}

            {}
            <Row className="mb-4">
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Text>🔍</InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Поиск по городу или стране..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={6}>
                    <Form.Select
                        value={countryFilter}
                        onChange={(e) => setCountryFilter(e.target.value)}
                    >
                        <option value="">Все страны</option>
                        {uniqueCountries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            {}
            <div className="mb-3">
                <Badge bg="secondary">
                    Найдено: {filteredAirports.length} из {airports.length}
                </Badge>
            </div>

            {}
            {loading && (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Загрузка...</p>
                </div>
            )}

            {!loading && filteredAirports.length === 0 && (
                <Alert variant="info">
                    {airports.length === 0
                        ? 'Аэропорты не найдены. Нажмите "Добавить аэропорт", чтобы создать первый.'
                        : 'По вашему запросу ничего не найдено. Попробуйте изменить условия поиска.'}
                </Alert>
            )}

            {!loading && filteredAirports.map(airport => (
                <AirportCard
                    key={airport.id}
                    airport={airport}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewFlights={handleViewFlights}
                />
            ))}

            {}
            <Modal show={showForm} onHide={() => {
                setShowForm(false);
                setEditingAirport(null);
            }} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingAirport ? '✏️ Редактирование аэропорта' : '➕ Добавление нового аэропорта'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AirportForm
                        initialData={editingAirport}
                        onSave={handleSave}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingAirport(null);
                        }}
                    />
                </Modal.Body>
            </Modal>

            {}
            <Modal show={showBulkForm} onHide={() => setShowBulkForm(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>📦 Массовое добавление аэропортов</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AirportForm
                        isBulk={true}
                        onSave={handleBulkSave}
                        onCancel={() => setShowBulkForm(false)}
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AirportList;