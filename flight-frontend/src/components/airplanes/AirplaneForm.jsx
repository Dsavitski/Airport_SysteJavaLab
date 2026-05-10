import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';

const AirplaneForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        capacity: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                capacity: initialData.capacity || ''
            });
        }
    }, [initialData]);

    const validate = (fieldValues = formData) => {
        const validationErrors = {};

        if (!fieldValues.name?.trim()) {
            validationErrors.name = 'Название самолёта обязательно';
        } else if (fieldValues.name.length < 2) {
            validationErrors.name = 'Название должно содержать минимум 2 символа';
        } else if (fieldValues.name.length > 50) {
            validationErrors.name = 'Название не должно превышать 50 символов';
        }

        if (!fieldValues.capacity) {
            validationErrors.capacity = 'Вместимость обязательна';
        } else if (fieldValues.capacity < 1) {
            validationErrors.capacity = 'Вместимость должна быть не менее 1 места';
        } else if (fieldValues.capacity > 1000) {
            validationErrors.capacity = 'Вместимость не может превышать 1000 мест';
        } else if (!Number.isInteger(Number(fieldValues.capacity))) {
            validationErrors.capacity = 'Вместимость должна быть целым числом';
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'capacity' ? value.replace(/\D/g, '') : value;

        setFormData(prev => ({ ...prev, [name]: newValue }));

        if (touched[name]) {
            validate({ ...formData, [name]: newValue });
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validate(formData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({
            name: true,
            capacity: true
        });

        if (validate()) {
            const submitData = {
                ...formData,
                capacity: parseInt(formData.capacity, 10)
            };
            onSave(submitData);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Название самолёта <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={() => handleBlur('name')}
                            placeholder="Например: Boeing 737, Airbus A320"
                            isInvalid={touched.name && errors.name}
                            autoFocus
                        />
                        <Form.Text className="text-muted">
                            Введите модель или название самолёта
                        </Form.Text>
                        {touched.name && errors.name && (
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Вместимость (мест) <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            onBlur={() => handleBlur('capacity')}
                            placeholder="Например: 180"
                            min="1"
                            max="1000"
                            isInvalid={touched.capacity && errors.capacity}
                        />
                        <Form.Text className="text-muted">
                            Количество пассажирских мест (от 1 до 1000)
                        </Form.Text>
                        {touched.capacity && errors.capacity && (
                            <Form.Control.Feedback type="invalid">
                                {errors.capacity}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <div className="alert alert-info mt-2">
                        <strong>ℹ️ Информация:</strong>
                        <ul className="mb-0 mt-1">
                            <li>Будет доступен для назначения на рейсы</li>
                            <li>Вместимость влияет на максимальное количество билетов</li>
                        </ul>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="alert alert-secondary mt-2">
                        <strong>📊 Примеры:</strong>
                        <ul className="mb-0 mt-1">
                            <li>Boeing 737 - 180 мест</li>
                            <li>Airbus A320 - 150 мест</li>
                            <li>Boeing 777 - 300 мест</li>
                        </ul>
                    </div>
                </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="secondary" onClick={onCancel}>
                    Отмена
                </Button>
                <Button variant="primary" type="submit">
                    {initialData ? 'Сохранить изменения' : 'Добавить самолёт'}
                </Button>
            </div>
        </Form>
    );
};

export default AirplaneForm;