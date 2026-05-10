import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Alert, Spinner, Badge, InputGroup } from 'react-bootstrap';
import AirplaneCard from './AirplaneCard';
import AirplaneForm from './AirplaneForm';
import { airplaneService } from '../../services/airplaneService';
import { flightService } from '../../services/flightService';

const AirplaneList = () => {
    const [airplanes, setAirplanes] = useState([]);
    const [filteredAirplanes, setFilteredAirplanes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingAirplane, setEditingAirplane] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [capacityFilter, setCapacityFilter] = useState('');

    useEffect(() => {
        fetchAirplanes();
    }, []);

    useEffect(() => {
        filterAirplanes();
    }, [searchTerm, capacityFilter, airplanes]);

    const fetchAirplanes = async () => {
        setLoading(true);
        try {
            const response = await airplaneService.getAll();
            setAirplanes(response.data);
            setFilteredAirplanes(response.data);
        } catch (err) {
            setError('Ошибка загрузки списка самолётов');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filterAirplanes = () => {
        let filtered = [...airplanes];

        if (searchTerm) {
            filtered = filtered.filter(plane =>
                plane.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (capacityFilter) {
            if (capacityFilter === 'small') {
                filtered = filtered.filter(plane => plane.capacity < 100);
            } else if (capacityFilter === 'medium') {
                filtered = filtered.filter(plane => plane.capacity >= 100 && plane.capacity < 200);
            } else if (capacityFilter === 'large') {
                filtered = filtered.filter(plane => plane.capacity >= 200);
            }
        }

        setFilteredAirplanes(filtered);
    };

    const handleSave = async (data) => {
        setLoading(true);
        try {
            if (editingAirplane) {
                await airplaneService.update(editingAirplane.id, data);
                setSuccess('Самолёт успешно обновлён');
            } else {
                await airplaneService.create(data);
                setSuccess('Самолёт успешно добавлен');
            }
            setShowForm(false);
            setEditingAirplane(null);
            await fetchAirplanes();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Ошибка сохранения самолёта');
            console.error(err);
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот самолёт? Все связанные рейсы также будут удалены.')) {
            setLoading(true);
            try {
                await airplaneService.delete(id);
                setSuccess('Самолёт успешно удалён');
                await fetchAirplanes();
                setTimeout(() => setSuccess(null), 3000);
            } catch (err) {
                setError('Ошибка удаления самолёта. Возможно, на нём есть рейсы.');
                console.error(err);
                setTimeout(() => setError(null), 3000);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = (airplane) => {
        setEditingAirplane(airplane);
        setShowForm(true);
    };

    const handleViewFlights = async (flightOrAirplane) => {
        if (flightOrAirplane.id && flightOrAirplane.flightNumber) {

            alert(`Рейс ${flightOrAirplane.flightNumber}\nСтатус: ${flightOrAirplane.status}`);
        } else {
            alert(`Все рейсы самолёта ${flightOrAirplane.name}\nВсего: ${flightOrAirplane.flights?.length || 0}`);
        }
    };

    const getStatistics = () => {
        const totalCapacity = airplanes.reduce((sum, plane) => sum + plane.capacity, 0);
        const avgCapacity = airplanes.length ? (totalCapacity / airplanes.length).toFixed(0) : 0;
        const totalFlights = airplanes.reduce((sum, plane) => sum + (plane.flights?.length || 0), 0);

        return { totalCapacity, avgCapacity, totalFlights };
    };

    const stats = getStatistics();

    return (
        <Container fluid className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>
                        <span role="img" aria-label="airplanes">✈️</span>
                        Управление самолётами
                    </h1>
                    <p className="text-muted">Добавляйте, редактируйте и управляйте воздушными судами</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => {
                        setEditingAirplane(null);
                        setShowForm(true);
                    }}
                    disabled={loading}
                >
                    + Добавить самолёт
                </Button>
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
            {airplanes.length > 0 && (
                <Row className="mb-4">
                    <Col md={3}>
                        <div className="border rounded p-3 text-center bg-light">
                            <h3>{airplanes.length}</h3>
                            <p className="text-muted mb-0">Всего самолётов</p>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="border rounded p-3 text-center bg-light">
                            <h3>{stats.totalCapacity}</h3>
                            <p className="text-muted mb-0">Всего мест</p>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="border rounded p-3 text-center bg-light">
                            <h3>{stats.avgCapacity}</h3>
                            <p className="text-muted mb-0">Средняя вместимость</p>
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
                            placeholder="Поиск по названию самолёта..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={6}>
                    <Form.Select
                        value={capacityFilter}
                        onChange={(e) => setCapacityFilter(e.target.value)}
                    >
                        <option value="">Все самолёты по вместимости</option>
                        <option value="small">Малые (до 100 мест)</option>
                        <option value="medium">Средние (100-199 мест)</option>
                        <option value="large">Крупные (200+ мест)</option>
                    </Form.Select>
                </Col>
            </Row>

            {}
            <div className="mb-3">
                <Badge bg="secondary">
                    Найдено: {filteredAirplanes.length} из {airplanes.length}
                </Badge>
            </div>

            {}
            {loading && (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Загрузка...</p>
                </div>
            )}

            {!loading && filteredAirplanes.length === 0 && (
                <Alert variant="info">
                    {airplanes.length === 0
                        ? 'Самолёты не найдены. Нажмите "Добавить самолёт", чтобы создать первый.'
                        : 'По вашему запросу ничего не найдено. Попробуйте изменить условия поиска.'}
                </Alert>
            )}

            {!loading && filteredAirplanes.map(airplane => (
                <AirplaneCard
                    key={airplane.id}
                    airplane={airplane}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewFlights={handleViewFlights}
                />
            ))}

            {}
            {showForm && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingAirplane ? '✏️ Редактирование самолёта' : '➕ Добавление нового самолёта'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingAirplane(null);
                                    }}
                                />
                            </div>
                            <div className="modal-body">
                                <AirplaneForm
                                    initialData={editingAirplane}
                                    onSave={handleSave}
                                    onCancel={() => {
                                        setShowForm(false);
                                        setEditingAirplane(null);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default AirplaneList;