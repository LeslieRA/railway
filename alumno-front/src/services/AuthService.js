import { restauranteApi } from "../config/apiConfig";

const AUTH_ENDPOINT = "/api/auth";

export const loginUsuario = (loginRequest) => {
    return restauranteApi.post(`${AUTH_ENDPOINT}/login`, loginRequest);
};

export const registerEmpleado = (registerRequest) => {
    return restauranteApi.post(`${AUTH_ENDPOINT}/register`, registerRequest);
};

export const loginCliente = (loginRequest) => {
    return restauranteApi.post(`${AUTH_ENDPOINT}/login-cliente`, loginRequest);
};