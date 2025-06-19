// src/components/LibrosList.jsx
import React, { useEffect, useState } from 'react';
import { getLibros, deleteLibro } from '../services/LibroService';
import { logoutUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const LibrosList = () => {
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchLibros();
    }, []);

    const fetchLibros = async () => {
        try {
            const data = await getLibros();
            setLibros(data);
        } catch (err) {
            setError('Error al cargar los libros. ¿Estás logueado?');
            console.error(err);
            // Si el error es 401 (Unauthorized), podrías redirigir al login
            if (err.response && err.response.status === 401) {
                logoutUser();
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (codigo) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el libro con código ${codigo}?`)) {
            try {
                await deleteLibro(codigo);
                alert('Libro eliminado exitosamente!');
                fetchLibros(); // Refrescar la lista
            } catch (err) {
                setError('Error al eliminar el libro.');
                console.error(err);
            }
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/'); 
    };

    const handleCreateNew = () => {
        navigate('/libros/crear'); 
    };

    const handleEdit = (codigo) => {
        navigate(`/libros/editar/${codigo}`); 
    };

    const handleSearchPage = () => {
        navigate('/libros/buscar'); 
    };

    if (loading) return <p>Cargando libros...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Lista de Libros</h2>
                <div>
                    <button
                        onClick={handleSearchPage}
                        style={{ padding: '10px 15px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
                    >
                        Buscar Libro
                    </button>    
                    <button
                        onClick={handleCreateNew}
                        style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
                    >
                        Crear Nuevo Libro
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
            {libros.length === 0 ? (
                <p>No hay libros disponibles.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {libros.map((libro) => (
                        <li key={libro.codigo} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                            <h3>{libro.titulo}</h3>
                            <p><strong>Autor:</strong> {libro.autor}</p>
                            <p><strong>Categoría:</strong> {libro.categoria}</p>
                            <p><strong>Año:</strong> {libro.anio}</p>
                            <p><strong>Numero de paginas:</strong> {libro.numPaginas}</p>
                            <p><strong>Código:</strong> {libro.codigo}</p>
                            <button
                                onClick={() => handleEdit(libro.codigo)}
                                style={{ marginRight: '10px', padding: '8px 12px', backgroundColor: '#ffc107', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(libro.codigo)}
                                style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LibrosList;