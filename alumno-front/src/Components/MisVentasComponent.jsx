import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarVentas } from '../services/VentaService';
import { listClientes } from '../services/ClienteService';
import { listarEmpleados } from '../services/EmpleadoService';
import { listarAtenciones } from '../services/AtenderService';
import { useAuth } from '../context/AuthContext'; 
import { FaUserCheck, FaCalendarDay, FaMoneyBillWave, FaEye, FaEdit } from 'react-icons/fa';
import { DetalleVentaComponent } from './DetalleVentaComponent';

export const MisVentasComponent = () => {
    const { user } = useAuth(); 
    const [misRegistros, setMisRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [empleadoInfo, setEmpleadoInfo] = useState(null);
    
    // Estados para el Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedVentaId, setSelectedVentaId] = useState(null);
    
    const navigate = useNavigate();

    // Función para editar la venta (Redirige a otra página)
    const handleEdit = (idVenta) => {
        navigate(`/editar-venta-mesero/${idVenta}`);
    };

    // Función para ver detalles (Abre el Modal)
    const handleVerDetalle = (idVenta) => {
        setSelectedVentaId(idVenta);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedVentaId(null);
    };

    useEffect(() => {
        if (!user) return; 

        setLoading(true);
        
        Promise.all([
            listarEmpleados(),
            listarAtenciones(),
            listarVentas(),
            listClientes()
        ]).then(([empleadosRes, atencionesRes, ventasRes, clientesRes]) => {
            
            const todosEmpleados = empleadosRes.data;
            const todasAtenciones = atencionesRes.data;
            const todasVentas = ventasRes.data;
            const todosClientes = clientesRes.data;

            const miEmpleado = todosEmpleados.find(e => e.username === user.username);
            
            if (!miEmpleado) {
                console.warn("El usuario logueado no está en la lista de empleados.");
                setLoading(false);
                return;
            }
            setEmpleadoInfo(miEmpleado);

            const misAtenciones = todasAtenciones.filter(a => a.idEmpleado === miEmpleado.idEmpleado);

            const registrosProcesados = misAtenciones.map(atencion => {
                const venta = todasVentas.find(v => v.idVenta === atencion.idVenta);
                
                if (!venta) return null;

                const cliente = todosClientes.find(c => c.id_cliente === venta.idCliente);

                return {
                    idVenta: venta.idVenta,
                    fecha: venta.fechaVenta,
                    total: venta.total,
                    nombreCliente: cliente ? cliente.nombreCliente : 'Desconocido',
                    correoCliente: cliente ? cliente.correoCliente : '—'
                };
            }).filter(item => item !== null); 

            setMisRegistros(registrosProcesados);
            setLoading(false);

        }).catch(error => {
            console.error("Error al cargar mis ventas:", error);
            setLoading(false);
        });

    }, [user]);

    if (loading) return <div className="container"><h2 className="title">Cargando tus registros...</h2></div>;

    return (
        <div className="container">
            <h2 className="title">
                Mis Clientes Atendidos
                {empleadoInfo && <small style={{display:'block', fontSize:'1rem', color:'#666'}}>Mesero: {empleadoInfo.nombre}</small>}
            </h2>

            {misRegistros.length === 0 ? (
                <div className="alert alert-info text-center">
                    Aún no has atendido ninguna venta.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th><FaUserCheck /> Cliente</th>
                                <th>Correo</th>
                                <th><FaCalendarDay /> Fecha</th>
                                <th><FaMoneyBillWave /> Total</th>
                                <th>ID</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {misRegistros.map(registro => (
                                <tr key={registro.idVenta}>
                                    <td style={{fontWeight: 'bold'}}>{registro.nombreCliente}</td>
                                    <td>{registro.correoCliente}</td>
                                    <td>{new Date(registro.fecha).toLocaleString()}</td>
                                    <td >
                                        ${parseFloat(registro.total).toFixed(2)}
                                    </td>
                                    <td>#{registro.idVenta}</td>
                                    <td>
                                        <div className="actions" style={{justifyContent: 'flex-start', gap: '0.5rem'}}>
                                            
                                            <button 
                                                className="btn btn-edit" 
                                                onClick={() => handleEdit(registro.idVenta)}
                                                title="Editar Venta"
                                                style={{padding: '0.4rem 0.8rem', fontSize: '0.9rem'}}
                                            >
                                                <FaEdit /> 
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Renderizado del Modal */}
            {selectedVentaId && (
                <DetalleVentaComponent
                    show={showModal}
                    handleClose={handleCloseModal}
                    ventaId={selectedVentaId}
                />
            )}
        </div>
    );
};