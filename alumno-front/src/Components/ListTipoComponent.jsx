import React, { useEffect, useState } from 'react';
import { listarTipos, deleteTipo } from '../services/TipoService'; 
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const ListTipoComponent = () => {
    const [tipos, setTipos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        cargarTipos();
    }, []);

    function cargarTipos() {
        listarTipos().then(response => {
            setTipos(response.data);
        }).catch(error => console.error(error));
    }

    // Función para ir al formulario de edición
    function handleEdit(id) {
        navigate(`/editar-tipo/${id}`); 
    }

    // Función para eliminar
    function handleDelete(id) {
        if(window.confirm("¿Estás seguro de eliminar este tipo de producto?")) {
            deleteTipo(id).then(() => {
                cargarTipos(); // Recargar la lista
            }).catch(error => console.error("Error al eliminar:", error));
        }
    }

    return (
        <div className="container">
            <h2 className="title">Tipos de Producto</h2>
            
           

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {tipos.map(tipo => (
                        <tr key={tipo.id_tipo}>
                            <td>{tipo.id_tipo}</td>
                            <td>{tipo.tipo}</td>
                            <td>{tipo.descripcion}</td>
                            <td>
                                <div className="actions" style={{marginTop: 0, justifyContent: 'flex-start', gap: '0.5rem'}}>
                                    <button 
                                        className="btn btn-edit" 
                                        onClick={() => handleEdit(tipo.id_tipo)}
                                    >
                                        <FaEdit /> Editar
                                    </button>
                                    
                                    <button 
                                        className="btn btn-delete" 
                                        onClick={() => handleDelete(tipo.id_tipo)}
                                    >
                                        <FaTrash /> Eliminar
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