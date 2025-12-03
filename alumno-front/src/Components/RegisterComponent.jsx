import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerEmpleado } from '../services/AuthService'; // Necesitas esta función en AuthService.js
import { FaUserPlus } from 'react-icons/fa'; 

export const RegisterComponent = () => {
    // --- Estados del Formulario ---
    const [nombre, setNombre] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [puesto, setPuesto] = useState(''); // Estado para el rol (Enum: MESERO, CAJERO, etc.)
    const [error, setError] = useState('');
    const navegar = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');

        if (!nombre || !username || !password || !puesto) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        const registerRequest = { nombre, username, password, puesto };

        // Llama al servicio de registro (Puerto 7076)
        registerEmpleado(registerRequest)
            .then(response => {
                alert('¡Registro y Login exitosos!');
                // Al registrar, el backend devuelve el token. Lo guardamos y redirigimos.
                localStorage.setItem('token', response.data.token);
                navegar('/clientes'); 
                window.location.reload(); 
            })
            .catch(err => {
                console.error("Error en el registro:", err);
                setError('Error en el servidor o el usuario ya existe.');
            });
    };

    return (
        <div className="container" style={{maxWidth: '500px'}}>
            <h2 className="title">Registro de Empleados</h2>
            <form onSubmit={handleRegister}>
                
                {error && <div className='invalid-feedback' style={{display: 'block', color: 'red', marginBottom: '1rem'}}>{error}</div>}

                <div className="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Nombre de Usuario</label>
                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Contraseña</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Puesto / Rol</label>
                    <select value={puesto} className="form-control" onChange={(e) => setPuesto(e.target.value)} required>
                        <option value="">-- Selecciona un Rol --</option>
                        <option value="ADMINISTRADOR">Administrador</option>
                        <option value="SUPERVISOR">Supervisor</option>
                        <option value="CAJERO">Cajero</option>
                        <option value="MESERO">Mesero</option>
                        <option value="COCINERO">Cocinero</option>
                    </select>
                </div>

                <div className="actions">
                    <button type="submit" className="btn btn-save">
                        <FaUserPlus /> Registrar
                    </button>
                </div>
            </form>
        </div>
    );
};