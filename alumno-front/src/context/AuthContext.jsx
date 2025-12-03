// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { decodeJwt } from '../utils/useJwtDecoder'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const isAuthenticated = !!token;

    // Efecto para decodificar el token y establecer el usuario
    useEffect(() => {
        if (token) {
            const decodedUser = decodeJwt(token);
            setUser(decodedUser);
        } else {
            setUser(null);
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        // Redirigir al login
        window.location.href = '/login'; 
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);