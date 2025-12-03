import axios from 'axios';

// ==========================================
// 1. Definición de URLs Base (Producción)
// ==========================================

// Servicio RESTAURANTE (Railway) -> Auth, Clientes, Empleados
// Nota: Usamos la URL HTTP, no la conexión a MySQL directa.
const RESTAURANTE_URL = 'https://restaurante-production-86f0.up.railway.app';

// Servicio FONDA (Render) -> Productos, Ventas, Tipos
//const FONDA_URL = 'https://fondacorazon.onrender.com';

// Servicio RESERVACIONES (Google Cloud) -> Reservas, Mesas, Atender
//const RESERVAS_URL = 'https://reservacionescora-372766336772.us-central1.run.app';

// ==========================================
// 2. Creación de Instancias de Axios
// ==========================================

export const restauranteApi = axios.create({
    baseURL: RESTAURANTE_URL,
    headers: { 'Content-Type': 'application/json' }
});

/*export const fondaApi = axios.create({
    baseURL: FONDA_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const reservasApi = axios.create({
    baseURL: RESERVAS_URL,
    headers: { 'Content-Type': 'application/json' }
});
*/
// ==========================================
// 3. Interceptor de Seguridad (Token JWT)
// ==========================================

const addTokenInterceptor = (config) => {
    // Según tu AuthContext, guardas el token directo como string 'token'
    const token = localStorage.getItem('token'); 
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

// ==========================================
// 4. Interceptor de Errores (401 Logout)
// ==========================================

const handleUnauthorizedInterceptor = (error) => {
    if (error.response && error.response.status === 401) {
        console.warn("Sesión expirada o no válida (401). Redirigiendo al login.");
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
};

// Aplicar interceptores a TODAS las instancias
[restauranteApi, fondaApi, reservasApi].forEach(instance => {
    instance.interceptors.request.use(addTokenInterceptor);
    instance.interceptors.response.use(response => response, handleUnauthorizedInterceptor);
});