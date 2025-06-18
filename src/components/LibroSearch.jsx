import { useState } from "react";
import { getLibroByCodigo, getLibrosByCategoria, deleteLibro } from "../services/LibroService";
import { useNavigate } from "react-router-dom";

const LibroSearch = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Usaremos un solo campo para el término de búsqueda
    const [searchType, setSearchType] = useState('codigo'); // 'codigo' o 'categoria'
    const [resultados, setResultados] = useState(null); // Puede ser un solo libro o un array de libros
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        setSearchTerm(''); // Limpiar el término de búsqueda al cambiar el tipo
        setResultados(null); // Limpiar resultados y errores
        setError('');
    };

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        setError(''); // Limpiar errores al cambiar el input
        setResultados(null); // Limpiar resultados
    };

    const handleDelete = async (codigoLibro) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el libro con código ${codigoLibro}?`)) {
            setLoading(true);
            setError('');
            try {
                await deleteLibro(codigoLibro);
                // Si la eliminación fue exitosa, actualiza los resultados para que el libro desaparezca
                setResultados(prevResultados => prevResultados.filter(libro => (libro.codigo || libro.id) !== codigoLibro));
                console.log(`Libro con código ${codigoLibro} eliminado exitosamente.`);
                // Opcional: mostrar un mensaje de éxito temporal
            } catch (err) {
                console.error('Error al eliminar el libro:', err);
                if (err.response && err.response.data && typeof err.response.data.detail === 'string') {
                    setError(`Error al eliminar: ${err.response.data.detail}`);
                } else {
                    setError('Ocurrió un error al eliminar el libro.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResultados(null);

        if (!searchTerm.trim()) {
            setError('Por favor, ingresa un término de búsqueda.');
            setLoading(false);
            return;
        }

        try {
            if (searchType === 'codigo') {
                const data = await getLibroByCodigo(searchTerm); // Pasa el código
                setResultados([data]); // Envuelve el libro individual en un array para un manejo consistente
            } else { 
                const data = await getLibrosByCategoria(searchTerm); // Pasa la categoría
                setResultados(data); // Esto ya es un array de libros
            }
        } catch (err) {
            console.error(`Error al buscar libro por ${searchType}:`, err);
            if (err.response) {
                if (err.response.status === 404) {
                    setError(`No se encontraron resultados para "${searchTerm}" en la ${searchType}.`);
                } else if (err.response.data && typeof err.response.data.detail === 'string') {
                    setError(`Error del servidor: ${err.response.data.detail}`);
                } 
            } else {
                setError('Ocurrió un error inesperado al procesar la solicitud.');
            }
            setResultados(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Buscar Libro</h2>
            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="searchType" style={{ marginRight: '10px' }}>Buscar por:</label>
                    <select
                        id="searchType"
                        value={searchType}
                        onChange={handleSearchTypeChange}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="codigo">Código</option>
                        <option value="categoria">Categoría</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type={searchType === 'codigo' ? 'text' : 'text'} 
                        placeholder={`Introduce ${searchType === 'codigo' ? 'el código' : 'la categoría'}`}
                        value={searchTerm}
                        onChange={handleChange}
                        style={{ flexGrow: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/libros')}
                        style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Volver
                    </button>
                </div>
            </form>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            {resultados && resultados.length > 0 ? (
                <div style={{ marginTop: '20px' }}>
                    <h3>Resultados de la búsqueda:</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {resultados.map((libro) => (
                            <div key={libro.codigo || libro.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <h4>{libro.titulo}</h4>
                                <p><strong>Autor:</strong> {libro.autor}</p>
                                <p><strong>Año:</strong> {libro.anio}</p>
                                <p><strong>Categoría:</strong> {libro.categoria}</p>
                                <p><strong>Número de Páginas:</strong> {libro.numPaginas}</p>
                                <p><strong>Código:</strong> {libro.codigo || libro.id}</p> {/* Usa 'codigo' o 'id' */}
                                <button
                                    onClick={() => navigate(`/libros/editar/${libro.codigo || libro.id}`)}
                                    style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#ffc107', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Editar
                                </button>
                                {/* --- BOTÓN DE ELIMINAR --- */}
                                    <button
                                        onClick={() => handleDelete(libro.codigo || libro.id)}
                                        disabled={loading} // Deshabilitar durante la operación
                                        style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Eliminar
                                    </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : resultados !== null && !error && !loading && ( // Si resultados es un array vacío y no hay error/loading
                <p style={{ marginTop: '20px' }}>No se encontraron libros para la búsqueda.</p>
            )}
        </div>
    );
};

export default LibroSearch;