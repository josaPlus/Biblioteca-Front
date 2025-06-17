import api from "../utils/api";

const loginUser = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        // Asumiendo que tu API devuelve { "token": "..." }
        const token = response.data.token;
        localStorage.setItem('token', token); // Almacenar el token en localStorage
        return true; // Login exitoso
    } catch (error) {
        console.error('Error durante el login:', error);
        return false; // Login fallido
    }
};

const logoutUser = () => {
    localStorage.removeItem('token'); // Eliminar el token del localStorage
};

const getToken = () => {
    return localStorage.getItem('token');
};

export { loginUser, logoutUser, getToken };