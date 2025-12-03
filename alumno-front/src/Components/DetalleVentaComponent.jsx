import React, { useEffect, useState } from 'react';
import { getVentaById } from '../services/VentaService'; 
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export const DetalleVentaComponent = () => {
    const [venta, setVenta] = useState(null);
    const { idVenta } = useParams();
    const navegar = useNavigate();

    useEffect(() => {
        if (idVenta) {
            getVentaById(idVenta).then(response => {
                setVenta(response.data);
            }).catch(error => console.error(error));
        }
    }, [idVenta]);

    if (!venta) {
        return <div className="container"><h2 className="title">Cargando detalles...</h2></div>;
    }

    return (
        <div className="container">
            <h2 className="title">Detalles de la Venta #{venta.idVenta}</h2>
            
            <div className="form-grid" style={{marginBottom: '2rem'}}>
                <div><strong>Fecha:</strong> {new Date(venta.fechaVenta).toLocaleString()}</div>
                <div><strong>Cliente ID:</strong> {venta.idCliente}</div>
                <div style={{fontWeight: 'bold'}}><strong>Total:</strong> ${parseFloat(venta.total).toFixed(2)}</div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>ID Producto</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
            {venta.detalles.map(detalle => (
        <tr key={detalle.idDetalle}>
            <td>{detalle.idProducto}</td>
            <td>{detalle.nombreProducto}</td>
            <td>{detalle.cantidad}</td>
            <td>${parseFloat(detalle.precioUnitario).toFixed(2)}</td>
            <td>${(detalle.cantidad * detalle.precioUnitario).toFixed(2)}</td>
        </tr>
    ))}
</tbody>
            </table>

            
        </div>
    );
};