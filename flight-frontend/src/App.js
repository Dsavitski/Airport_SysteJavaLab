import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavigationBar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';

import Dashboard from './pages/Dashboard';
import AirportsPage from './pages/AirportsPage';
import AirplanesPage from './pages/AirplanesPage';
import FlightsPage from './pages/FlightsPage';
import AmenitiesPage from './pages/AmenitiesPage';
import TicketsPage from './pages/TicketsPage';

import { airportService } from './services/airportService';
import { airplaneService } from './services/airplaneService';
import { flightService } from './services/flightService';
import { amenityService } from './services/amenityService';

function App() {
    const [stats, setStats] = useState({
        airports: 0,
        airplanes: 0,
        flights: 0,
        amenities: 0
    });
    const [loading, setLoading] = useState(true);
    const [useSidebar, setUseSidebar] = useState(window.innerWidth > 768);

    useEffect(() => {
        fetchStats();

        const handleResize = () => {
            setUseSidebar(window.innerWidth > 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchStats = async () => {
        try {
            const [airports, airplanes, flights, amenities] = await Promise.all([
                airportService.getAll(),
                airplaneService.getAll(),
                flightService.getAll(),
                amenityService.getAll()
            ]);

            setStats({
                airports: airports.data.length,
                airplanes: airplanes.data.length,
                flights: flights.data.length,
                amenities: amenities.data.length
            });
        } catch (error) {
            console.error('Ошибка загрузки статистики:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner text="Загрузка приложения..." />;
    }

    return (
        <Router>
            <NavigationBar />
            <Container fluid className="p-0">
                <Row className="g-0">
                    {useSidebar && (
                        <Col md={3} lg={2} className="d-none d-md-block">
                            <Sidebar stats={stats} />
                        </Col>
                    )}
                    <Col md={useSidebar ? 9 : 12} lg={useSidebar ? 10 : 12}>
                        <main className="p-3">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/airports" element={<AirportsPage />} />
                                <Route path="/airplanes" element={<AirplanesPage />} />
                                <Route path="/flights" element={<FlightsPage />} />
                                <Route path="/flights/:flightId/tickets" element={<TicketsPage />} />
                                <Route path="/amenities" element={<AmenitiesPage />} />
                            </Routes>
                        </main>
                    </Col>
                </Row>
            </Container>
        </Router>
    );
}

export default App;