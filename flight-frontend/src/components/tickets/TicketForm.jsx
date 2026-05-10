import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';

const TicketForm = ({ flightId, flight, onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        passengerName: '',
        passportNumber: '',
        seat: '',
        price: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                passengerName: initialData.passengerName || '',
                passportNumber: initialData.passportNumber || '',
                seat: initialData.seat || '',
                price: initialData.price || ''
            });
        }
    }, [initialData]);

    const validate = () => {
        const newErrors = {};
        if (!formData.passengerName?.trim()) {
            newErrors.passengerName = 'ФИО обязательно';
        }
        if (!formData.passportNumber?.trim()) {
            newErrors.passportNumber = 'Паспорт обязателен';
        }
        if (!formData.seat?.trim()) {
            newErrors.seat = 'Место обязательно';
        }
        if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
            newErrors.price = 'Укажите цену';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSave({
            passengerName: formData.passengerName.trim(),
            passportNumber: formData.passportNumber.trim(),
            seat: formData.seat.trim().toUpperCase(),
            price: Number(formData.price)
        });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Alert variant="info" className="mb-3">
                <strong>Рейс:</strong> {flight?.flightNumber} | {flight?.departureDate}
            </Alert>
            <Form.Group className="mb-3">
                <Form.Label>ФИО пассажира *</Form.Label>
                <Form.Control
                    type="text"
                    name="passengerName"
                    value={formData.passengerName}
                    onChange={handleChange}
                    placeholder="Иванов Иван Иванович"
                    isInvalid={touched.passengerName && errors.passengerName}
                />
                <Form.Control.Feedback type="invalid">{errors.passengerName}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Номер паспорта *</Form.Label>
                <Form.Control
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                    placeholder="Введите номер паспорта"
                    isInvalid={touched.passportNumber && errors.passportNumber}
                />
                <Form.Control.Feedback type="invalid">{errors.passportNumber}</Form.Control.Feedback>
            </Form.Group>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Место *</Form.Label>
                        <Form.Control
                            type="text"
                            name="seat"
                            value={formData.seat}
                            onChange={handleChange}
                            placeholder="12A"
                            isInvalid={touched.seat && errors.seat}
                        />
                        <Form.Control.Feedback type="invalid">{errors.seat}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Цена (BYN) *</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="50.00"
                            min="0.01"
                            step="0.01"
                            isInvalid={touched.price && errors.price}
                        />
                        <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="secondary" onClick={onCancel}>Отмена</Button>
                <Button variant="primary" type="submit">
                    {initialData ? 'Сохранить' : 'Добавить билет'}
                </Button>
            </div>
        </Form>
    );
};

export default TicketForm;