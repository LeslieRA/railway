import axios from 'axios';

// Asumiendo que tu microservicio 'fonda1' corre en el puerto 7073
const API_BASE_URL = "http://localhost:7073/api/venta"; 

export const crearVenta = (ventaDto) => {
    return axios.post(API_BASE_URL, ventaDto);
};
// --- 👇 AÑADE ESTAS NUEVAS FUNCIONES 👇 ---

// Obtiene la lista de todas las ventas
export const listarVentas = () => {
    return axios.get(API_BASE_URL);
};

// Obtiene los detalles de una sola venta por su ID
export const getVentaById = (idVenta) => {
    return axios.get(`${API_BASE_URL}/${idVenta}`);
};


// --- 👇 AÑADE ESTA FUNCIÓN 👇 ---
export const deleteVenta = (idVenta) => {
    return axios.delete(`${API_BASE_URL}/${idVenta}`);
};
// --- 👇 AÑADE ESTA FUNCIÓN SI NO LA TIENES 👇 ---
export const updateVenta = (idVenta, ventaDto) => {
    return axios.put(`${API_BASE_URL}/${idVenta}`, ventaDto);
};

export const generarTicketPdf = (idVenta) => {
    // No usamos window.open aquí.
    // Pedimos a axios que descargue el archivo como un 'blob' (objeto binario)
    // El interceptor se encargará de ponerle el Token automáticamente.
    return axios.get(`${API_BASE_URL}/${idVenta}/ticket`, {
        responseType: 'blob' 
    });
};