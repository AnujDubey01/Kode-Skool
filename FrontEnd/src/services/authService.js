import api from './api';

export const login = async (email, password) => {
    const response = await api.post('/api/login', { email, password });
    if (response.data && response.data.auth_token) {
        localStorage.setItem('auth_token', response.data.auth_token);
        if (response.data.userType) {
            localStorage.setItem('user_role', response.data.userType);
        }
        if (response.data.userName) {
            localStorage.setItem('user_name', response.data.userName);
        } else {
            localStorage.setItem('user_name', email.split('@')[0]);
        }
        if (response.data.email) {
            localStorage.setItem('user_email', response.data.email);
        }
    }
    return response.data;
};

export const register = async (email, password, name) => {
    const response = await api.post('/api/register/student', { email, password, name });
    if (response.data && response.data.auth_token) {
        localStorage.setItem('auth_token', response.data.auth_token);
        if (response.data.userType) {
            localStorage.setItem('user_role', response.data.userType);
        }
        if (response.data.userName) {
            localStorage.setItem('user_name', response.data.userName);
        } else if (name) {
            localStorage.setItem('user_name', name);
        }
        if (response.data.email) {
            localStorage.setItem('user_email', response.data.email);
        }
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
};

export const getToken = () => {
    return localStorage.getItem('auth_token');
};

export const getRole = () => {
    return localStorage.getItem('user_role') || 'Student';
};

export const getUserName = () => {
    return localStorage.getItem('user_name') || 'Student';
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('auth_token');
};

const authService = {
    login,
    register,
    logout,
    getToken,
    getRole,
    getUserName,
    isAuthenticated
};

export default authService;
