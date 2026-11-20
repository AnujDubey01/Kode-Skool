import axios from 'axios';

// When deployed to production (e.g. Vercel), fallback to the live Render backend
const API_BASE_URL =
    process.env.REACT_APP_BACKEND_URL ||
    (process.env.NODE_ENV === 'production'
        ? 'https://kode-skool.onrender.com'
        : 'http://localhost:5000');

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor to automatically add auth-token from localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.set('auth-token', token)
    }
    return config;
}, (error: any) => {
    return Promise.reject(error);
});


export default api;
export { API_BASE_URL };
