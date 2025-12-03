import { fondaApi } from "../config/apiConfig";

const PRODUCTO_ENDPOINT = "/api/producto";

export const listarProductos = (filtros) => {
    return fondaApi.get(PRODUCTO_ENDPOINT, { params: filtros });
};

export const crearProducto = (producto) => {
    return fondaApi.post(PRODUCTO_ENDPOINT, producto);
};

export const getProductoById = (id_producto) => {
    return fondaApi.get(`${PRODUCTO_ENDPOINT}/${id_producto}`);
};

export const updateProducto = (id_producto, producto) => {
    return fondaApi.put(`${PRODUCTO_ENDPOINT}/${id_producto}`, producto);
};

export const deleteProducto = (id_producto) => {
    return fondaApi.delete(`${PRODUCTO_ENDPOINT}/${id_producto}`);
};

export const listarTodosLosProductos = () => {
    return fondaApi.get(`${PRODUCTO_ENDPOINT}/todos`);
};