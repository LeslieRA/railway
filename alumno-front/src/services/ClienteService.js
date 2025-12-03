import axios from "axios";

const REST_API_BASE_URL = "http://localhost:7072/api/cliente";

// 1. LISTAR (Para la tabla y dropdowns)
export const listClientes = (nombre) => {
    const params = {};
    if (nombre) {
        params.nombre = nombre;
    }
    return axios.get(REST_API_BASE_URL, { params });
};

// 2. CREAR (Para registrarse)
export const crearCliente = (cliente) => {
    return axios.post(REST_API_BASE_URL, cliente);
};

// 3. OBTENER POR ID (Para editar)
// 👇 AQUÍ ESTABA EL ERROR: Cambiamos 'getCliente' por 'getClienteById'
export const getClienteById = (id_cliente) => {
    return axios.get(`${REST_API_BASE_URL}/${id_cliente}`);
};

// 4. ACTUALIZAR
export const updateCliente = (id_cliente, cliente) => {
    return axios.put(`${REST_API_BASE_URL}/${id_cliente}`, cliente);
};

// 5. ELIMINAR
export const deleteCliente = (id_cliente) => {
    return axios.delete(`${REST_API_BASE_URL}/${id_cliente}`);
};

// 6. BUSCAR POR CORREO (Para identificar al cliente logueado)
export const getClienteByCorreo = (correo) => {
    return axios.get(`${REST_API_BASE_URL}/buscar-por-correo`, {
        params: { correo }
    });
};
