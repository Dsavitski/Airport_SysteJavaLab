import React from 'react';
import { Nav, Card } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ stats = {} }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/', icon: '🏠', label: 'Главная', color: 'primary' },
        { path: '/airports', icon: '🏢', label: 'Аэропорты', color: 'success' },
        { path: '/airplanes', icon: '✈️', label: 'Самолёты', color: 'info' },
        { path: '/flights', icon: '🗺️', label: 'Рейсы', color: 'warning' },
        { path: '/amenities', icon: '🎁', label: 'Удобства', color: 'danger' },
    ];

    return (
        <div className="sidebar bg-light p-3" style={{ minHeight: 'calc(100vh - 56px)' }}>
            {}
            <Card className="shadow-sm">
                <Card.Body className="p-0">
                    <Nav className="flex-column">
                        {menuItems.map((item) => (
                            <Nav.Link
                                key={item.path}
                                as={Link}
                                to={item.path}
                                className={`d-flex align-items-center p-3 border-bottom ${
                                    location.pathname === item.path ? 'bg-primary text-white' : ''
                                }`}
                            >
                                <span style={{ fontSize: '20px', marginRight: '10px' }}>{item.icon}</span>
                                <span>{item.label}</span>
                            </Nav.Link>
                        ))}
                    </Nav>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Sidebar;