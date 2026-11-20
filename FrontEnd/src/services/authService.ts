import api from './api';
import { AuthResponse, UserRole } from '../types';

export const login = async (email: string, password: string):
    Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/login', { email, password });
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

export const register = async (email: string, password: string, name?: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/register/student', { email, password, name });
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

export const logout = (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
};

export const getToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

export const getRole = (): UserRole => {
    return (localStorage.getItem('user_role') as UserRole) || 'Student';
};

export const getUserName = (): string => {
    return localStorage.getItem('user_name') || 'Student';
};

export const isAuthenticated = (): boolean => {
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
