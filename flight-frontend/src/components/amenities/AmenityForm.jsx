import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Badge } from 'react-bootstrap';

const AmenityForm = ({ initialData, onSave, onCancel, isBulk = false }) => {
    const [formData, setFormData] = useState({
        amenities: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [bulkMode, setBulkMode] = useState(false);
    const [bulkText, setBulkText] = useState('');

    const amenityOptions = [
        { value: 'WIFI', label: 'Wi-Fi', icon: '📶', desc: 'Беспроводной интернет на борту' },
        { value: 'ECONOMY_LUNCH', label: 'Эконом обед', icon: '🍱', desc: 'Обед для эконом-класса' },
        { value: 'BUSINESS_LUNCH', label: 'Бизнес обед', icon: '🍷', desc: 'Расширенный обед для бизнес-класса' },
        { value: 'LINEN', label: 'Постельное бельё', icon: '🛌', desc: 'Свежее постельное бельё' },
        { value: 'HEADPHONES', label: 'Наушники', icon: '🎧', desc: 'Шумоподавляющие наушники' }
    ];

    useEffect(() => {
        if (initialData && !isBulk) {
            setFormData({
                amenities: initialData.name || ''
            });
        }
    }, [initialData, isBulk]);

    const validate = () => {
        const validationErrors = {};

        if (!formData.amenities) {
            validationErrors.amenities = 'Выберите удобство';
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const validateBulk = (text) => {
        const lines = text.split('\n').filter(line => line.trim());
        const parsed = [];
        const bulkErrors = [];

        lines.forEach((line, index) => {
            const amenity = line.trim().toUpperCase();
            const isValid = amenityOptions.some(opt => opt.value === amenity);

            if (!isValid) {
                bulkErrors.push(`Строка ${index + 1}: "${line}" - неверное название удобства`);
            } else {
                parsed.push({ amenities: amenity });
            }
        });

        return { parsed, bulkErrors };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleBlur = () => {
        setTouched({ amenities: true });
        validate();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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

    const getAmenityInfo = (value) => {
        return amenityOptions.find(opt => opt.value === value);
    };

    const addAllAmenities = () => {
        const allAmenities = amenityOptions.map(opt => ({ amenities: opt.value }));
        onSave(allAmenities);
    };

    if (bulkMode || isBulk) {
        return (
            <Form onSubmit={handleBulkSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Массовое добавление удобств</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={8}
                        value={bulkText}
                        onChange={(e) => setBulkText(e.target.value)}
                        placeholder="Формат: КАЖДОЕ УДОБСТВО С НОВОЙ СТРОКИ&#10;Пример:&#10;WIFI&#10;ECONOMY_LUNCH&#10;BUSINESS_LUNCH&#10;LINEN&#10;HEADPHONES"
                    />
                    <Form.Text className="text-muted">
                        Каждая строка должна содержать название удобства из списка (заглавными буквами)
                    </Form.Text>
                </Form.Group>

                <div className="mb-3">
                    <Button
                        variant="outline-success"
                        size="sm"
                        onClick={addAllAmenities}
                        className="me-2"
                    >
                        📦 Добавить все удобства
                    </Button>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                            const allValues = amenityOptions.map(opt => opt.value).join('\n');
                            setBulkText(allValues);
                        }}
                    >
                        📋 Вставить все названия
                    </Button>
                </div>

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
                    <strong>ℹ️ Доступные удобства для добавления:</strong>
                    <div className="mt-2">
                        {amenityOptions.map(opt => (
                            <Badge key={opt.value} bg="secondary" className="me-2 mb-2 p-2">
                                {opt.icon} {opt.value} - {opt.label}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button variant="secondary" onClick={() => {
                        setBulkMode(false);
                        onCancel();
                    }}>
                        Отмена
                    </Button>
                    <Button variant="primary" type="submit">
                        Добавить удобства
                    </Button>
                </div>
            </Form>
        );
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>
                    Выберите удобство <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.amenities && errors.amenities}
                    autoFocus
                >
                    <option value="">-- Выберите удобство --</option>
                    {amenityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.icon} {option.label} ({option.value}) - {option.desc}
                        </option>
                    ))}
                </Form.Select>
                {touched.amenities && errors.amenities && (
                    <Form.Control.Feedback type="invalid">
                        {errors.amenities}
                    </Form.Control.Feedback>
                )}
            </Form.Group>

            {formData.amenities && (
                <div className="alert alert-success mt-2">
                    <strong>✅ Выбрано удобство:</strong> {getAmenityInfo(formData.amenities)?.icon} {getAmenityInfo(formData.amenities)?.label}
                    <br/>
                    <small>{getAmenityInfo(formData.amenities)?.desc}</small>
                </div>
            )}

            <div className="alert alert-secondary mt-2">
                <strong>📌 Примечание:</strong> Удобства можно будет добавлять к рейсам для улучшения сервиса.
                <br/>
                <small>Доступные удобства: Wi-Fi, Эконом обед, Бизнес обед, Постельное бельё, Наушники.</small>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="secondary" onClick={onCancel}>
                    Отмена
                </Button>
                <Button variant="primary" type="submit">
                    {initialData ? 'Сохранить изменения' : 'Добавить удобство'}
                </Button>
            </div>
        </Form>
    );
};

export default AmenityForm;