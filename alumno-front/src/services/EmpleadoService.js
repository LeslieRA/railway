import axios from 'axios';

// Usamos el puerto y la ruta que me proporcionaste
const API_BASE_URL = "http://localhost:7076/api/empleado"; 

// --- Funciones CRUD completas para Empleado ---

export const listarEmpleados = () => axios.get(API_BASE_URL);

export const crearEmpleado = (empleado) => axios.post(API_BASE_URL, empleado);

export const getEmpleadoById = (idEmpleado) => axios.get(`${API_BASE_URL}/${idEmpleado}`);

export const updateEmpleado = (idEmpleado, empleado) => axios.put(`${API_BASE_URL}/${idEmpleado}`, empleado);

export const deleteEmpleado = (idEmpleado) => axios.delete(`${API_BASE_URL}/${idEmpleado}`);