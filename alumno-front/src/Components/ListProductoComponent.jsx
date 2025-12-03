import React, { useEffect, useState } from 'react';
import { listarTodosLosProductos, updateProducto } from '../services/ProductoService'; 
import { FaEdit, FaBan, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const ListProductoComponent = () => {
    const [productos, setProductos] = useState([]);
    const navegar = useNavigate();

    // Función para obtener todos los productos (activos e inactivos)
    function getAllProductos() {
        listarTodosLosProductos().then(response => {
            setProductos(response.data);
        }).catch(error => {
            console.error("Error al obtener todos los productos:", error);
        });
    }

    useEffect(() => {
        getAllProductos();
    }, []);

    // Navega al formulario de edición
    function handleEdit(id_producto) {
        navegar(`/editar-producto/${id_producto}`);
    }

    // Función para alternar el estado (activo/inactivo)
    function handleToggleEstado(productoAActualizar) {
        const productoActualizado = {
            ...productoAActualizar,
            estado: !productoAActualizar.estado 
        };

        // Llama al servicio de 'update' que solo envía JSON
        updateProducto(productoAActualizar.id_producto, productoActualizado)
            .then(() => {
                console.log(`Estado del producto ID ${productoAActualizar.id_producto} cambiado.`);
                setProductos(productos.map(p => 
                    p.id_producto === productoAActualizar.id_producto ? productoActualizado : p
                ));
            })
            .catch(error => {
                console.error("Error al actualizar el estado del producto:", error);
            });
    }

    return (
        <div className="container">
            <h2 className="title">Gestión de Productos</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(producto => (
                        <tr key={producto.id_producto} className={producto.estado ? '' : 'product-suspended'}>
                            
                            {/* --- 👇 CELDA CORREGIDA 👇 --- */}
                            <td>
                                {/* 1. Usa 'producto.imagenRuta' (camelCase para coincidir con el DTO de Java) */}
                                {producto.imagenRuta ? (
                                    <img
                                        // 2. Usa backticks (`) para crear el string de la URL
                                        src={`http://localhost:7073/api/files/${producto.imagenRuta}`}
                                        alt={producto.nombreProducto}
                                        style={{
                                            width: '60px', 
                                            height: '60px', 
                                            borderRadius: '8px', 
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <span style={{fontSize: '10px', color: '#888'}}>Sin imagen</span>
                                )}
                            </td>
                            
                            <td>{producto.id_producto}</td>
                            <td>{producto.nombreProducto}</td>
                            <td>{producto.descripcionProducto}</td>
                            <td>${parseFloat(producto.precioProducto).toFixed(2)}</td>
                            <td>{producto.tipo?.tipo}</td>
                            <td>
                                <div className="actions">
                                    <button className="btn btn-edit" onClick={() => handleEdit(producto.id_producto)}>
                                        <FaEdit /> Editar
                                    </button>
                                    
                                    <button 
                                        className={`btn ${producto.estado ? 'btn-delete' : 'btn-activate'}`}
                                        onClick={() => handleToggleEstado(producto)}
                                    >
                                        {producto.estado ? 
                                            <><FaBan /> Suspender</> : 
                                            <><FaCheckCircle /> Activar</>
                                        }
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};