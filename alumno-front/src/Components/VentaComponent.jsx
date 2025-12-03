import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { crearVenta, getVentaById, updateVenta } from '../services/VentaService';
import { listClientes } from '../services/ClienteService';
import { listarProductos } from '../services/ProductoService';
import { listarEmpleados } from '../services/EmpleadoService';
import { crearAtencion, listarAtenciones } from '../services/AtenderService'; // Assuming listarAtenciones exists
import { FaPlus, FaTrash, FaShoppingCart, FaUserTie } from 'react-icons/fa';

export const VentaComponent = () => {
    const navegar = useNavigate();
    const location = useLocation();
    const { idVenta } = useParams(); // Get idVenta from URL if editing

    // --- Form States ---
    const [idCliente, setIdCliente] = useState('');
    const [idReserva, setIdReserva] = useState(null);
    const [idEmpleado, setIdEmpleado] = useState('');
    const [detalles, setDetalles] = useState([]); // Shopping cart
    const [total, setTotal] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state for initial data

    // --- Dropdown Data States ---
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    
    // --- Add Product Form States ---
    const [productoSeleccionadoId, setProductoSeleccionadoId] = useState('');
    const [cantidad, setCantidad] = useState(1);

    // Effect to load initial data and handle editing mode
    useEffect(() => {
        setLoading(true);
        // Load lists for dropdowns
        const loadLists = Promise.all([
            listClientes(),
            listarProductos(),
            listarEmpleados(),
        ]).then(([clientesRes, productosRes, empleadosRes]) => {
            setClientes(clientesRes.data);
            setProductos(productosRes.data);
            setEmpleados(empleadosRes.data);
            return { productos: productosRes.data }; // Pass products for later use
        });

        // If idVenta exists, we are in EDIT mode
        if (idVenta) {
            // Wait for lists to load, then fetch the specific venta data
            loadLists.then(({ productos }) => {
                Promise.all([
                    getVentaById(idVenta),
                    listarAtenciones() // Need attendances to find the employee
                ]).then(([ventaRes, atencionesRes]) => {
                    const venta = ventaRes.data;
                    const atenciones = atencionesRes.data;

                    // Populate form fields
                    setIdCliente(venta.idCliente.toString());
                    setIdReserva(venta.idReserva);
                    
                    // Find the employee who attended this sale
                    const atencion = atenciones.find(a => a.idVenta === venta.idVenta);
                    if (atencion) {
                        setIdEmpleado(atencion.idEmpleado.toString());
                    }

                    // Enrich details with product names for the cart display
                    const productoMap = new Map(productos.map(p => [p.id_producto, p.nombreProducto]));
                    const detallesEnriquecidos = venta.detalles.map(d => ({
                        idProducto: d.idProducto, // Ensure correct field names
                        cantidad: d.cantidad,
                        precioUnitario: d.precioUnitario,
                        nombreProducto: productoMap.get(d.idProducto) || 'Producto Desconocido' // Display name
                    }));
                    setDetalles(detallesEnriquecidos);

                }).catch(error => console.error("Error al cargar datos para edición:", error))
                  .finally(() => setLoading(false)); // Finish loading (success or error)
            
            }).catch(error => {
                 console.error("Error al cargar listas iniciales:", error);
                 setLoading(false); // Finish loading if lists fail
            });
        } else { // CREATE mode
            // If navigating from reserva, pre-fill client and reserva ID
            if (location.state?.idCliente) {
                setIdCliente(location.state.idCliente.toString());
            }
            if (location.state?.idReserva) {
                setIdReserva(location.state.idReserva);
            }
            // Finish loading after lists are fetched
            loadLists.finally(() => setLoading(false));
        }

    }, [idVenta, location.state]); // Dependencies for the effect

    // Effect to recalculate total whenever 'detalles' changes
    useEffect(() => {
        const nuevoTotal = detalles.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
        setTotal(nuevoTotal);
    }, [detalles]);

    // Function to add a product to the cart
    const handleAgregarProducto = () => {
        if (!productoSeleccionadoId || cantidad <= 0) {
            alert("Selecciona un producto y una cantidad válida.");
            return;
        }
        const productoExistenteIndex = detalles.findIndex(d => d.idProducto === parseInt(productoSeleccionadoId));

        if (productoExistenteIndex > -1) { // If product exists, update quantity
            const nuevosDetalles = [...detalles];
            nuevosDetalles[productoExistenteIndex].cantidad += parseInt(cantidad);
            setDetalles(nuevosDetalles);
        } else { // If new product, add it
            const producto = productos.find(p => p.id_producto === parseInt(productoSeleccionadoId));
            if (!producto) {
                alert("Producto no encontrado.");
                return;
            }
            const nuevoDetalle = {
                idProducto: producto.id_producto,
                nombreProducto: producto.nombreProducto, // For display
                cantidad: parseInt(cantidad),
                precioUnitario: producto.precioProducto,
            };
            setDetalles([...detalles, nuevoDetalle]);
        }
        // Reset add product form
        setProductoSeleccionadoId('');
        setCantidad(1);
    };

    // Function to remove a product from the cart
    const handleEliminarProducto = (index) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles.splice(index, 1);
        setDetalles(nuevosDetalles);
    };

    // Function to save (create or update) the venta
    const handleSaveOrUpdateVenta = () => {
        if (!idCliente || detalles.length === 0 || !idEmpleado) {
            alert("Selecciona un cliente, un empleado y agrega al menos un producto.");
            return;
        }
        setIsSubmitting(true);

        // Prepare Venta DTO for backend
        const ventaDto = {
            idCliente: parseInt(idCliente),
            idReserva: idReserva,
            detalles: detalles.map(d => ({ // Send only necessary data
                idProducto: d.idProducto,
                cantidad: d.cantidad,
                precioUnitario: d.precioUnitario
            })) 
        };

        const atencionData = { idEmpleado: parseInt(idEmpleado) }; // Prepare Atender data

        if (idVenta) { // EDIT Mode
            updateVenta(idVenta, ventaDto).then(() => {
                // Ideally, backend should handle updating 'Atender' if employee changes.
                // For simplicity now, we assume the original 'Atender' record might stay
                // or you might need a separate mechanism to update it.
                alert("Venta actualizada con éxito ✅");
                navegar('/historial-ventas');
            }).catch(error => {
                console.error("Error al actualizar la venta:", error);
                alert("Error al actualizar la venta.");
            }).finally(() => setIsSubmitting(false)); // Re-enable button

        } else { // CREATE Mode
            // Step 1: Save Venta
            crearVenta(ventaDto).then((ventaResponse) => {
                const ventaGuardada = ventaResponse.data;
                console.log("Venta guardada:", ventaGuardada);

                // Step 2: Save Atender record using the new venta ID
                crearAtencion({ ...atencionData, idVenta: ventaGuardada.idVenta }).then(() => {
                    console.log("Registro de atención guardado.");
                    alert("Venta y atención registradas con éxito ✅");
                    navegar('/historial-ventas');
                }).catch(atencionError => {
                    console.error("Error al registrar la atención:", atencionError);
                    alert("Venta registrada, pero hubo un error al asignar el empleado.");
                    navegar('/historial-ventas'); // Navigate anyway
                });

            }).catch(ventaError => {
                console.error("Error al registrar la venta:", ventaError);
                alert("Error al registrar la venta.");
                setIsSubmitting(false); // Re-enable button on failure
            });
        }
    };

    // Show loading message while fetching initial data
    if (loading) {
        return <div className="container"><h2 className="title">Cargando datos...</h2></div>;
    }

    // --- JSX Render ---
    return (
        <div className="container">
            {/* Dynamic Title */}
            <h2 className="title">{idVenta ? `Editando Venta #${idVenta}` : 'Registrar Nueva Venta'}</h2>
            
            {/* --- Client and Employee Section --- */}
            <div className='form-grid'>
                <div className="form-group">
                    <label>Cliente</label>
                    <select 
                        className="form-control" 
                        value={idCliente} 
                        onChange={(e) => setIdCliente(e.target.value)} 
                        required
                        disabled={!!location.state?.idCliente || !!idVenta} // Disable if editing or coming from reserva
                    >
                        <option value="">-- Selecciona un cliente --</option>
                        {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombreCliente}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label><FaUserTie /> Empleado que atiende</label>
                    <select 
                        className="form-control" 
                        value={idEmpleado} 
                        onChange={(e) => setIdEmpleado(e.target.value)} 
                        required
                    >
                        <option value="">-- Selecciona un mesero --</option>
                        {/* 👇 AQUÍ AGREGAMOS EL FILTRO 👇 */}
                        {empleados
                            .filter(emp => emp.puesto === 'MESERO') // Solo mostramos Meseros
                            .map(emp => (
                                <option key={emp.idEmpleado} value={emp.idEmpleado}>
                                    {emp.nombre}
                                </option>
                            ))
                        }
                    </select>
                </div>
            </div>

            {/* Display Reserva ID if present */}
            {idReserva && <p style={{marginTop: '1rem', fontStyle: 'italic', textAlign: 'center'}}>Venta asociada a la reserva ID: {idReserva}</p>}

            <hr />

            {/* --- Add Products Section --- */}
            <h3 className="title" style={{fontSize: '1.5rem'}}>Agregar Productos al Carrito</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Producto</label>
                    <select className="form-control" value={productoSeleccionadoId} onChange={(e) => setProductoSeleccionadoId(e.target.value)}>
                        <option value="">-- Selecciona un producto --</option>
                        {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombreProducto} (${p.precioProducto.toFixed(2)})</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Cantidad</label>
                    <input type="number" className="form-control" value={cantidad} onChange={(e) => setCantidad(e.target.value)} min="1" />
                </div>
                <div className="actions" style={{justifyContent: 'flex-start', alignSelf: 'end'}}>
                    <button type="button" className="btn btn-save" onClick={handleAgregarProducto}><FaPlus /> Agregar</button>
                </div>
            </div>

            <hr />

            {/* --- Cart Details Table --- */}
            <h3 className="title" style={{fontSize: '1.5rem'}}><FaShoppingCart /> Carrito de Compra</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
               <tbody>
    {detalles.map((item, index) => (
        <tr key={index}>
            <td>{item.nombreProducto}</td>
            <td>{item.cantidad}</td>
            <td>${item.precioUnitario.toFixed(2)}</td>
            <td>${(item.cantidad * item.precioUnitario).toFixed(2)}</td>
            <td>
                <button className="btn btn-delete" onClick={() => handleEliminarProducto(index)}>
                    <FaTrash />
                </button>
            </td>
        </tr>
    ))}
</tbody>
            </table>

            {/* --- Total and Save Button --- */}
            <div style={{textAlign: 'right', fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0'}}>
                Total: ${total.toFixed(2)}
            </div>
            <div className="actions">
                <button 
                    type="button" 
                    className="btn btn-save" 
                    onClick={handleSaveOrUpdateVenta}
                    disabled={isSubmitting} // Disable button while processing
                >
                    {isSubmitting ? 'Guardando...' : (idVenta ? 'Actualizar Venta' : 'Finalizar Venta')}
                </button>
                <button type="button" className="btn btn-cancel" onClick={() => navegar('/historial-ventas')}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};