import axios from 'axios';

// Usamos el puerto 7076 y la ruta /api/mesa
const API_BASE_URL = "http://localhost:7076/api/mesa"; 

export const listarMesas = () => axios.get(API_BASE_URL);

export const crearMesa = (mesa) => axios.post(API_BASE_URL, mesa);

export const getMesaById = (idMesa) => axios.get(`${API_BASE_URL}/${idMesa}`);

export const updateMesa = (idMesa, mesa) => axios.put(`${API_BASE_URL}/${idMesa}`, mesa);

export const deleteMesa = (idMesa) => axios.delete(`${API_BASE_URL}/${idMesa}`);


export const toggleEstadoMesa = (idMesa) => {
    return axios.patch(`${API_BASE_URL}/${idMesa}/toggle-estado`);
};
export const listarMesasDisponibles = () => {
    return axios.get(`${API_BASE_URL}/disponibles`);
};