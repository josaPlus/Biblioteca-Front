// src/components/LibroForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createLibro, getLibroByCodigo, updateLibro } from '../services/LibroService';

const LibroForm = () => {
    const navigate = useNavigate();
    const { codigo } = useParams();

    const [libro, setLibro] = useState({
        titulo: '',
        autor: '',
        anio: '',
        categoria: '',
        numPaginas: '', 
        codigo: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const isEditing = Boolean(codigo);

    useEffect(() => {
        if (isEditing) {
            const fetchLibro = async () => {
                setLoading(true);
                setError('');
                try {
                    const data = await getLibroByCodigo(codigo);
                    setLibro({
                        titulo: data.titulo,
                        autor: data.autor,
                        anio: data.anio,
                        categoria: data.categoria,
                        numPaginas: data.numPaginas, 
                        codigo: data.codigo
                    });
                } catch (err) {
                    console.error('Error al cargar el libro para edición:', err);
                    setError('No se pudo cargar el libro para edición.');
                } finally {
                    setLoading(false);
                }
            };
            fetchLibro();
        }
    }, [codigo, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLibro((prevLibro) => ({
            ...prevLibro,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            if (isEditing) {
                await updateLibro(libro.codigo, {
                    titulo: libro.titulo,
                    autor: libro.autor,
                    anio: parseInt(libro.anio),
                    categoria: libro.categoria,
                    numPaginas: parseInt(libro.numPaginas) 
                });
                setSuccessMessage('Libro actualizado exitosamente!');
            } else {
                await createLibro({
                    titulo: libro.titulo,
                    autor: libro.autor,
                    anio: parseInt(libro.anio),
                    categoria: libro.categoria,
                    numPaginas: parseInt(libro.numPaginas) 
                });
                setSuccessMessage('Libro creado exitosamente!');
                setLibro({
                    titulo: '',
                    autor: '',
                    anio: '',
                    categoria: '',
                    numPaginas: '', 
                    codigo: ''
                });
            }
            setTimeout(() => {
                navigate('/libros');
            }, 2000);
        } catch (err) {
            console.error('Error al guardar el libro:', err);
            // --- BLOQUE DE MANEJO DE ERRORES MEJORADO (revisado ligeramente) ---
            if (err.response && err.response.data) {
                if (typeof err.response.data.detail === 'string') {
                    setError(`Error del servidor: ${err.response.data.detail}`);
                } else if (Array.isArray(err.response.data.detail)) {
                    const errorMessages = err.response.data.detail.map(e => {
                        // Concatenar el campo y el mensaje si están disponibles
                        const loc = e.loc && Array.isArray(e.loc) ? e.loc.join('.') : '';
                        return `${loc ? loc + ': ' : ''}${e.msg}`;
                    }).join('; ');
                    setError(`Errores de validación: ${errorMessages}`);
                } else if (err.response.data.message) {
                    setError(`Error: ${err.response.data.message}`);
                } else {
                    setError('Error desconocido del servidor. Consulta la consola.');
                }
            } else if (err.message) {
                setError(`Error de conexión: ${err.message}. Asegúrate que el backend está corriendo.`);
            } else {
                setError('Ocurrió un error inesperado al procesar la solicitud.');
            }
            // --- FIN DEL BLOQUE DE MANEJO DE ERRORES MEJORADO ---
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing && !libro.titulo) {
        return <p>Cargando datos del libro...</p>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>{isEditing ? `Editar Libro: ${libro.titulo}` : 'Crear Nuevo Libro'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="titulo">Título:</label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={libro.titulo}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="autor">Autor:</label>
                    <input
                        type="text"
                        id="autor"
                        name="autor"
                        value={libro.autor}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="anio">Año:</label>
                    <input
                        type="number"
                        id="anio"
                        name="anio"
                        value={libro.anio}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="categoria">Categoría:</label>
                    <input
                        type="text"
                        id="categoria"
                        name="categoria"
                        value={libro.categoria}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="numPaginas">Número de Páginas:</label>
                    <input
                        type="number"
                        id="numPaginas"
                        name="numPaginas"
                        value={libro.numPaginas}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <button type="submit" disabled={loading} style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
                    {loading ? 'Guardando...' : (isEditing ? 'Actualizar Libro' : 'Crear Libro')}
                </button>
                <button type="button" onClick={() => navigate('/libros')} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default LibroForm;