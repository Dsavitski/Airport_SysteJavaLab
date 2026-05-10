import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';

const convertToISODate = (dateStr) => {
    if (!dateStr) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('.');
        return `${year}-${month}-${day}`;
    }
    try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
    } catch (e) {
        console.error('Ошибка парсинга даты:', e);
    }
    return null;
};

const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    const iso = convertToISODate(dateStr);
    if (!iso) return false;
    const date = new Date(iso);
    const year = date.getFullYear();
    return !isNaN(date.getTime()) && year >= 1900 && year <= 2100;
};

const FlightForm = ({ initialData, onSave, onCancel, airports, airplanes, amenities }) => {
    const [formData, setFormData] = useState({
        flightNumber: '',
        departureDate: '',
        arrivalDate: '',
        departureAirportCode: '',
        arrivalAirportCode: '',
        airplaneId: '',
        status: 'SCHEDULED',
        amenities: []
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [debugInfo, setDebugInfo] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                flightNumber: initialData.flightNumber || '',
                departureDate: initialData.departureDate || '',
                arrivalDate: initialData.arrivalDate || '',
                departureAirportCode: initialData.departureAirportCode?.id || '',
                arrivalAirportCode: initialData.arrivalAirportCode?.id || '',
                airplaneId: initialData.airplaneId?.id || '',
                status: initialData.status || 'SCHEDULED',
                amenities: initialData.amenities?.map(a => a.id) || []
            });
        }
    }, [initialData]);

    const validate = () => {
        const newErrors = {};

        if (!formData.flightNumber?.trim()) {
            newErrors.flightNumber = 'Номер рейса обязателен';
        } else if (formData.flightNumber.length < 3) {
            newErrors.flightNumber = 'Минимум 3 символа';
        }

        if (!formData.departureDate) {
            newErrors.departureDate = 'Дата вылета обязательна';
        } else if (!isValidDate(formData.departureDate)) {
            newErrors.departureDate = 'Неверный формат даты';
        }

        if (!formData.arrivalDate) {
            newErrors.arrivalDate = 'Дата прилёта обязательна';
        } else if (!isValidDate(formData.arrivalDate)) {
            newErrors.arrivalDate = 'Неверный формат даты';
        }

        if (formData.departureDate && formData.arrivalDate &&
            isValidDate(formData.departureDate) && isValidDate(formData.arrivalDate)) {
            const depDate = new Date(convertToISODate(formData.departureDate));
            const arrDate = new Date(convertToISODate(formData.arrivalDate));
            if (arrDate < depDate) {
                newErrors.arrivalDate = 'Дата прилёта не может быть раньше вылета';
            }
        }

        if (!formData.departureAirportCode) {
            newErrors.departureAirportCode = 'Выберите аэропорт вылета';
        }
        if (!formData.arrivalAirportCode) {
            newErrors.arrivalAirportCode = 'Выберите аэропорт прилёта';
        }
        if (formData.departureAirportCode && formData.arrivalAirportCode &&
            formData.departureAirportCode === formData.arrivalAirportCode) {
            newErrors.arrivalAirportCode = 'Аэропорты не могут совпадать';
        }

        if (!formData.airplaneId) {
            newErrors.airplaneId = 'Выберите самолёт';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleAmenityChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
        setFormData(prev => ({ ...prev, amenities: selectedOptions }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setDebugInfo(null);

        if (!validate()) {
            console.error('❌ Валидация не пройдена:', errors);
            return;
        }


        const payload = {
            flightNumber: formData.flightNumber.trim(),
            departureDate: convertToISODate(formData.departureDate),
            arrivalDate: convertToISODate(formData.arrivalDate),


            flightStatus: formData.status,


            departureAirportCode: Number(formData.departureAirportCode),
            arrivalAirportCode: Number(formData.arrivalAirportCode),
            airplaneId: formData.airplaneId ? Number(formData.airplaneId) : null,


            amenities: formData.amenities.map(id => Number(id))
        };

        console.log('📤 Отправка данных на сервер:', payload);
        setDebugInfo({ title: 'Payload:', data: payload });

        onSave(payload);
    };

    const getAirportName = (id) => {
        const airport = airports.find(a => a.id === Number(id));
        return airport ? `${airport.city} (${airport.country})` : '';
    };

    const getAirplaneName = (id) => {
        const airplane = airplanes.find(a => a.id === Number(id));
        return airplane ? `${airplane.name} (${airplane.capacity} мест)` : '';
    };

    return (
        <Form onSubmit={handleSubmit}>
            {debugInfo && (
                <Alert variant="info">
                    <strong>{debugInfo.title}</strong>
                    <pre className="mt-2 mb-0" style={{ fontSize: '11px' }}>
                        {JSON.stringify(debugInfo.data, null, 2)}
                    </pre>
                </Alert>
            )}

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Номер рейса <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="flightNumber"
                            value={formData.flightNumber}
                            onChange={handleChange}
                            onBlur={() => setTouched(prev => ({ ...prev, flightNumber: true }))}
                            placeholder="Например: SU1234"
                            isInvalid={touched.flightNumber && errors.flightNumber}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.flightNumber}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Статус</Form.Label>
                        <Form.Select name="status" value={formData.status} onChange={handleChange}>
                            <option value="SCHEDULED">📅 Запланирован</option>
                            <option value="ACTIVE">🟢 Активен</option>
                            <option value="CANCELLED">🔴 Отменён</option>
                            <option value="COMPLETED">✅ Завершён</option>
                            <option value="DEPARTED">🛫 Вылетел</option>
                            <option value="ARRIVED">🛬 Прибыл</option>
                            <option value="DELAYED">⏳ Задержан</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Аэропорт вылета <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                            name="departureAirportCode"
                            value={formData.departureAirportCode}
                            onChange={handleChange}
                            isInvalid={touched.departureAirportCode && errors.departureAirportCode}
                        >
                            <option value="">-- Выберите аэропорт --</option>
                            {airports.map(airport => (
                                <option key={airport.id} value={airport.id}>
                                    🛫 {airport.city} ({airport.country})
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.departureAirportCode}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Аэропорт прилёта <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                            name="arrivalAirportCode"
                            value={formData.arrivalAirportCode}
                            onChange={handleChange}
                            isInvalid={touched.arrivalAirportCode && errors.arrivalAirportCode}
                        >
                            <option value="">-- Выберите аэропорт --</option>
                            {airports.map(airport => (
                                <option key={airport.id} value={airport.id}>
                                    🛬 {airport.city} ({airport.country})
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.arrivalAirportCode}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Дата вылета <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="date"
                            name="departureDate"
                            value={formData.departureDate}
                            onChange={handleChange}
                            min="1900-01-01"
                            max="2100-12-31"
                            isInvalid={touched.departureDate && errors.departureDate}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.departureDate}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Формат: ГГГГ-ММ-ДД
                        </Form.Text>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Дата прилёта <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="date"
                            name="arrivalDate"
                            value={formData.arrivalDate}
                            onChange={handleChange}
                            min={formData.departureDate || "1900-01-01"}
                            max="2100-12-31"
                            isInvalid={touched.arrivalDate && errors.arrivalDate}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.arrivalDate}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Самолёт <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                            name="airplaneId"
                            value={formData.airplaneId}
                            onChange={handleChange}
                            isInvalid={touched.airplaneId && errors.airplaneId}
                        >
                            <option value="">-- Выберите самолёт --</option>
                            {airplanes.map(plane => (
                                <option key={plane.id} value={plane.id}>
                                    ✈️ {plane.name} (вместимость: {plane.capacity})
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.airplaneId}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Удобства</Form.Label>
                        <Form.Select
                            multiple
                            size={4}
                            value={formData.amenities}
                            onChange={handleAmenityChange}
                        >
                            {amenities.map(amenity => (
                                <option key={amenity.id} value={amenity.id}>
                                    🎁 {amenity.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                            Удерживайте Ctrl/Cmd для выбора нескольких
                        </Form.Text>
                    </Form.Group>
                </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="secondary" onClick={onCancel}>
                    Отмена
                </Button>
                <Button variant="primary" type="submit">
                    {initialData ? 'Сохранить изменения' : 'Добавить рейс'}
                </Button>
            </div>
        </Form>
    );
};

export default FlightForm;