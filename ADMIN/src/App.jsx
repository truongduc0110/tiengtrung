import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Classes from './pages/Classes';
import Layout from './components/Layout';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);

    if (loading) return null;

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        <Navigate to="/" replace />
                    ) : (
                        <Login onLogin={() => setIsAuthenticated(true)} />
                    )
                }
            />
            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        <Layout onLogout={() => setIsAuthenticated(false)} />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="classes" element={<Classes />} />
            </Route>
        </Routes>
    );
}

export default App;
