import React, { useState, useEffect } from 'react';
// 1. Importamos get y update
import { crearTipo, getTipoById, updateTipo } from '../services/TipoService'; 
import { useNavigate, useParams } from 'react-router-dom'; // Importamos useParams
import { FaSave, FaTimes } from 'react-icons/fa';

export const TipoComponent = () => {
    const [tipo, setTipo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    
    const navigate = useNavigate();
    const { id } = useParams(); // 2. Obtenemos el ID de la URL (si existe)

    // 3. Efecto para cargar datos si es edición
    useEffect(() => {
        if (id) {
            getTipoById(id).then((response) => {
                setTipo(response.data.tipo);
                setDescripcion(response.data.descripcion);
            }).catch(error => console.error(error));
        }
    }, [id]);

    function saveOrUpdateTipo(e) {
        e.preventDefault();
        const tipoObjeto = { tipo, descripcion };

        if (id) {
            // 4. Lógica de Actualización
            updateTipo(id, tipoObjeto).then(() => {
                alert("Tipo actualizado con éxito ✅");
                navigate('/tipos');
            }).catch(error => console.error(error));
        } else {
            // 5. Lógica de Creación
            crearTipo(tipoObjeto).then(() => {
                alert("Tipo guardado con éxito ✅");
                navigate('/tipos');
            }).catch(error => console.error(error));
        }
    }

    return (
        <div className="container">
            {/* Título dinámico */}
            <h2 className="title">{id ? 'Editar Tipo' : 'Registro de Nuevo Tipo'}</h2>
            
            <form onSubmit={saveOrUpdateTipo}>
                <div className="form-group">
                    <label>Nombre del Tipo</label>
                    <input 
                        type="text" 
                        className="form-control"
                        value={tipo} 
                        onChange={(e) => setTipo(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Descripción</label>
                    <input 
                        type="text" 
                        className="form-control"
                        value={descripcion} 
                        onChange={(e) => setDescripcion(e.target.value)} 
                        required 
                    />
                </div>
                <div className="actions">
                    <button type="submit" className="btn btn-save">
                        <FaSave /> {id ? 'Guardar Cambios' : 'Guardar Tipo'}
                    </button>
                    <button type="button" className="btn btn-cancel" onClick={() => navigate('/tipos')}>
                        <FaTimes /> Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};