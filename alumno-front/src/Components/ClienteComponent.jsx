import React, { useState, useEffect } from 'react';
import { crearCliente, getClienteById, updateCliente } from '../services/ClienteService'; 
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';

export const ClienteComponent = () => {
    const [nombreCliente, setNombreCliente] = useState('');
    const [telefonoCliente, setTelefonoCliente] = useState('');
    const [correoCliente, setCorreoCliente] = useState('');
    // 1. NUEVO ESTADO
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({
        nombreCliente: '', telefonoCliente: '', correoCliente: '', password: ''
    });

    const navigate = useNavigate();
    const { id_cliente } = useParams();

    useEffect(() => {
        if (id_cliente) {
            getClienteById(id_cliente).then((response) => {
                setNombreCliente(response.data.nombreCliente);
                setTelefonoCliente(response.data.telefonoCliente);
                setCorreoCliente(response.data.correoCliente);
                // No cargamos el password por seguridad
            }).catch(error => console.error(error));
        }
    }, [id_cliente]);

    function validaForm() {
        let valida = true;
        const errorsCopy = { ...errors };
        
        if (!nombreCliente.trim()) { errorsCopy.nombreCliente = 'Requerido'; valida = false; } else { errorsCopy.nombreCliente = ''; }
        if (!telefonoCliente.trim()) { errorsCopy.telefonoCliente = 'Requerido'; valida = false; } else { errorsCopy.telefonoCliente = ''; }
        if (!correoCliente.trim()) { errorsCopy.correoCliente = 'Requerido'; valida = false; } else { errorsCopy.correoCliente = ''; }

        // 2. VALIDACIÓN DE CONTRASEÑA (Solo si es nuevo)
        if (!id_cliente && !password.trim()) {
            errorsCopy.password = 'La contraseña es obligatoria';
            valida = false;
        } else {
            errorsCopy.password = '';
        }

        setErrors(errorsCopy);
        return valida;
    }

    function saveOrUpdateCliente(e) {
        e.preventDefault();

        if (validaForm()) {
            const cliente = { 
                nombreCliente, 
                telefonoCliente, 
                correoCliente,
                // 3. ENVIAR PASSWORD (solo texto plano, el backend pone el {noop})
                password: password 
            };
            
            if (id_cliente) {
                updateCliente(id_cliente, cliente).then(() => {
                    alert("Cliente actualizado ✅");
                    navigate('/clientes');
                }).catch(error => console.error(error));
            } else {
                crearCliente(cliente).then(() => {
                    alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
                    // Redirigir al Login para que pruebe su cuenta nueva
                    navigate('/login'); 
                }).catch(error => console.error(error));
            }
        }
    }

    return (
        <div className="container">
            <h2 className="title">{id_cliente ? 'Editar Cliente' : 'Registro de Nuevo Cliente'}</h2>
            
            <form onSubmit={saveOrUpdateCliente}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" className="form-control" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} />
                    {errors.nombreCliente && <div className='text-danger'>{errors.nombreCliente}</div>}
                </div>
                <div className="form-group">
                    <label>Teléfono</label>
                    <input type="text" className="form-control" value={telefonoCliente} onChange={(e) => setTelefonoCliente(e.target.value)} />
                    {errors.telefonoCliente && <div className='text-danger'>{errors.telefonoCliente}</div>}
                </div>
                <div className="form-group">
                    <label>Correo (Usuario)</label>
                    <input type="email" className="form-control" value={correoCliente} onChange={(e) => setCorreoCliente(e.target.value)} />
                    {errors.correoCliente && <div className='text-danger'>{errors.correoCliente}</div>}
                </div>

                {/* 4. CAMPO PASSWORD (Visible solo al crear) */}
                {!id_cliente && (
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Crea tu contraseña"
                        />
                        {errors.password && <div className='text-danger'>{errors.password}</div>}
                    </div>
                )}

                <div className="actions">
                    <button type="submit" className="btn btn-save"><FaSave /> Guardar</button>
                    <button type="button" onClick={() => navigate('/menu')} className="btn btn-cancel"><FaTimes /> Cancelar</button>
                </div>
            </form>
        </div>
    );
};