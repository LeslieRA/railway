import React, { useState, useEffect } from 'react';
import { crearEmpleado, getEmpleadoById, updateEmpleado } from '../services/EmpleadoService'; 
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';

export const EmpleadoComponent = () => {
    // --- Estados ---
    const [nombre, setNombre] = useState('');
    const [puesto, setPuesto] = useState('');
    // 1. Nuevos estados para login (NECESARIOS)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 
    
    const navegar = useNavigate();
    const { idEmpleado } = useParams();

    useEffect(() => {
        if (idEmpleado) {
            getEmpleadoById(idEmpleado).then((response) => {
                const empleado = response.data;
                setNombre(empleado.nombre);
                setPuesto(empleado.puesto); // Debe venir en MAYÚSCULAS desde el backend
                setUsername(empleado.username);
                // No seteamos password por seguridad
            }).catch(error => console.error(error));
        }
    }, [idEmpleado]);

    function saveOrUpdateEmpleado(e) {
        e.preventDefault();
        
        // 2. Construir objeto empleado
        const empleado = { 
            nombre, 
            puesto, 
            username,
            // Solo enviar password si no está vacío
            password: password ? password : undefined 
        };
        
        if (idEmpleado) {
            updateEmpleado(idEmpleado, empleado).then(() => {
                alert("Empleado actualizado con éxito ✅");
                navegar('/empleados');
            }).catch(error => {
                console.error(error);
                alert("Error al actualizar. Verifica si el usuario ya existe.");
            });
        } else {
            // Validación extra para crear
            if (!password) {
                alert("La contraseña es obligatoria para nuevos empleados.");
                return;
            }

            crearEmpleado(empleado).then(() => {
                alert("Empleado guardado con éxito ✅");
                navegar('/empleados');
            }).catch(error => {
                console.error(error);
                alert("Error al guardar. Verifica si el usuario ya existe.");
            });
        }
    }

    return (
        <div className="container">
            <h2 className="title">{idEmpleado ? 'Editar Empleado' : 'Registro de Nuevo Empleado'}</h2>
            
            <form onSubmit={saveOrUpdateEmpleado}>
                <div className="form-group">
                    <label>Nombre del Empleado</label>
                    <input 
                        type="text" 
                        value={nombre} 
                        className="form-control"
                        onChange={(e) => setNombre(e.target.value)} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Puesto</label>
                    <select 
                        value={puesto} 
                        className="form-control"
                        onChange={(e) => setPuesto(e.target.value)} 
                        required
                    >
                        <option value="">-- Selecciona un puesto --</option>
                        {/* IMPORTANTE: Values en MAYÚSCULAS para coincidir con tu BD */}
                        <option value="CAJERO">CAJERO</option>
                        <option value="COCINERO">COCINERO</option>
                        <option value="MESERO">MESERO</option>
                        <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                        <option value="SUPERVISOR">SUPERVISOR</option>
                    </select>
                </div>
                
                {/* --- Campos de Seguridad --- */}
                <div className="form-group">
                    <label>Nombre de Usuario (Login)</label>
                    <input 
                        type="text" 
                        value={username} 
                        className="form-control" 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        placeholder="Ej: juan.perez"
                    />
                </div>

                <div className="form-group">
                    <label>Contraseña</label>
                    <input 
                        type="password" 
                        value={password} 
                        className="form-control" 
                        onChange={(e) => setPassword(e.target.value)} 
                        // Requerido solo si es nuevo
                        required={!idEmpleado} 
                        placeholder={idEmpleado ? "Dejar en blanco para mantener la actual" : "Crear contraseña"}
                    />
                </div>

                <div className="actions">
                    <button type="submit" className="btn btn-save"><FaSave /> Guardar Empleado</button>
                    <button type="button" className="btn btn-cancel" onClick={() => navegar('/empleados')}><FaTimes /> Cancelar</button>
                </div>
            </form>
        </div>
    );
};