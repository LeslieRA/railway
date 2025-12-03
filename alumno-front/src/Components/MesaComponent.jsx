import React, { useState, useEffect } from 'react';
import { crearMesa, getMesaById, updateMesa } from '../services/MesaService'; 
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';

export const MesaComponent = () => {
    const [numero, setNumero] = useState('');
    const [capacidad, setCapacidad] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    // 1. El estado por defecto es 'true' (Desocupado)
    const [estado, setEstado] = useState(true);
    
    const navegar = useNavigate();
    const { idMesa } = useParams();

    useEffect(() => {
        if (idMesa) {
            getMesaById(idMesa).then((response) => {
                const mesa = response.data;
                setNumero(mesa.numero);
                setCapacidad(mesa.capacidad);
                setUbicacion(mesa.ubicacion);
                // 2. Carga el estado actual de la mesa al editar
                setEstado(mesa.estado); 
            }).catch(error => console.error(error));
        }
    }, [idMesa]);

    function saveOrUpdateMesa(e) {
        e.preventDefault();
        
        // 3. Incluye el 'estado' en el objeto que se envía al backend
        const mesa = { numero, capacidad, ubicacion, estado };
        
        if (idMesa) {
            updateMesa(idMesa, mesa).then(() => {
                alert("Mesa actualizada con éxito ✅");
                navegar('/mesas');
            }).catch(error => console.error(error));
        } else {
            crearMesa(mesa).then(() => {
                alert("Mesa guardada con éxito ✅");
                navegar('/mesas');
            }).catch(error => console.error(error));
        }
    }

    return (
        <div className="container">
            <h2 className="title">{idMesa ? 'Editar Mesa' : 'Registrar Nueva Mesa'}</h2>
            
            <form onSubmit={saveOrUpdateMesa}>
                <div className="form-group">
                    <label>Número de Mesa</label>
                    <input 
                        type="number" 
                        value={numero} 
                        className="form-control"
                        onChange={(e) => setNumero(e.target.value)} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Capacidad (personas)</label>
                    <input 
                        type="number" 
                        value={capacidad} 
                        className="form-control"
                        onChange={(e) => setCapacidad(e.target.value)} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Ubicación</label>
                    <input 
                        type="text" 
                        value={ubicacion} 
                        className="form-control"
                        placeholder="Ej: Terraza, Salón principal, Ventana"
                        onChange={(e) => setUbicacion(e.target.value)} 
                        required 
                    />
                </div>

                {/* --- 4. Checkbox para manejar el estado --- */}
                <div className="form-group form-check">
                    <input 
                        type="checkbox" 
                        className="form-check-input"
                        // El checkbox está marcado si la mesa está Ocupada (estado = false)
                        checked={!estado}
                        // Al marcarlo, el estado se debe poner en 'Ocupada' (false)
                        // Al desmarcarlo, el estado se debe poner en 'Desocupada' (true)
                        onChange={(e) => setEstado(!e.target.checked)}
                        id="estadoMesaCheck"
                    />
                    <label className="form-check-label" htmlFor="estadoMesaCheck">
                        Marcar como Ocupada
                    </label>
                </div>

                <div className="actions">
                    <button type="submit" className="btn btn-save"><FaSave /> Guardar Mesa</button>
                    <button type="button" className="btn btn-cancel" onClick={() => navegar('/mesas')}><FaTimes /> Cancelar</button>
                </div>
            </form>
        </div>
    );
};