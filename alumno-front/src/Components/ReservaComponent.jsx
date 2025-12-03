import React, { useState, useEffect } from 'react';
import { crearReserva, getReservaById, updateReserva } from '../services/ReservaService';
import { listClientes, getClienteByCorreo } from '../services/ClienteService';
import { listarMesasDisponibles } from '../services/MesaService';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export const ReservaComponent = () => {
    // --- Estados ---
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [idCliente, setIdCliente] = useState('');
    const [idMesa, setIdMesa] = useState('');
    const [estado, setEstado] = useState('PENDIENTE');

    const [clientes, setClientes] = useState([]);
    const [mesasDisponibles, setMesasDisponibles] = useState([]);
    
    const navigate = useNavigate();
    const { idReserva } = useParams();
    
    // Obtener datos del usuario logueado
    const { user } = useAuth();
    const isCliente = user?.role === 'CLIENTE';

    useEffect(() => {
        // Cargar mesas disponibles
        listarMesasDisponibles().then(res => setMesasDisponibles(res.data)).catch(err => console.error("Error mesas:", err));

        // --- Lógica de Seguridad para Clientes ---
        if (isCliente && user?.username) {
            // Si es cliente, buscamos SU ID específico
            getClienteByCorreo(user.username).then(res => {
                const miCliente = res.data;
                // 1. Fijamos el ID automáticamente
                setIdCliente(miCliente.id_cliente);
                // 2. Limitamos la lista a solo él mismo (cosmético)
                setClientes([miCliente]);
            }).catch(err => console.error("Error al identificar al cliente:", err));
        
        } else {
            // Si es empleado, cargamos todos los clientes
            listClientes().then(res => setClientes(res.data)).catch(err => console.error("Error clientes:", err));
        }

        // Cargar datos si es edición
        if (idReserva) {
            getReservaById(idReserva).then(res => {
                const reserva = res.data;
                setFecha(reserva.fecha);
                setHora(reserva.hora);
                setIdCliente(reserva.idCliente);
                setIdMesa(reserva.idMesa);
                setEstado(reserva.estado);
            }).catch(err => console.error("Error reserva:", err));
        }
    }, [idReserva, isCliente, user]);

    function saveOrUpdateReserva(e) {
        e.preventDefault();
        const reserva = { fecha, hora, idCliente, idMesa, estado };
        
        // Definimos a dónde ir: Cliente -> Mis Reservas | Empleado -> Lista General
        const rutaDestino = isCliente ? '/mis-reservas' : '/reservas';

        if (idReserva) {
            updateReserva(idReserva, reserva).then(() => {
                alert("Reserva actualizada con éxito ✅");
                navigate(rutaDestino); // Navega SOLO cuando termina de guardar
            }).catch(err => console.error(err));
        } else {
            crearReserva({ ...reserva, estado: 'PENDIENTE' }).then(() => {
                alert("Reserva creada con éxito ✅");
                navigate(rutaDestino); // Navega SOLO cuando termina de guardar
            }).catch(err => console.error(err));
        }
    }

    return (
        <div className="container">
            <h2 className="title">{idReserva ? 'Editar Reserva' : 'Crear Nueva Reserva'}</h2>
            
            <form onSubmit={saveOrUpdateReserva}>
                
                <div className="form-group">
                    <label>Cliente</label>
                    <select 
                        className="form-control" 
                        value={idCliente} 
                        onChange={(e) => setIdCliente(e.target.value)} 
                        required
                        disabled={isCliente} // Bloqueado para clientes
                        style={isCliente ? {backgroundColor: '#e9ecef', cursor: 'not-allowed'} : {}}
                    >
                        <option value="">-- Selecciona un cliente --</option>
                        {clientes.map(c => (
                            <option key={c.id_cliente} value={c.id_cliente}>
                                {c.nombreCliente}
                            </option>
                        ))}
                    </select>
                    {isCliente && <small className="text-muted">Reservando como: {user?.username}</small>}
                </div>

                <div className="form-group">
                    <label>Mesa Disponible</label>
                    <select className="form-control" value={idMesa} onChange={(e) => setIdMesa(e.target.value)} required>
                        <option value="">-- Selecciona una mesa --</option>
                        {mesasDisponibles.map(m => (
                            <option key={m.idMesa} value={m.idMesa}>
                                Mesa #{m.numero} ({m.capacidad} personas) - {m.ubicacion}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label>Fecha</label>
                        <input type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Hora</label>
                        <input type="time" className="form-control" value={hora} onChange={(e) => setHora(e.target.value)} required />
                    </div>
                </div>

                {/* Estado solo visible si NO es cliente */}
                {idReserva && !isCliente && (
                    <div className="form-group">
                        <label>Estado de la Reserva</label>
                        <select className="form-control" value={estado} onChange={(e) => setEstado(e.target.value)}>
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="CONFIRMADO">Confirmado</option>
                            <option value="COMPLETADA">Completada</option>
                            <option value="CANCELADA">Cancelada</option>
                        </select>
                    </div>
                )}

                <div className="actions">
                    {/* 👇 CORREGIDO: Se eliminó el onClick que causaba el error 👇 */}
                    <button type="submit" className="btn btn-save">
                        <FaSave /> Guardar
                    </button>
                    
                    <button 
                        type="button" 
                        className="btn btn-cancel" 
                        onClick={() => navigate(isCliente ? '/mis-reservas' : '/reservas')}
                    >
                        <FaTimes /> Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};