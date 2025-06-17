// src/services/libroService.js
import api from '../utils/api'; // Importa la instancia de Axios configurada

const getLibros = async () => {
    try {
        const response = await api.get('/libros');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los libros:', error);
        throw error; // Propagar el error para que el componente lo maneje
    }
};

const getLibroByCodigo = async (codigo) => {
    try {
        const response = await api.get(`/libros/${codigo}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el libro con código ${codigo}:`, error);
        throw error;
    }
};

const getLibrosByCategoria = async (categoria) => {
    try {
        const response = await api.get(`/libros/categoria/${categoria}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener libros por categoría ${categoria}:`, error);
        throw error;
    }
};

const createLibro = async (libroData) => {
    try {
        const response = await api.post('/libros', libroData);
        return response.data;
    } catch (error) {
        console.error('Error al crear el libro:', error);
        throw error;
    }
};

const updateLibro = async (codigo, libroData) => {
    try {
        const response = await api.put(`/libros/${codigo}`, libroData);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar el libro con código ${codigo}:`, error);
        throw error;
    }
};

const deleteLibro = async (codigo) => {
    try {
        const response = await api.delete(`/libros/${codigo}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar el libro con código ${codigo}:`, error);
        throw error;
    }
};

export {
    getLibros,
    getLibroByCodigo,
    getLibrosByCategoria,
    createLibro,
    updateLibro,
    deleteLibro,
};