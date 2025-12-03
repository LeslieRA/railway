import { restauranteApi } from "../config/apiConfig";

// La base URL ya está definida en restauranteApi, aquí solo ponemos el endpoint
const BASE_ENDPOINT = "/api/cliente";

// 1. LISTAR
export const listClientes = (nombre) => {
    const params = {};
    if (nombre) {
        params.nombre = nombre;
    }
    return restauranteApi.get(BASE_ENDPOINT, { params });
};

// 2. CREAR
export const crearCliente = (cliente) => {
    return restauranteApi.post(BASE_ENDPOINT, cliente);
};

// 3. OBTENER POR ID
export const getClienteById = (id_cliente) => {
    return restauranteApi.get(`${BASE_ENDPOINT}/${id_cliente}`);
};

// 4. ACTUALIZAR
export const updateCliente = (id_cliente, cliente) => {
    return restauranteApi.put(`${BASE_ENDPOINT}/${id_cliente}`, cliente);
};

// 5. ELIMINAR
export const deleteCliente = (id_cliente) => {
    return restauranteApi.delete(`${BASE_ENDPOINT}/${id_cliente}`);
};

// 6. BUSCAR POR CORREO
export const getClienteByCorreo = (correo) => {
    return restauranteApi.get(`${BASE_ENDPOINT}/buscar-por-correo`, {
        params: { correo }
    });
};