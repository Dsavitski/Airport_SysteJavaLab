import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Alert, Spinner, InputGroup, Modal } from 'react-bootstrap';
import AmenityForm from './AmenityForm';
import { amenityService } from '../../services/amenityService';

const AmenityList = () => {
    const [amenities, setAmenities] = useState([]);
    const [filteredAmenities, setFilteredAmenities] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingAmenity, setEditingAmenity] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const getRussianName = (val) => {
        const names = {
            'WIFI': 'Wi-Fi',
            'ECONOMY_LUNCH': 'Эконом обед',
            'BUSINESS_LUNCH': 'Бизнес обед',
            'LINEN': 'Постельное бельё',
            'HEADPHONES': 'Наушники'
        };
        return names[val] || val;
    };

    const getIcon = (val) => {
        const icons = {
            'WIFI': '📶',
            'ECONOMY_LUNCH': '🍱',
            'BUSINESS_LUNCH': '🍷',
            'LINEN': '🛌',
            'HEADPHONES': '🎧'
        };
        return icons[val] || '🎁';
    };

    useEffect(() => {
        fetchAmenities();
    }, []);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = amenities.filter(a =>
            (a.amenities?.toLowerCase() || '').includes(term) ||
            getRussianName(a.amenities).toLowerCase().includes(term)
        );
        setFilteredAmenities(filtered);
    }, [searchTerm, amenities]);

    const fetchAmenities = async () => {
        setLoading(true);
        try {
            const response = await amenityService.getAll();
            setAmenities(response.data || []);
        } catch (err) {
            setError('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data) => {
        try {
            if (editingAmenity) {
                await amenityService.update(editingAmenity.id, data);
            } else {
                await amenityService.create(data);
            }
            setShowForm(false);
            fetchAmenities();
        } catch (err) {
            setError('Ошибка при сохранении');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить это удобство?')) {
            try {
                await amenityService.delete(id);
                fetchAmenities();
            } catch (err) {
                setError('Не удалось удалить');
            }
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>🎁 Управление удобствами</h1>
                <Button variant="primary" onClick={() => { setEditingAmenity(null); setShowForm(true); }}>
                    + Добавить удобство
                </Button>
            </div>

            <InputGroup className="mb-4">
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                    placeholder="Поиск по названию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>

            {loading ? (
                <div className="text-center mt-5"><Spinner animation="border" /></div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Table striped bordered hover responsive className="shadow-sm">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Удобство</th>
                        <th>Иконка</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredAmenities.map((amenity) => (
                        <tr key={amenity.id}>
                            <td>{amenity.id}</td>
                            <td>
                                {}
                                <strong>{getRussianName(amenity.amenities)}</strong>
                                <div className="text-muted small">{amenity.amenities}</div>
                            </td>
                            <td className="text-center" style={{ fontSize: '24px' }}>
                                {getIcon(amenity.amenities)}
                            </td>
                            <td>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => { setEditingAmenity(amenity); setShowForm(true); }}
                                >
                                    ✏️
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(amenity.id)}
                                >
                                    🗑️
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showForm} onHide={() => setShowForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingAmenity ? 'Редактировать' : 'Добавить'} удобство</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AmenityForm
                        initialData={editingAmenity}
                        onSave={handleSave}
                        onCancel={() => setShowForm(false)}
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AmenityList;