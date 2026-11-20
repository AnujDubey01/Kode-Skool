import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getToken, getRole, getUserName } from '../services/authService';
import { AuthResponse, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState(getToken());
    const [role, setRole] = useState(getRole());
    const [userName, setUserName] = useState(getUserName());
    const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());

    useEffect(() => {
        const storedToken = getToken();
        setToken(storedToken);
        setRole(getRole());
        setUserName(getUserName());
        setIsLoggedIn(!!storedToken);
    }, []);


    const login = async (email: string, password: string): Promise<AuthResponse> => {
        const data = await apiLogin(email, password);
        if (data.success && data.auth_token) {
            setToken(data.auth_token);
            const userRole = data.userType || 'Student';
            setRole(userRole);
            const name = data.userName || email.split('@')[0] || 'Student';
            setUserName(name);
            setIsLoggedIn(true);
        }
        return data;
    };

    const register = async (email: string, password: string, name: string): Promise<AuthResponse> => {
        const data = await apiRegister(email, password, name);
        if (data.success && data.auth_token) {
            setToken(data.auth_token);
            const userRole = data.userType || 'Student';
            setRole(userRole);
            setUserName(name || 'Student');
            setIsLoggedIn(true);
        }
        return data;
    };

    const logout = () => {
        apiLogout();
        setToken(null);
        setRole('Student');
        setUserName('Student');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ token, role, userName, setUserName, isLoggedIn, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
