import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getVentaById, updateVenta } from '../services/VentaService';
import { listClientes } from '../services/ClienteService';
import { listarProductos } from '../services/ProductoService';
import { listarEmpleados } from '../services/EmpleadoService';
import { FaPlus, FaTrash, FaShoppingCart, FaUserTie, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; 

export const EditarVentaMeseroComponent = () => {
    const navigate = useNavigate();
    const { idVenta } = useParams(); // Obtenemos el ID de la URL
    const { user } = useAuth(); // Obtenemos al usuario logueado (el mesero)

    // --- Estados ---
    const [idCliente, setIdCliente] = useState('');
    const [idReserva, setIdReserva] = useState(null);
    const [idEmpleado, setIdEmpleado] = useState(''); 
    const [detalles, setDetalles] = useState([]);
    const [total, setTotal] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // --- Listas ---
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    
    // --- Formulario Producto ---
    const [productoSeleccionadoId, setProductoSeleccionadoId] = useState('');
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        setLoading(true);
        
        // 1. Cargar todas las listas necesarias
        const loadLists = Promise.all([
            listClientes(),
            listarProductos(),
            listarEmpleados(),
        ]).then(([clientesRes, productosRes, empleadosRes]) => {
            setClientes(clientesRes.data);
            setProductos(productosRes.data);
            const listaEmpleados = empleadosRes.data;
            setEmpleados(listaEmpleados);
            
            // 2. Auto-seleccionar al mesero actual en el dropdown
            if (user?.username) {
                const miEmpleado = listaEmpleados.find(e => e.username === user.username);
                if (miEmpleado) {
                    setIdEmpleado(miEmpleado.idEmpleado);
                }
            }
            return { productos: productosRes.data };
        });

        // 3. Cargar los datos de la venta a editar
        if (idVenta) {
            loadLists.then(({ productos }) => {
                getVentaById(idVenta).then((ventaRes) => {
                    const venta = ventaRes.data;

                    setIdCliente(venta.idCliente.toString());
                    setIdReserva(venta.idReserva);

                    // Mapear nombres de productos para que se vean en la tabla
                    const productoMap = new Map(productos.map(p => [p.id_producto, p.nombreProducto]));
                    
                    const detallesEnriquecidos = venta.detalles.map(d => ({
                        idProducto: d.idProducto,
                        cantidad: d.cantidad,
                        precioUnitario: d.precioUnitario,
                        nombreProducto: productoMap.get(d.idProducto) || 'Producto Desconocido'
                    }));
                    setDetalles(detallesEnriquecidos);

                }).catch(error => console.error("Error al cargar venta:", error))
                  .finally(() => setLoading(false));
            });
        }
    }, [idVenta, user]);

    // Calcular Total
    useEffect(() => {
        const nuevoTotal = detalles.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
        setTotal(nuevoTotal);
    }, [detalles]);

    // --- Handlers de Productos (Igual que VentaComponent) ---
    const handleAgregarProducto = () => {
        if (!productoSeleccionadoId || cantidad <= 0) {
            alert("Selecciona un producto y cantidad válida."); return;
        }
        const productoExistenteIndex = detalles.findIndex(d => d.idProducto === parseInt(productoSeleccionadoId));

        if (productoExistenteIndex > -1) {
            const nuevosDetalles = [...detalles];
            nuevosDetalles[productoExistenteIndex].cantidad += parseInt(cantidad);
            setDetalles(nuevosDetalles);
        } else {
            const producto = productos.find(p => p.id_producto === parseInt(productoSeleccionadoId));
            if (!producto) return;
            const nuevoDetalle = {
                idProducto: producto.id_producto,
                nombreProducto: producto.nombreProducto,
                cantidad: parseInt(cantidad),
                precioUnitario: producto.precioProducto,
            };
            setDetalles([...detalles, nuevoDetalle]);
        }
        setProductoSeleccionadoId('');
        setCantidad(1);
    };

    const handleEliminarProducto = (index) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles.splice(index, 1);
        setDetalles(nuevosDetalles);
    };

    // --- Guardar Cambios ---
    const handleUpdateVenta = () => {
        if (!idCliente || detalles.length === 0) {
            alert("Faltan datos (Cliente o Productos)."); return;
        }
        setIsSubmitting(true);

        const ventaDto = {
            idCliente: parseInt(idCliente),
            idReserva: idReserva,
            detalles: detalles.map(d => ({
                idProducto: d.idProducto,
                cantidad: d.cantidad,
                precioUnitario: d.precioUnitario
            })) 
        };
        
        // Solo actualizamos la venta. No tocamos la tabla 'atender' 
        // porque asumimos que el mesero que edita es el mismo que atendió.
        updateVenta(idVenta, ventaDto).then(() => {
            alert("Venta actualizada correctamente ✅");
            navigate('/mis-ventas'); // <-- REDIRECCIÓN CLAVE
        }).catch(error => {
            console.error("Error al actualizar:", error);
            alert("Error al guardar cambios.");
        }).finally(() => setIsSubmitting(false));
    };

    if (loading) return <div className="container"><h2 className="title">Cargando datos...</h2></div>;

    return (
        <div className="container">
            <h2 className="title">Editar Venta #{idVenta}</h2>
            
            <div className='form-grid'>
                {/* Cliente */}
                <div className="form-group">
                    <label>Cliente</label>
                    <select 
                        className="form-control" 
                        value={idCliente} 
                        onChange={(e) => setIdCliente(e.target.value)} 
                        required
                    >
                        <option value="">-- Selecciona un cliente --</option>
                        {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombreCliente}</option>)}
                    </select>
                </div>

                {/* Empleado (BLOQUEADO) */}
                <div className="form-group">
                    <label><FaUserTie /> Atendido por (Tú)</label>
                    <select 
                        className="form-control" 
                        value={idEmpleado} 
                        disabled // <-- Bloqueado para que no se asigne a otro
                        style={{backgroundColor: '#e9ecef', cursor: 'not-allowed'}}
                    >
                        {empleados.map(emp => <option key={emp.idEmpleado} value={emp.idEmpleado}>{emp.nombre}</option>)}
                    </select>
                </div>
            </div>

            <hr />

            {/* --- Sección Productos --- */}
            <h3 className="title" style={{fontSize: '1.5rem'}}>Productos</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Producto</label>
                    <select className="form-control" value={productoSeleccionadoId} onChange={(e) => setProductoSeleccionadoId(e.target.value)}>
                        <option value="">-- Selecciona --</option>
                        {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombreProducto} (${p.precioProducto})</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Cant.</label>
                    <input type="number" className="form-control" value={cantidad} onChange={(e) => setCantidad(e.target.value)} min="1" />
                </div>
                <div className="actions" style={{justifyContent: 'flex-start', alignSelf: 'end'}}>
                    <button type="button" className="btn btn-save" onClick={handleAgregarProducto}><FaPlus /> Agregar</button>
                </div>
            </div>

            {/* Tabla Carrito */}
            <table className="table mt-3">
                <thead>
                    <tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th><th>Acción</th></tr>
                </thead>
                <tbody>
                    {detalles.map((item, index) => (
                        <tr key={index}>
                            <td>{item.nombreProducto}</td>
                            <td>{item.cantidad}</td>
                            <td>${item.precioUnitario.toFixed(2)}</td>
                            <td>${(item.cantidad * item.precioUnitario).toFixed(2)}</td>
                            <td>
                                <button className="btn btn-delete" onClick={() => handleEliminarProducto(index)}><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{textAlign: 'right', fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0'}}>
                Total: ${total.toFixed(2)}
            </div>

            <div className="actions">
                <button type="button" className="btn btn-save" onClick={handleUpdateVenta} disabled={isSubmitting}>
                    <FaSave /> Guardar Cambios
                </button>
                <button type="button" className="btn btn-cancel" onClick={() => navigate('/mis-ventas')}>
                    <FaTimes /> Cancelar
                </button>
            </div>
        </div>
    );
};