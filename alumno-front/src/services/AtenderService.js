import axios from 'axios';

// Asumiendo que el endpoint de Atender está en el MS de reservaciones
const API_BASE_URL = "http://localhost:7076/api/atender"; 

// Función para crear un registro de atención
// Espera un objeto como { idventa: 1, idempleado: 5 }
export const crearAtencion = (atencionData) => {
    return axios.post(API_BASE_URL, atencionData);
};

// ... (tu función crearAtencion)

// --- 👇 AÑADE ESTA FUNCIÓN 👇 ---
export const listarAtenciones = () => {
    return axios.get(API_BASE_URL);
};