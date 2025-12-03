// src/config/axiosConfig.js

import axios from 'axios';

// La URL de tu microservicio de autenticación (ej. 7076)
const AUTH_URL_BASE = "http://localhost:7076"; 

/**
 * Configura un interceptor de peticiones que añade el token JWT
 * a la cabecera 'Authorization' para todas las llamadas a tus microservicios.
 */
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); 

        // Solo añadimos el token si la URL no es para login/registro
        // Y solo si la petición va a uno de nuestros backends (7072, 7073, 7076, 8080)
        // La simple existencia del token es suficiente por ahora.
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/*
 * Opcional: Interceptor de respuestas para manejar el 401.
 * Si el servidor dice 401 (token expirado), borra el token y redirige al login.
 */
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            console.log("Sesión expirada o no válida. Redirigiendo a /login.");
            localStorage.removeItem('token');
            // Usamos window.location.href para forzar la navegación fuera de React Router
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

// No necesitamos exportar nada. La simple importación ejecutará la configuración.