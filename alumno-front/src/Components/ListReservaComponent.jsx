import React, { useState, useEffect, useMemo } from 'react';
import { listarReservas, updateReserva, deleteReserva } from '../services/ReservaService';
import { listClientes } from '../services/ClienteService';
import { useNavigate } from 'react-router-dom';
// 1. Importa todos los iconos necesarios, incluyendo FaTimes
import { FaCashRegister, FaEdit, FaTimes } from 'react-icons/fa';

// Componente para mostrar el estado con un color
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


export const ListReservaComponent = () => {
    const [reservasEnriquecidas, setReservasEnriquecidas] = useState([]);
    // 2. Estados para ambos filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');
    const [loading, setLoading] = useState(true);
    const navegar = useNavigate();

    // Función para cargar y combinar datos
    const cargarDatos = () => {
        setLoading(true);
        Promise.all([
            listarReservas(),
            listClientes()
        ]).then(([reservasResponse, clientesResponse]) => {
            const reservas = reservasResponse.data;
            const clientes = clientesResponse.data;
            const clienteMap = new Map(clientes.map(c => [c.id_cliente, c.nombreCliente]));

            const enriquecidas = reservas.map(reserva => ({
                ...reserva,
                nombreCliente: clienteMap.get(reserva.idCliente) || 'Cliente no encontrado'
            }));

            setReservasEnriquecidas(enriquecidas);
        }).catch(error => {
            console.error("Error al cargar datos:", error);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleGoToVenta = (reserva) => {
        navegar('/registrar-venta', { state: { idCliente: reserva.idCliente, idReserva: reserva.idReserva } });
    };

    const handleEdit = (idReserva) => {
        navegar(`/editar-reserva/${idReserva}`);
    };

    // Función para el borrado físico (hard delete)
    const handleDelete = (idReserva) => {
        if (window.confirm("¿Estás seguro de que deseas ELIMINAR PERMANENTEMENTE esta reserva?")) {
            deleteReserva(idReserva).then(() => {
                setReservasEnriquecidas(reservasEnriquecidas.filter(r => r.idReserva !== idReserva));
                console.log(`Reserva con ID ${idReserva} eliminada.`);
            }).catch(error => console.error("Error al eliminar la reserva:", error));
        }
    };

    // Función para cambiar el estado de la reserva
    const handleStatusChange = (reserva, nuevoEstado) => {
        if (nuevoEstado === 'CANCELADA') {
            handleDelete(reserva.idReserva);
            return;
        }

        const reservaDtoToSend = {
            fecha: reserva.fecha,
            hora: reserva.hora,
            idMesa: reserva.idMesa,
            idCliente: reserva.idCliente,
            estado: nuevoEstado
        };

        updateReserva(reserva.idReserva, reservaDtoToSend).then((response) => {
            const reservaActualizadaBackend = response.data;
            setReservasEnriquecidas(reservasEnriquecidas.map(r =>
                r.idReserva === reservaActualizadaBackend.idReserva
                ? { ...r, estado: reservaActualizadaBackend.estado }
                : r
            ));
        }).catch(error => console.error("Error al actualizar estado:", error));
    };

    // 3. Lógica de filtrado con useMemo para ambos filtros
    const filteredReservas = useMemo(() => {
        return reservasEnriquecidas.filter(reserva => {
            // Filtro por Nombre
            const matchNombre = reserva.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Filtro por Fecha
            // Asumiendo que reserva.fecha es un string 'YYYY-MM-DD'
            const matchFecha = !filtroFecha || reserva.fecha === filtroFecha;

            // Devuelve solo si cumple ambos
            return matchNombre && matchFecha;
        });
    }, [reservasEnriquecidas, searchTerm, filtroFecha]); // Depende de ambos filtros

    const hoy = new Date().toISOString().split('T')[0];

    if (loading) {
        return <div className="container"><h2 className="title">Cargando reservas...</h2></div>;
    }

    return (
        <div className="container">
            <h2 className="title">Historial de Reservas</h2>

            {/* --- 4. Barra de Filtros (usando menu-filters y form-grid) --- */}
            <div className="menu-filters">
                <div className="form-group">
                    <label>Buscar por Nombre</label>
                    <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nombre de cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* Botón para limpiar filtro de nombre */}
                        {searchTerm && (
                            <button 
                                className="btn btn-cancel"
                                onClick={() => setSearchTerm('')}
                                title="Limpiar filtro"
                                style={{padding: '0.5rem 0.8rem'}}
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label>Buscar por Fecha Exacta</label>
                    <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                        <input
                            type="date"
                            className="form-control"
                            value={filtroFecha}
                            onChange={(e) => setFiltroFecha(e.target.value)}
                        />
                        {/* Botón para limpiar filtro de fecha */}
                        {filtroFecha && (
                            <button 
                                className="btn btn-cancel"
                                onClick={() => setFiltroFecha('')}
                                title="Limpiar filtro"
                                style={{padding: '0.5rem 0.8rem'}}
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* --- Fin de Filtros --- */}

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th><th>Cliente</th><th>Fecha y Hora</th><th>Mesa ID</th><th>Estado</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {/* 5. Mapea la lista FILTRADA */}
                    {filteredReservas.length === 0 ? (
                         <tr><td colSpan="6" style={{textAlign: 'center'}}>No se encontraron reservas con esos filtros.</td></tr>
                    ) : (
                        filteredReservas.map(reserva => {
                            const esHoy = reserva.fecha === hoy;
    
                            return (
                                <tr key={reserva.idReserva}>
                                    <td>{reserva.idReserva}</td>
                                    <td>{reserva.nombreCliente}</td>
                                    <td>{new Date(`${reserva.fecha}T${reserva.hora}`).toLocaleString()}</td>
                                    <td>#{reserva.idMesa}</td>
                                    <td><StatusBadge estado={reserva.estado} /></td>
                                    <td>
                                        <div className="actions" style={{justifyContent: 'flex-start', gap: '0.5rem'}}>
                                            
                                            {reserva.estado === 'CONFIRMADO' && esHoy && (
                                                <button
                                                    title="Iniciar Venta"
                                                    className="btn btn-save"
                                                    onClick={() => handleGoToVenta(reserva)}
                                                >
                                                    <FaCashRegister /> Iniciar Venta
                                                </button>
                                            )}
    
                                            {reserva.estado === 'CONFIRMADO' && !esHoy && (
                                                <button
                                                    title={`La reserva es para el ${reserva.fecha}, no para hoy.`}
                                                    className="btn btn-save"
                                                    disabled
                                                    style={{opacity: 0.5, cursor: 'not-allowed'}}
                                                >
                                                    <FaCashRegister /> Iniciar Venta
                                                </button>
                                            )}
    
                                            <button title="Editar Reserva" className="btn btn-edit" onClick={() => handleEdit(reserva.idReserva)}>
                                                <FaEdit /> Editar
                                            </button>
    
                                            <select
                                                value={reserva.estado}
                                                onChange={(e) => handleStatusChange(reserva, e.target.value)}
                                                className="form-control"
                                                style={{width: 'auto'}}
                                            >
                                                <option value="PENDIENTE">Pendiente</option>
                                                <option value="CONFIRMADO">Confirmado</option>
                                                <option value="COMPLETADA">Completada</option>
                                                <option value="CANCELADA">Cancelar y Eliminar</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};