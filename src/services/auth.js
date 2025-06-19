import api from "../utils/api";

const loginUser = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        const token = response.data.token;
        localStorage.setItem('token', token); 
        return true; 
    } catch (error) {
        console.error('Error durante el login:', error);
        return false; 
    }
};

const logoutUser = () => {
    localStorage.removeItem('token'); 
};

const getToken = () => {
    return localStorage.getItem('token');
};

export { loginUser, logoutUser, getToken };