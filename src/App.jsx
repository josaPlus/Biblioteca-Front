// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import LibrosList from './components/LibroList';
import LibroForm from './components/LibroForm';
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
                    {/* Ruta para el login */}
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

                    {/* Ruta protegida para la lista de libros */}
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

                    {/* Ruta protegida para crear un nuevo libro */}
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

                    {/* Ruta protegida para editar un libro existente */}
                    {/* El ':codigo' es un parámetro de URL que se capturará con useParams() en LibroForm */}
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

                </Routes>
            </div>
        </Router>
    );
};

export default App;