import axios from 'axios';

const API_BASE_URL = "http://localhost:7073/api/producto"; 

// --- 👇 ESTA ES LA ÚNICA VERSIÓN DE listarProductos 👇 ---
/**
 * Busca productos. Si no se envían filtros, el backend trae todos los activos.
 * @param {object} filtros - Opcional. Objeto con { nombre, idTipo, precioMin, precioMax }
 */
export const listarProductos = (filtros) => {
    return axios.get(API_BASE_URL, {
        params: filtros // axios los convierte a ?nombre=...&idTipo=...
    });
};

export const crearProducto = (producto) => {
    return axios.post(API_BASE_URL, producto);
};

// Obtiene un producto por su ID
export const getProductoById = (id_producto) => {
    return axios.get(`${API_BASE_URL}/${id_producto}`);
};

// Actualiza un producto existente
export const updateProducto = (id_producto, producto) => {
    return axios.put(`${API_BASE_URL}/${id_producto}`, producto);
};

// Elimina (desactiva) un producto
export const deleteProducto = (id_producto) => {
    return axios.delete(`${API_BASE_URL}/${id_producto}`);
};

// ESTA ES LA FUNCIÓN QUE USA TU TABLA DE GESTIÓN
export const listarTodosLosProductos = () => {
    return axios.get(`${API_BASE_URL}/todos`);
};