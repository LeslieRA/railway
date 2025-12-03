import React, { useState, useEffect, useMemo } from 'react';
import { listarProductos } from '../services/ProductoService';
import { listarTipos } from '../services/TipoService';
import { FaPlusCircle } from 'react-icons/fa'; // Icono para "Agregar"

export const MenuComponent = () => {
    const [productos, setProductos] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroTipo, setFiltroTipo] = useState(null);
    
    // --- 👇 1. Estados para los filtros de precio Min/Max ---
    const [filtroPrecioMin, setFiltroPrecioMin] = useState('');
    const [filtroPrecioMax, setFiltroPrecioMax] = useState('');

    const tipoMap = useMemo(() => {
        return new Map(tipos.map(t => [t.id_tipo, t.tipo]));
    }, [tipos]);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            listarProductos(),
            listarTipos()
        ]).then(([productosRes, tiposRes]) => {
            setProductos(productosRes.data);
            setTipos(tiposRes.data);
        }).catch(error => console.error("Error al cargar el menú:", error))
          .finally(() => setLoading(false));
    }, []); // La carga inicial ya no depende del precio

    const productosFiltrados = useMemo(() => {
        // --- 2. Lógica de filtrado Min/Max ---
        const min = parseFloat(filtroPrecioMin);
        const max = parseFloat(filtroPrecioMax);

        return productos.filter(producto => {
            if (filtroTipo && producto.tipo.id_tipo !== filtroTipo) return false;
            if (filtroNombre && !producto.nombreProducto.toLowerCase().includes(filtroNombre.toLowerCase())) return false;
            
            // Si hay un 'min' y el precio es menor, no lo muestres
            if (!isNaN(min) && producto.precioProducto < min) {
                return false;
            }
            // Si hay un 'max' y el precio es mayor, no lo muestres
            if (!isNaN(max) && producto.precioProducto > max) {
                return false;
            }

            if (!producto.estado) return false; // Solo productos activos
            return true;
        });
    }, [productos, filtroNombre, filtroTipo, filtroPrecioMin, filtroPrecioMax]); // <-- Depende de los nuevos estados

    const handleAddToCart = (producto) => {
        alert(`Producto "${producto.nombreProducto}" añadido al carrito! (ID: ${producto.id_producto})`);
    };

    return (
        <div className="container">
            <h2 className="title">Nuestro Menú</h2>

            <div className="menu-filters">
                {/* --- Filtro por Nombre --- */}
                <div className="form-group">
                    <label>Buscar por nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ej: Latte, Pastel..."
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                </div>

                {/* --- 3. Filtros Min/Max (Reemplazan el slider y los botones) --- */}
                <div className="form-group">
                    <label>Precio Mínimo ($)</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Min"
                        value={filtroPrecioMin}
                        onChange={(e) => setFiltroPrecioMin(e.target.value)}
                        min="0"
                    />
                </div>
                <div className="form-group">
                    <label>Precio Máximo ($)</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Max"
                        value={filtroPrecioMax}
                        onChange={(e) => setFiltroPrecioMax(e.target.value)}
                        min="0"
                    />
                </div>
                {/* --- Fin del cambio --- */}

                {/* --- Filtro por Tipo (Categorías) --- */}
                <div className="type-buttons">
                    <button 
                        className={filtroTipo === null ? 'active' : ''}
                        onClick={() => setFiltroTipo(null)}
                    >
                        Todos
                    </button>
                    {tipos.map(tipo => (
                        <button
                            key={tipo.id_tipo}
                            className={filtroTipo === tipo.id_tipo ? 'active' : ''}
                            onClick={() => setFiltroTipo(tipo.id_tipo)}
                        >
                            {tipo.tipo}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Cuadrícula de Productos (sin cambios) --- */}
            <div className="product-grid">
                {loading && <p>Cargando menú...</p>}
                
                {!loading && productosFiltrados.length === 0 && (
                    <p className="no-results">No se encontraron productos que coincidan con su búsqueda.</p>
                )}

                {!loading && productosFiltrados.map(producto => (
                    <div className="product-card" key={producto.id_producto}>
                        
                        {producto.imagenRuta ? (
                                    <img
                                        // 2. Usa backticks (`) para crear el string de la URL
                                        src={`http://localhost:7073/api/files/${producto.imagenRuta}`}
                                        alt={producto.nombreProducto}
                                        style={{
                                            width: '100%', // Ocupa el 100% del ancho de la tarjeta
                                            height: '200px', // Altura fija para todas las imágenes
                                            borderRadius: '0', // Se quita el borde redondeado si lo tenía
                                            objectFit: 'cover' // Asegura que la imagen cubra el espacio
                                        }}
                                    />
                                ) : (
                                    <span style={{fontSize: '10px', color: '#888'}}>Sin imagen</span>
                                )}
                        
                        <div className="product-card-body">
                            <h4>{producto.nombreProducto}</h4>
                            <p className="price">${parseFloat(producto.precioProducto).toFixed(2)}</p>
                            <p className="product-type">{tipoMap.get(producto.tipo.id_tipo) || 'Sin tipo'}</p>
                            
                            <div className="product-card-footer">
                                <span 
                                    className={`product-status ${producto.estado ? 'active-status' : 'inactive-status'}`}
                                >
                                    {producto.estado ? 'Activo' : 'Inactivo'}
                                </span>
                                
                                
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};