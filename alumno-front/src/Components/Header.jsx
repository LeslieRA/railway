import React from 'react';
import './Header.css';
// 1. Importa todos los iconos necesarios
import { 
    FaUsers, FaUserPlus, FaUserTie, FaCashRegister, FaHistory, 
    FaCalendarAlt, FaCalendarCheck, FaCoffee, FaUser, FaSignOutAlt, 
    FaSignInAlt, FaUserCheck 
} from 'react-icons/fa'; 
import { MdTableRestaurant, MdAddBox } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
    const { isAuthenticated, logout, user } = useAuth(); 
    const role = user?.role || '';

    // --- LÓGICA DE PERMISOS ---

    // 1. Grupos Generales
    const isStaff = role.includes('ADMINISTRADOR') || role.includes('SUPERVISOR') || role.includes('CAJERO') || role.includes('MESERO');
    const isClient = role.includes('CLIENTE');
    const isMesero = role.includes('MESERO');

    // 2. Permisos específicos por Módulo
    const showClients = role.includes('ADMINISTRADOR') || role.includes('SUPERVISOR') || role.includes('CAJERO');
    const showProducts = role.includes('ADMINISTRADOR') || role.includes('SUPERVISOR');
    const showEmployees = role.includes('ADMINISTRADOR') || role.includes('SUPERVISOR');
    
    const showTables = role.includes('ADMINISTRADOR') || role.includes('CAJERO');
    const showReservations = role.includes('ADMINISTRADOR') || role.includes('CAJERO');
    const showSales = role.includes('ADMINISTRADOR') || role.includes('CAJERO');

    const getRoleLabel = (r) => r ? r.substring(5).toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : 'Usuario';

    return (
        <header className="main-header">
            <div className="logo">
                <a href="/menu">Café del Sol ☕</a>
            </div>
            <nav>
                <ul>
                    {/* --- 1. SIEMPRE VISIBLE: MENÚ PÚBLICO --- */}
                    <li className="dropdown">
                        <a href="/menu"><FaCoffee /> Menú</a>
                    </li>

                    {/* --- 2. MENÚS DE STAFF (Solo Empleados Logueados) --- */}
                    {isAuthenticated && isStaff && (
                        <>
                            {/* CLIENTES */}
                            {showClients && (
                                <li className="dropdown">
                                    <a href="/clientes">Clientes</a>
                                    <div className="dropdown-panel">
                                        <div className="mega-menu-column">
                                            <h3>Gestión de Clientes</h3>
                                            <ul>
                                                <li><a href="/clientes"><FaUsers /> Ver Clientes</a></li>
                                                <li><a href="/registrar-cliente"><FaUserPlus /> Registrar Cliente</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            )}

                            {/* PRODUCTOS */}
                            {showProducts && (
                                <li className="dropdown">
                                    <a href="/productos">Productos</a>
                                    <div className="mega-menu">
                                        <div className="mega-menu-column">
                                            <h3>Gestión de Productos</h3>
                                            <ul>
                                                <li><a href="/productos">Ver Productos</a></li>
                                                <li><a href="/registrar-producto">Registrar Producto</a></li>
                                            </ul>
                                        </div>
                                        <div className="mega-menu-column">
                                            <h3>Categorías</h3>
                                            <ul>
                                                <li className="submenu-trigger">
                                                    <a href="/tipos">Tipos de Producto ▸</a>
                                                    <ul className="submenu">
                                                        <li><a href="/tipos">Ver Tipos</a></li>
                                                        <li><a href="/registrar-tipo">Registrar Tipo</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            )}

                            {/* EMPLEADOS */}
                            {showEmployees && (
                                <li className="dropdown">
                                    <a href="/empleados">Empleados</a>
                                    <div className="dropdown-panel">
                                        <div className="mega-menu-column">
                                            <h3>Gestión de Empleados</h3>
                                            <ul>
                                                <li><a href="/empleados"><FaUsers /> Ver Empleados</a></li>
                                                <li><a href="/registrar-empleado"><FaUserTie /> Registrar Empleado</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            )}

                            {/* MESAS */}
                            {showTables && (
                                <li className="dropdown">
                                    <a href="/mesas">Mesas</a>
                                    <div className="dropdown-panel">
                                        <div className="mega-menu-column">
                                            <ul>
                                                <li><a href="/mesas"><MdTableRestaurant /> Ver Mesas</a></li>
                                                {/* Solo Admin agrega mesas */}
                                                {role.includes('ADMINISTRADOR') && (
                                                    <li><a href="/registrar-mesa"><MdAddBox /> Registrar Mesa</a></li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            )}

                            {/* RESERVAS (Vista Admin/Cajero) */}
                            {showReservations && (
                                <li className="dropdown">
                                    <a href="/reservas">Reservas</a>
                                    <div className="dropdown-panel">
                                        <div className="mega-menu-column">
                                            <ul>
                                                <li><a href="/reservas"><FaCalendarAlt /> Ver Reservas</a></li>
                                                {/* Mesero no registra reservas por aquí */}
                                                {!role.includes('MESERO') && (
                                                    <li><a href="/registrar-reserva"><FaCalendarCheck /> Crear Reserva</a></li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            )}

                            {/* VENTAS */}
                            {showSales && (
                                <li className="dropdown">
                                    <a href="/registrar-venta">Ventas</a>
                                    <div className="dropdown-panel">
                                        <div className="mega-menu-column">
                                            <h3>Operaciones</h3>
                                            <ul>
                                                {/* Historial solo para Admin y Cajero */}
                                                {!role.includes('MESERO') && (
                                                    <li><a href="/historial-ventas"><FaHistory /> Ver Historial</a></li>
                                                )}
                                                <li><a href="/registrar-venta"><FaCashRegister /> Registrar Venta</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            )}

                            {/* MIS VENTAS (Solo Mesero) */}
                            {isMesero && (
                                <li className="dropdown">
                                    <a href="/mis-ventas"><FaUserCheck /> Mis Ventas</a>
                                </li>
                            )}
                        </>
                    )}

                    {/* --- 3. MENÚ DE CLIENTE (ACTUALIZADO) --- */}
                    {isAuthenticated && isClient && (
                        <>
                            {/* Botón directo para la nueva página de reservar */}
                            <li className="dropdown">
                                <a href="/reservarCliente" style={{color: '#ffc107'}}>
                                    <FaCalendarCheck /> Nueva Reservación
                                </a>
                            </li>
                            
                            {/* Botón directo para ver historial */}
                            <li className="dropdown">
                                <a href="/mis-reservas">
                                    <FaHistory /> Ver Mis Reservas
                                </a>
                            </li>
                        </>
                    )}

                    {/* --- 4. MENÚ PÚBLICO (No Logueado) --- */}
                    {!isAuthenticated && (
                        <>
                            <li className="dropdown"><a href="/registrar-cliente"><FaUserPlus /> Registrarse</a></li>
                            <li className="dropdown"><a href="/registrar-reserva"><FaCalendarCheck /> Reservar</a></li>
                            <li className="dropdown"><a href="/login"><FaSignInAlt /> Iniciar Sesión</a></li>
                        </>
                    )}

                    {/* --- 5. INFO DE USUARIO / LOGOUT --- */}
                    {isAuthenticated && (
                        <li className="dropdown user-info" style={{position: 'relative'}}>
                            <a href="#">
                                <FaUser /> {user?.username} ({getRoleLabel(user?.role)})
                            </a>
                            <ul className="dropdown-menu" style={{minWidth: '150px', right: '0', left: 'auto', padding: '0'}}>
                                <li><button className="btn btn-logout" onClick={logout}><FaSignOutAlt /> Cerrar Sesión</button></li>
                            </ul>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};