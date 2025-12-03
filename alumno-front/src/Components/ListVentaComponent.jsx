import React, { useEffect, useState, useMemo } from 'react';
import { listarVentas, deleteVenta, generarTicketPdf } from '../services/VentaService'; 
import { listClientes } from '../services/ClienteService';
import { listarEmpleados } from '../services/EmpleadoService';
import { listarAtenciones } from '../services/AtenderService';
// Importamos todos los iconos, incluyendo FaTimes para el botón de limpiar
import { FaEye, FaEdit, FaTrash, FaPrint, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const ListVentaComponent = () => {
    const [ventasEnriquecidas, setVentasEnriquecidas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navegar = useNavigate();

    // --- ESTADO PARA EL FILTRO DE FECHA ---
    const [filtroFecha, setFiltroFecha] = useState('');

    const cargarDatos = () => {
        setLoading(true);
        Promise.all([
            listarVentas(),
            listClientes(),
            listarEmpleados(),
            listarAtenciones()
        ]).then(([ventasRes, clientesRes, empleadosRes, atencionesRes]) => {
            const ventas = ventasRes.data;
            const clientes = clientesRes.data;
            const empleados = empleadosRes.data;
            const atenciones = atencionesRes.data;

            const clienteMap = new Map(clientes.map(c => [c.id_cliente, c.nombreCliente]));
            const empleadoMap = new Map(empleados.map(e => [e.idEmpleado, e.nombre]));
            const atencionMap = new Map(atenciones.map(a => [a.idVenta, a.idEmpleado]));

            const enriquecidas = ventas.map(venta => {
                const idEmpleado = atencionMap.get(venta.idVenta);
                return {
                    ...venta,
                    nombreCliente: clienteMap.get(venta.idCliente) || 'N/A',
                    nombreEmpleado: empleadoMap.get(idEmpleado) || 'N/A'
                };
            });

            setVentasEnriquecidas(enriquecidas);
        }).catch(error => console.error("Error al cargar datos enriquecidos:", error))
          .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // --- LÓGICA DE FILTRADO (Por fecha exacta) ---
    const ventasFiltradas = useMemo(() => {
        return ventasEnriquecidas.filter(venta => {
            // Si no hay fecha seleccionada, muestra todo
            if (!filtroFecha) {
                return true; 
            }
            // Extrae solo la fecha (YYYY-MM-DD) de la fecha completa de la venta
            const fechaVenta = venta.fechaVenta.split('T')[0];
            return fechaVenta === filtroFecha;
        });
    }, [ventasEnriquecidas, filtroFecha]);

    // --- HANDLERS ---

    const handleEdit = (idVenta) => {
        navegar(`/editar-venta/${idVenta}`);
    };

    const handleDelete = (idVenta) => {
        if (window.confirm("¿Estás seguro de eliminar esta venta? Esta acción es permanente.")) {
            deleteVenta(idVenta).then(() => {
                alert("Venta eliminada con éxito.");
                cargarDatos();
            }).catch(error => console.error("Error al eliminar la venta:", error));
        }
    };
    
    const verDetalles = (idVenta) => navegar(`/venta-detalles/${idVenta}`);

    const handleImprimirTicket = (idVenta) => {
        console.log("Generando ticket para venta ID:", idVenta);
        generarTicketPdf(idVenta)
            .then((response) => {
                // Crea y abre el PDF en una nueva pestaña
                const file = new Blob([response.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL, '_blank');
            })
            .catch((error) => {
                console.error("Error al generar el ticket:", error);
                if (error.response && error.response.status === 403) {
                    alert("No tienes permisos para imprimir este ticket.");
                } else {
                    alert("Error al generar el PDF. Intenta de nuevo.");
                }
            });
    };

    if (loading) { return <div className="container"><h2 className="title">Cargando historial...</h2></div>; }

    return (
        <div className="container">
            <h2 className="title">Historial de Ventas</h2>

            {/* --- BARRA DE FILTROS --- */}
            <div className="form-group" style={{maxWidth: '350px', marginBottom: '2rem'}}>
                <label>Buscar por Fecha Exacta</label>
                <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                    <input
                        type="date"
                        className="form-control"
                        value={filtroFecha}
                        onChange={(e) => setFiltroFecha(e.target.value)}
                    />
                    {/* Botón para limpiar el filtro (X) - Solo se muestra si hay fecha */}
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

            {/* --- TABLA DE VENTAS --- */}
            <table className="table">
                <thead>
                    <tr>
                        <th>ID Venta</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Atendido por</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventasFiltradas.length > 0 ? (
                        ventasFiltradas.map(venta => (
                            <tr key={venta.idVenta}>
                                <td>{venta.idVenta}</td>
                                <td>{new Date(venta.fechaVenta).toLocaleString()}</td>
                                <td>{venta.nombreCliente}</td>
                                <td>{venta.nombreEmpleado}</td>
                                <td>${parseFloat(venta.total).toFixed(2)}</td>
                                <td>
                                    <div className="actions" style={{justifyContent: 'flex-start', gap: '0.5rem'}}>
                                        <button title="Ver Detalles" className="btn btn-edit" onClick={() => verDetalles(venta.idVenta)}>
                                            <FaEye />
                                        </button>
                                        <button title="Editar Venta" className="btn btn-edit" onClick={() => handleEdit(venta.idVenta)}>
                                            <FaEdit />
                                        </button>
                                        <button title="Eliminar Venta" className="btn btn-delete" onClick={() => handleDelete(venta.idVenta)}>
                                            <FaTrash />
                                        </button>
                                        <button 
                                            title="Imprimir Ticket" 
                                            className="btn btn-save" 
                                            style={{backgroundColor: '#17a2b8'}}
                                            onClick={() => handleImprimirTicket(venta.idVenta)}
                                        >
                                            <FaPrint />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        // Mensaje cuando no hay resultados
                        <tr>
                            <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>
                                {filtroFecha 
                                    ? 'No se encontraron ventas para la fecha seleccionada.' 
                                    : 'No hay ventas registradas en el sistema.'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};