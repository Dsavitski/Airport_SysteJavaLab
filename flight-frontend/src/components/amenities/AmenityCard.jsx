import React, { useState } from 'react';
import { Card, Button, Badge, Collapse, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

const AmenityCard = ({ amenity, onEdit, onDelete, onViewFlights }) => {
    const [open, setOpen] = useState(false);

    const amenityValue = amenity?.amenities;

    if (!amenity || !amenityValue) {
        return (
            <Card className="mb-3 shadow-sm border-danger">
                <Card.Body className="text-danger">
                    <strong>Ошибка:</strong> Данные удобства неполные (ID: {amenity?.id || '?'})
                </Card.Body>
            </Card>
        );
    }

    const getAmenityIcon = (val) => {
        const icons = {
            'WIFI': '📶',
            'ECONOMY_LUNCH': '🍱',
            'BUSINESS_LUNCH': '🍷',
            'LINEN': '🛌',
            'HEADPHONES': '🎧'
        };
        return icons[val] || '❓';
    };

    const getBadgeColor = (val) => {
        const colors = {
            'WIFI': 'success',
            'ECONOMY_LUNCH': 'warning',
            'BUSINESS_LUNCH': 'danger',
            'LINEN': 'info',
            'HEADPHONES': 'primary'
        };
        return colors[val] || 'secondary';
    };

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

    const getDescription = (val) => {
        const descriptions = {
            'WIFI': 'Беспроводной интернет на борту',
            'ECONOMY_LUNCH': 'Обед для эконом-класса',
            'BUSINESS_LUNCH': 'Расширенный обед для бизнес-класса',
            'LINEN': 'Свежее постельное бельё',
            'HEADPHONES': 'Шумоподавляющие наушники'
        };
        return descriptions[val] || 'Дополнительная услуга';
    };

    const flightCount = amenity.flights?.length || 0;

    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <Row className="align-items-center">
                    <Col md={8}>
                        <Card.Title className="d-flex align-items-center flex-wrap gap-2">
                            <span style={{ fontSize: '28px' }}>{getAmenityIcon(amenityValue)}</span>
                            <span style={{ color: '#dc3545', fontWeight: 'bold' }}>
                                {getRussianName(amenityValue)}
                            </span>
                            <Badge bg={getBadgeColor(amenityValue)}>
                                {amenityValue}
                            </Badge>
                            <Badge bg="secondary">
                                ID: {amenity.id}
                            </Badge>
                        </Card.Title>

                        <Card.Text className="mt-2">
                            <strong>📝 Описание:</strong> {getDescription(amenityValue)}<br/>
                            <strong>✈️ На рейсах:</strong> {flightCount}
                        </Card.Text>
                    </Col>

                    <Col md={4} className="text-end">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => onEdit(amenity)}
                        >
                            ✏️ Правка
                        </Button>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => onDelete(amenity.id)}
                        >
                            🗑️ Удалить
                        </Button>
                    </Col>
                </Row>

                {flightCount > 0 && (
                    <div className="mt-2">
                        <Button variant="link" onClick={() => setOpen(!open)} className="p-0 text-decoration-none">
                            {open ? '▼ Скрыть рейсы' : '▶ Показать рейсы'}
                        </Button>
                        <Collapse in={open}>
                            <div className="mt-2 p-2 bg-light border rounded">
                                {amenity.flights.map(f => (
                                    <div key={f.id} className="small mb-1">
                                        ✈️ {f.flightNumber} ({f.departureAirportCode?.city} → {f.arrivalAirportCode?.city})
                                    </div>
                                ))}
                            </div>
                        </Collapse>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default AmenityCard;