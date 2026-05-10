import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';

const AirportForm = ({ initialData, onSave, onCancel, isBulk = false, bulkData = [] }) => {
    const [formData, setFormData] = useState({
        country: '',
        city: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [bulkMode, setBulkMode] = useState(false);
    const [bulkText, setBulkText] = useState('');

    useEffect(() => {
        if (initialData && !isBulk) {
            setFormData({
                country: initialData.country || '',
                city: initialData.city || ''
            });
        }
    }, [initialData, isBulk]);

    const validate = (fieldValues = formData) => {
        const validationErrors = {};

        if (!fieldValues.country?.trim()) {
            validationErrors.country = 'Страна обязательна для заполнения';
        } else if (fieldValues.country.length < 2) {
            validationErrors.country = 'Название страны должно содержать минимум 2 символа';
        } else if (fieldValues.country.length > 100) {
            validationErrors.country = 'Название страны не должно превышать 100 символов';
        } else if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(fieldValues.country)) {
            validationErrors.country = 'Страна может содержать только буквы, пробелы и дефисы';
        }

        if (!fieldValues.city?.trim()) {
            validationErrors.city = 'Город обязателен для заполнения';
        } else if (fieldValues.city.length < 2) {
            validationErrors.city = 'Название города должно содержать минимум 2 символа';
        } else if (fieldValues.city.length > 100) {
            validationErrors.city = 'Название города не должно превышать 100 символов';
        } else if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(fieldValues.city)) {
            validationErrors.city = 'Город может содержать только буквы, пробелы и дефисы';
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const validateBulk = (text) => {
        const lines = text.split('\n').filter(line => line.trim());
        const parsed = [];
        const bulkErrors = [];

        lines.forEach((line, index) => {
            const [country, city] = line.split(',').map(s => s.trim());
            if (!country || !city) {
                bulkErrors.push(`Строка ${index + 1}: Неверный формат (нужно: Страна, Город)`);
            } else if (country.length < 2 || city.length < 2) {
                bulkErrors.push(`Строка ${index + 1}: Названия должны содержать минимум 2 символа`);
            } else {
                parsed.push({ country, city });
            }
        });

        return { parsed, bulkErrors };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (touched[name]) {
            validate({ ...formData, [name]: value });
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validate(formData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({
            country: true,
            city: true
        });

        if (validate()) {
            onSave(formData);
        }
    };

    const handleBulkSubmit = (e) => {
        e.preventDefault();
        const { parsed, bulkErrors } = validateBulk(bulkText);

        if (bulkErrors.length > 0) {
            setErrors({ bulk: bulkErrors });
            return;
        }

        if (parsed.length === 0) {
            setErrors({ bulk: ['Нет данных для добавления'] });
            return;
        }

        onSave(parsed);
    };

    if (bulkMode || isBulk) {
        return (
            <Form onSubmit={handleBulkSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Массовое добавление аэропортов</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={10}
                        value={bulkText}
                        onChange={(e) => setBulkText(e.target.value)}
                        placeholder="Формат: Страна, Город&#10;Пример:&#10;Россия, Москва&#10;США, Нью-Йорк&#10;Франция, Париж"
                    />
                    <Form.Text className="text-muted">
                        Каждая строка должна содержать страну и город, разделённые запятой
                    </Form.Text>
                </Form.Group>

                {errors.bulk && (
                    <Alert variant="danger">
                        <strong>Ошибки в данных:</strong>
                        <ul className="mb-0 mt-2">
                            {errors.bulk.map((err, idx) => (
                                <li key={idx}>{err}</li>
                            ))}
                        </ul>
                    </Alert>
                )}

                <div className="alert alert-info">
                    <strong>ℹ️ Пример правильного формата:</strong>
                    <pre className="mb-0 mt-2">
            Россия, Москва
            США, Нью-Йорк
            Франция, Париж
            Германия, Берлин
          </pre>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button variant="secondary" onClick={() => {
                        setBulkMode(false);
                        onCancel();
                    }}>
                        Отмена
                    </Button>
                    <Button variant="primary" type="submit">
                        Добавить аэропорты
                    </Button>
                </div>
            </Form>
        );
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Страна <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            onBlur={() => handleBlur('country')}
                            placeholder="Например: Россия, США, Франция"
                            isInvalid={touched.country && errors.country}
                            autoFocus
                        />
                        <Form.Text className="text-muted">
                            Введите полное название страны
                        </Form.Text>
                        {touched.country && errors.country && (
                            <Form.Control.Feedback type="invalid">
                                {errors.country}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Город <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            onBlur={() => handleBlur('city')}
                            placeholder="Например: Москва, Нью-Йорк, Париж"
                            isInvalid={touched.city && errors.city}
                        />
                        <Form.Text className="text-muted">
                            Введите полное название города
                        </Form.Text>
                        {touched.city && errors.city && (
                            <Form.Control.Feedback type="invalid">
                                {errors.city}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                </Col>
            </Row>

            <div className="alert alert-secondary mt-2">
                <strong>📌 Примечание:</strong> Аэропорты используются для указания пунктов отправления и прибытия рейсов.
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="secondary" onClick={onCancel}>
                    Отмена
                </Button>
                <Button variant="primary" type="submit">
                    {initialData ? 'Сохранить изменения' : 'Добавить аэропорт'}
                </Button>
            </div>
        </Form>
    );
};

export default AirportForm;