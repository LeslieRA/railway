import React, { useEffect, useState, useMemo } from 'react'; // 1. Importa useMemo
import { listClientes, deleteCliente } from '../services/ClienteService'; 
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const ListClienteComponent = () => {
    const [clientes, setClientes] = useState([]);
    // 2. Añade un estado para el término de búsqueda
    const [filtroNombre, setFiltroNombre] = useState(''); 
    const navegar = useNavigate();

    function getAllClientes(){
        listClientes().then(response => {
            setClientes(response.data);
        }).catch(error => {
            console.error(error);
        });
    }

    useEffect(() => {
        getAllClientes();
    }, []);

    function handleEdit(id_cliente) {
        navegar(`/editar-cliente/${id_cliente}`);
    }

    function handleDelete(id_cliente) {
        if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
            deleteCliente(id_cliente).then(() => {
                console.log(`Cliente con ID: ${id_cliente} ha sido eliminado exitosamente.`);
                getAllClientes(); 
            }).catch(error => {
                console.error("Error al eliminar el cliente:", error);
            });
        }
    }

    // 3. Crea una lista filtrada usando useMemo
    // Esto es más eficiente que filtrar en cada renderizado
    const clientesFiltrados = useMemo(() => {
        if (!filtroNombre) {
            return clientes; // Si no hay filtro, muestra todos
        }
        return clientes.filter(cliente =>
            cliente.nombreCliente.toLowerCase().includes(filtroNombre.toLowerCase())
        );
    }, [clientes, filtroNombre]); // Se recalcula solo si 'clientes' o 'filtroNombre' cambian

    return (
        <div className="container">
            <h2 className="title">Nuestros Clientes</h2>

            {/* --- 4. AÑADE EL INPUT DEL BUSCADOR --- */}
            <div className="form-group" style={{maxWidth: '800px', margin: '0 auto 2rem auto'}}>
                <input 
                    type="text"
                    className="form-control"
                    placeholder="Buscar cliente por nombre o letra..."
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                />
            </div>
            {/* --- FIN DEL BUSCADOR --- */}

            <table className="table">
                <thead>
                    <tr>
                        <th>Id Cliente</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {/* 5. Mapea la lista FILTRADA, no la original */}
                    {clientesFiltrados.length > 0 ? (
                        clientesFiltrados.map(cliente => (
                            <tr key={cliente.id_cliente}>
                                <td>{cliente.id_cliente}</td>
                                <td>{cliente.nombreCliente}</td>
                                <td>{cliente.correoCliente}</td>
                                <td>{cliente.telefonoCliente}</td>
                                <td>
                                    <div className="actions">
                                        <button className="btn btn-edit" onClick={() => handleEdit(cliente.id_cliente)}>
                                            <FaEdit /> Editar
                                        </button>
                                        <button className="btn btn-delete" onClick={() => handleDelete(cliente.id_cliente)}>
                                            <FaTrash /> Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        // Mensaje si no hay resultados
                        <tr>
                            <td colSpan="5" style={{textAlign: 'center'}}>No se encontraron clientes con ese nombre.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};