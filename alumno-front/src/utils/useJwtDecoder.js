// src/utils/useJwtDecoder.js

/**
 * Decodifica el payload (datos) de un JWT token (sin verificar la firma)
 * para obtener la información del usuario (roles, username, etc.)
 */
export const decodeJwt = (token) => {
    if (!token) return null;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decoded = JSON.parse(jsonPayload);
        
        // --- 👇 CORRECCIÓN AQUÍ 👇 ---
        // Tu backend guarda el rol en la propiedad "role".
        // A veces Spring lo pone en "authorities". Buscamos en ambos por seguridad.
        const role = decoded.role || (decoded.authorities && decoded.authorities[0] ? decoded.authorities[0].authority : null);
        
        return {
            username: decoded.sub, 
            role: role // Esto debe devolver strings como "ROLE_ADMINISTRADOR"
        };
    } catch (e) {
        console.error("Error decodificando token:", e);
        return null;
    }
};