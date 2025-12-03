import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // Si NO está autenticado, redirige inmediatamente al Login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si SÍ está autenticado, muestra el componente hijo (la página solicitada)
    return children;
};