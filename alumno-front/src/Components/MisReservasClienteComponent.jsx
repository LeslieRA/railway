import React, { useEffect, useState } from 'react';
import { listarReservas } from '../services/ReservaService';
import { getClienteByCorreo } from '../services/ClienteService';
import { useAuth } from '../context/AuthContext';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';

// Reutilizamos tu Badge de estado
const StatusBadge = ({ estado }) => {
    const styles = {
        PENDIENTE: { backgroundColor: '#ffc107', color: '#000' },
        CONFIRMADO: { backgroundColor: '#17a2b8', color: '#fff' },
        COMPLETADA: { backgroundColor: '#28a745', color: '#fff' },
        CANCELADA: { backgroundColor: '#dc3545', color: '#fff' }
    };
    const style = {
        padding: '0.25rem 0.6rem', borderRadius: '12px', fontWeight: 'bold',
        fontSize: '0.8rem', textTransform: 'uppercase', ...styles[estado]
    };
    return <span style={style}>{estado}</span>;
};

export const MisReservasClienteComponent = () => {
    const { user } = useAuth();
    const [misReservas, setMisReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clienteInfo, setClienteInfo] = useState(null);

    useEffect(() => {
        const cargarMisDatos = async () => {
            setLoading(true);
            try {
                // 1. Obtener mi ID de cliente usando el correo del login
                const clienteRes = await getClienteByCorreo(user.username);
                const miCliente = clienteRes.data;
                setClienteInfo(miCliente);

                // 2. Obtener todas las reservas
                const reservasRes = await listarReservas();
                const todasLasReservas = reservasRes.data;

                // 3. Filtrar SOLO las que me pertenecen
                const misDatos = todasLasReservas.filter(r => r.idCliente === miCliente.id_cliente);
                
                // (Opcional) Ordenarlas por fecha (más recientes primero)
                misDatos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

                setMisReservas(misDatos);
            } catch (error) {
                console.error("Error al cargar mis reservas:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.username) {
            cargarMisDatos();
        }
    }, [user]);

    if (loading) return <div className="container"><h2 className="title">Cargando tu historial...</h2></div>;

    return (
        <div className="container">
            <h2 className="title">
                Mis Reservaciones
                {clienteInfo && <small style={{display:'block', fontSize:'1rem', color:'#666'}}>Cliente: {clienteInfo.nombreCliente}</small>}
            </h2>

            {misReservas.length === 0 ? (
                <div className="alert alert-info text-center">
                    <FaInfoCircle /> No tienes reservaciones registradas. 
                    <br />
                    <a href="/mis-reservas" style={{fontWeight: 'bold', color: '#0c5460'}}>¡Haz tu primera reserva aquí!</a>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th><FaCalendarAlt /> Fecha</th>
                                <th><FaClock /> Hora</th>
                                <th><FaMapMarkerAlt /> Mesa</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {misReservas.map(reserva => (
                                <tr key={reserva.idReserva}>
                                    <td>{new Date(reserva.fecha + 'T00:00:00').toLocaleDateString()}</td>
                                    <td>{reserva.hora}</td>
                                    <td>Mesa #{reserva.idMesa}</td> {/* Si quieres más detalles de la mesa, habría que cruzarlos */}
                                    <td><StatusBadge estado={reserva.estado} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};