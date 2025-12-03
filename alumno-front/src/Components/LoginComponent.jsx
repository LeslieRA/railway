import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Importa AMBAS funciones de login
import { loginUsuario, loginCliente } from '../services/AuthService'; 
import { FaSignInAlt, FaUser, FaUserTie } from 'react-icons/fa';

export const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // 2. Estado para saber quién está intentando entrar ('CLIENTE' por defecto)
    const [tipoUsuario, setTipoUsuario] = useState('CLIENTE'); 
    
    const navegar = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        // El backend siempre espera un campo llamado "username", 
        // aunque para el cliente sea su correo.
        const credentials = { username, password };
        
        // 3. Decidir qué función llamar según el botón seleccionado
        const loginFunction = tipoUsuario === 'EMPLEADO' ? loginUsuario : loginCliente;

        loginFunction(credentials)
            .then(response => {
                // Guardar Token
                localStorage.setItem('token', response.data.token);
                
                // Redirección Inteligente
                if (tipoUsuario === 'CLIENTE') {
                    alert('¡Bienvenido! Puedes hacer tu reservación.');
                    navegar('/menu'); // Clientes van al menú público
                } else {
                    alert('¡Bienvenido Colaborador!');
                    navegar('/menu'); // Empleados van al área de trabajo
                }
                
                // Recargar para actualizar el Header
                window.location.reload(); 
            })
            .catch(err => {
                console.error("Error login:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError('Credenciales incorrectas. Verifica tu correo/usuario y contraseña.');
                } else {
                    setError('Error al conectar con el servidor.');
                }
            });
    };

    // Estilos para los botones del switch
    const btnActive = { backgroundColor: '#2f4858', color: 'white', border: '2px solid #2f4858' };
    const btnInactive = { backgroundColor: '#f0f0f0', color: '#555', border: '1px solid #ccc' };

    return (
        <div className="container" style={{maxWidth: '450px', marginTop: '3rem'}}>
            <h2 className="title">Iniciar Sesión</h2>

            {/* --- 4. SWITCH DE TIPO DE USUARIO --- */}
            <div className="d-flex justify-content-center gap-2 mb-4">
                <button 
                    type="button"
                    className="btn"
                    onClick={() => setTipoUsuario('CLIENTE')}
                    style={{ ... (tipoUsuario === 'CLIENTE' ? btnActive : btnInactive), flex: 1 }}
                >
                    <FaUser /> Soy Cliente
                </button>
                <button 
                    type="button"
                    className="btn"
                    onClick={() => setTipoUsuario('EMPLEADO')}
                    style={{ ... (tipoUsuario === 'EMPLEADO' ? btnActive : btnInactive), flex: 1 }}
                >
                    <FaUserTie /> Soy Empleado
                </button>
            </div>

            <form onSubmit={handleLogin}>
                {error && <div className="alert alert-danger text-center">{error}</div>}

                <div className="form-group">
                    {/* La etiqueta cambia según el tipo */}
                    <label>{tipoUsuario === 'CLIENTE' ? 'Correo Electrónico' : 'Nombre de Usuario'}</label>
                    <input
                        type={tipoUsuario === 'CLIENTE' ? 'email' : 'text'}
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={tipoUsuario === 'CLIENTE' ? 'ejemplo@correo.com' : 'Ej. juan.perez'}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Tu contraseña"
                        required
                    />
                </div>

                <div className="actions">
                    <button type="submit" className="btn btn-save w-100">
                        <FaSignInAlt /> Entrar
                    </button>
                </div>
                
                {/* Enlace para registrarse (Solo visible para Clientes) */}
                {tipoUsuario === 'CLIENTE' && (
                    <div className="text-center mt-3">
                        <p>¿No tienes cuenta? <a href="/registrar-cliente">Regístrate aquí</a></p>
                    </div>
                )}
            </form>
        </div>
    );
};