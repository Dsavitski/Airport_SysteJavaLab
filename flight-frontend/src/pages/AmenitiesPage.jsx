import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { amenityService } from '../services/amenityService';

const AmenitiesPage = () => {
    const [amenities, setAmenities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingAmenity, setEditingAmenity] = useState(null);
    const [formData, setFormData] = useState({ amenities: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const amenityOptions = [
        { value: 'WIFI', label: 'Wi-Fi' },
        { value: 'ECONOMY_LUNCH', label: 'Эконом обед' },
        { value: 'BUSINESS_LUNCH', label: 'Бизнес обед' },
        { value: 'LINEN', label: 'Постельное бельё' },
        { value: 'HEADPHONES', label: 'Наушники' }
    ];

    const getRussianName = (amenityName) => {
        const option = amenityOptions.find(opt => opt.value === amenityName);
        return option ? option.label : amenityName;
    };

    const getIcon = (name) => {
        const icons = {
            'WIFI': '📶',
            'ECONOMY_LUNCH': '🍱',
            'BUSINESS_LUNCH': '🍷',
            'LINEN': '🛌',
            'HEADPHONES': '🎧'
        };
        return icons[name] || '🎁';
    };

    const getCategory = (amenityName) => {
        const categories = {
            'WIFI': { name: 'Связь', icon: '🌐', color: 'info' },
            'ECONOMY_LUNCH': { name: 'Питание', icon: '🍽️', color: 'success' },
            'BUSINESS_LUNCH': { name: 'Питание', icon: '🍽️', color: 'success' },
            'LINEN': { name: 'Комфорт', icon: '🛏️', color: 'warning' },
            'HEADPHONES': { name: 'Развлечения', icon: '🎵', color: 'danger' }
        };
        return categories[amenityName] || { name: 'Другое', icon: '📦', color: 'secondary' };
    };

    useEffect(() => {
        fetchAmenities();
    }, []);

    const fetchAmenities = async () => {
        setLoading(true);
        try {
            const response = await amenityService.getAll();
            setAmenities(response.data);
        } catch (err) {
            setError('Ошибка загрузки удобств');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.amenities) {
            setError('Выберите удобство');
            return;
        }

        setLoading(true);
        try {
            if (editingAmenity) {
                await amenityService.update(editingAmenity.id, { amenities: formData.amenities });
                setSuccess('Удобство обновлено');
            } else {
                await amenityService.create({ amenities: formData.amenities });
                setSuccess('Удобство добавлено');
            }
            setShowModal(false);
            setEditingAmenity(null);
            setFormData({ amenities: '' });
            await fetchAmenities();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Ошибка сохранения');
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        const russianName = getRussianName(name);
        if (window.confirm(`Удалить удобство "${russianName}"?`)) {
            setLoading(true);
            try {
                await amenityService.delete(id);
                setSuccess('Удобство удалено');
                await fetchAmenities();
                setTimeout(() => setSuccess(null), 3000);
            } catch (err) {
                setError('Ошибка удаления');
                setTimeout(() => setError(null), 3000);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>🎁 Управление удобствами</h1>
                <Button
                    variant="primary"
                    onClick={() => {
                        setEditingAmenity(null);
                        setFormData({ amenities: '' });
                        setShowModal(true);
                    }}
                    disabled={loading}
                >
                    + Добавить удобство
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {loading && <div className="text-center my-4"><Spinner animation="border" /></div>}

            {!loading && amenities.length === 0 && (
                <Alert variant="info">Нет добавленных удобств.</Alert>
            )}

            {!loading && amenities.length > 0 && (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                    <tr>
                        <th>Удобство</th>
                        <th>Категория</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {amenities.map(amenity => {
                        const category = getCategory(amenity.amenities);

                        return (
                            <tr key={amenity.id}>
                                <td>
                                    <span style={{ fontWeight: '500' }}>
                                        {getRussianName(amenity.amenities)}
                                    </span>
                                    <div className="text-muted small">{amenity.amenities}</div>
                                </td>
                                <td>
                                    <Badge bg={category.color} className="me-2">
                                        {category.icon} {category.name}
                                    </Badge>
                                </td>
                                <td>
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        className="me-1"
                                        onClick={() => {
                                            setEditingAmenity(amenity);
                                            setFormData({ amenities: amenity.amenities });
                                            setShowModal(true);
                                        }}
                                    >
                                        ✏️
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => handleDelete(amenity.id, amenity.amenities)}
                                    >
                                        🗑️
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingAmenity ? 'Редактировать' : 'Добавить'} удобство</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Выберите удобство</Form.Label>
                            <Form.Select
                                value={formData.amenities}
                                onChange={e => setFormData({ amenities: e.target.value })}
                            >
                                <option value="">-- Выберите удобство --</option>
                                {amenityOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label} ({option.value})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Отмена</Button>
                    <Button variant="primary" onClick={handleSave} disabled={loading}>
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AmenitiesPage;