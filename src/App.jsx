// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import LibrosList from './components/LibroList';
import LibroForm from './components/LibroForm';
import LibroSearch from './components/LibroSearch';
import { getToken } from './services/auth'; // Importa la función para obtener el token

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (getToken()) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/libros" replace />
                            ) : (
                                <Login onLoginSuccess={handleLoginSuccess} />
                            )
                        }
                    />

                    <Route
                        path="/libros"
                        element={
                            isAuthenticated ? (
                                <LibrosList />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />

                    <Route
                        path="/libros/crear"
                        element={
                            isAuthenticated ? (
                                <LibroForm />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />

                    <Route
                        path="/libros/editar/:codigo"
                        element={
                            isAuthenticated ? (
                                <LibroForm />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />

                    {/* Ruta para el componente de búsqueda (por código o categoría) */}
                    <Route
                        path="/libros/buscar"
                        element={
                            isAuthenticated ? (
                                <LibroSearch />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />

                </Routes>
            </div>
        </Router>
    );
};

export default App;