import React, { useState } from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = () => {
    const location = useLocation();
    const [expanded, setExpanded] = useState(false);

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <Navbar
            bg="dark"
            variant="dark"
            expand="lg"
            sticky="top"
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
        >
            <Container fluid>
                <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
                    ✈️ Flight Management System
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">

                    </Nav>

                    {}
                    <div className="d-none d-lg-block">
                        <Badge bg="info" className="me-2">
                            📊 Система управления авиаперевозками
                        </Badge>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;