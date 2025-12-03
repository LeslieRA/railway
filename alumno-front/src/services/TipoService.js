import axios from 'axios';

// Usamos la ruta y puerto que me proporcionaste
const API_BASE_URL = "http://localhost:7073/api/tipoProducto"; 

export const listarTipos = () => {
    return axios.get(API_BASE_URL);
};

export const crearTipo = (tipo) => {
    return axios.post(API_BASE_URL, tipo);
};

// Debes usar 'API_BASE_URL' que es la constante que definiste arriba
export const getTipoById = (tipoId) => axios.get(API_BASE_URL + '/' + tipoId);

export const updateTipo = (tipoId, tipo) => axios.put(API_BASE_URL + '/' + tipoId, tipo);

export const deleteTipo = (tipoId) => axios.delete(API_BASE_URL + '/' + tipoId);