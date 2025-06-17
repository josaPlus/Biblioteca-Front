import axios from "axios";

const api = axios.create({
    baseURL: 'http://143.198.68.4', 
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.url !== '/login') { // No añadir el token a la petición de login
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;