import React, { useState, useEffect } from 'react';
import { crearReserva } from '../services/ReservaService';
import { getClienteByCorreo } from '../services/ClienteService';
import { listarMesasDisponibles } from '../services/MesaService';
import { useNavigate } from 'react-router-dom';
import { FaCalendarCheck, FaTimes, FaUser, FaChair } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export const ReservaClienteComponent = () => {
    // Estados del formulario
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [idMesa, setIdMesa] = useState('');
    
    // Estado para guardar la info del cliente logueado
    const [miCliente, setMiCliente] = useState(null);
    const [mesasDisponibles, setMesasDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { user } = useAuth(); // Obtenemos el usuario (correo) del contexto

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                // 1. Cargar mesas disponibles
                const mesasRes = await listarMesasDisponibles();
                setMesasDisponibles(mesasRes.data);

                // 2. Buscar mi información de cliente usando el correo del login
                if (user?.username) {
                    const clienteRes = await getClienteByCorreo(user.username);
                    setMiCliente(clienteRes.data); // Guardamos el objeto cliente completo
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
                alert("Error al cargar tu información. Por favor inicia sesión nuevamente.");
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [user]);

    const handleGuardarReserva = (e) => {
        e.preventDefault();

        if (!miCliente) {
            alert("No se pudo identificar al cliente. Intenta recargar la página.");
            return;
        }

        const reserva = {
            fecha,
            hora,
            idCliente: miCliente.id_cliente, // Usamos el ID que recuperamos automáticamente
            idMesa,
            estado: 'PENDIENTE' // Siempre se crea como pendiente
        };

        crearReserva(reserva).then(() => {
            alert("¡Reserva creada con éxito! ✅");
            // Redirigir DIRECTAMENTE a "Mis Reservas"
            navigate('/mis-reservas');
        }).catch(error => {
            console.error("Error al reservar:", error);
            alert("Hubo un error al crear la reserva.");
        });
    };

    if (loading) return <div className="container"><h2 className="title">Cargando formulario...</h2></div>;

    return (
        <div className="container" style={{maxWidth: '600px'}}>
            <h2 className="title">Hacer una Reservación</h2>
            
            <form onSubmit={handleGuardarReserva}>
                
                {/* CAMPO DE CLIENTE (FIJO / SOLO LECTURA) */}
                <div className="form-group">
                    <label><FaUser /> Cliente</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={miCliente ? miCliente.nombreCliente : 'Cargando...'} 
                        disabled // Bloqueado para que no se pueda cambiar
                        style={{backgroundColor: '#e9ecef', cursor: 'not-allowed', fontWeight: 'bold'}}
                    />
                    <small className="text-muted">Reservando con cuenta: {user?.username}</small>
                </div>

                {/* CAMPO DE MESA (SELECCIONABLE) */}
                <div className="form-group">
                    <label><FaChair /> Elegir Mesa</label>
                    <select 
                        className="form-control" 
                        value={idMesa} 
                        onChange={(e) => setIdMesa(e.target.value)} 
                        required
                    >
                        <option value="">-- Selecciona una mesa disponible --</option>
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
                        <input 
                            type="date" 
                            className="form-control" 
                            value={fecha} 
                            onChange={(e) => setFecha(e.target.value)} 
                            required 
                            min={new Date().toISOString().split('T')[0]} // No permitir fechas pasadas
                        />
                    </div>
                    <div className="form-group">
                        <label>Hora</label>
                        <input 
                            type="time" 
                            className="form-control" 
                            value={hora} 
                            onChange={(e) => setHora(e.target.value)} 
                            required 
                        />
                    </div>
                </div>

                <div className="actions">
                    <button type="submit" className="btn btn-save">
                        <FaCalendarCheck /> Confirmar Reserva
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-cancel" 
                        onClick={() => navigate('/menu')}
                    >
                        <FaTimes /> Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};