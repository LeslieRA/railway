import axios from 'axios';

// La URL de tu backend de autenticación (puerto 7076)
const AUTH_API_URL = "http://localhost:7076/api/auth";

/**
 * Llama al endpoint /login.
 * loginRequest debe ser: { username, password }
 */
export const loginUsuario = (loginRequest) => {
    return axios.post(AUTH_API_URL + "/login", loginRequest);
};

/**
 * Llama al endpoint /register.
 * registerRequest debe ser: { nombre, username, password, puesto }
 */
export const registerEmpleado = (registerRequest) => {
    return axios.post(AUTH_API_URL + "/register", registerRequest);
};

// --- 👇 ESTA ES LA QUE NECESITAS PARA EL CLIENTE 👇 ---
export const loginCliente = (loginRequest) => {
    // El backend espera { username: "correo", password: "..." }
    return axios.post(AUTH_API_URL + "/login-cliente", loginRequest);
};