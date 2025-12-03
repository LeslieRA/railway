import React, { useEffect, useState, useMemo } from 'react'; // 1. Importa useMemo
import { listarEmpleados, deleteEmpleado } from '../services/EmpleadoService'; 
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const ListEmpleadoComponent = () => {
    const [empleados, setEmpleados] = useState([]);
    const navegar = useNavigate();

    // --- 2. Añade estados para los filtros ---
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroPuesto, setFiltroPuesto] = useState(''); // "" significa "Todos"

    function getAllEmpleados() {
        listarEmpleados().then(response => {
            setEmpleados(response.data);
        }).catch(error => console.error(error));
    }

    useEffect(() => {
        getAllEmpleados();
    }, []);

    function handleEdit(idEmpleado) {
        navegar(`/editar-empleado/${idEmpleado}`);
    }

    function handleDelete(idEmpleado) {
        if (window.confirm("¿Estás seguro de eliminar a este empleado?")) {
            deleteEmpleado(idEmpleado).then(() => {
                console.log(`Empleado con ID ${idEmpleado} eliminado.`);
                getAllEmpleados(); // Refresca la lista
            }).catch(error => console.error(error));
        }
    }

    // --- 3. Lógica de filtrado ---
    // useMemo es para que la lista solo se recalcule si cambia algún filtro
    const empleadosFiltrados = useMemo(() => {
        let empleadosTemp = empleados;

        // Filtro por nombre (letra o nombre completo)
        if (filtroNombre) {
            empleadosTemp = empleadosTemp.filter(empleado =>
                empleado.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
            );
        }

        // Filtro por puesto
        if (filtroPuesto) {
            empleadosTemp = empleadosTemp.filter(empleado =>
                empleado.puesto === filtroPuesto
            );
        }

        return empleadosTemp;
    }, [empleados, filtroNombre, filtroPuesto]); // Dependencias del filtro

    return (
        <div className="container">
            <h2 className="title">Lista de Empleados</h2>

            {/* --- 4. Barra de Filtros --- */}
            <div className="menu-filters"> {/* Reusamos los estilos de filtro del menú */}
                <div className="form-group">
                    <label>Buscar por Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre o letra..."
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Filtrar por Puesto</label>
                    <select
                        className="form-control"
                        value={filtroPuesto}
                        onChange={(e) => setFiltroPuesto(e.target.value)}
                    >
                        <option value="">Todos los Puestos</option>
                        <option value="CAJERO">CAJERO</option>
                        <option value="COCINERO">COCINERO</option>
                        <option value="MESERO">MESERO</option>
                        <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                        <option value="SUPERVISOR">SUPERVISOR</option>
                    </select>
                </div>
            </div>
            {/* --- Fin de Filtros --- */}

            <table className="table">
                <thead>
                    <tr>
                        <th>ID Empleado</th>
                        <th>Nombre</th>
                        <th>Usuario</th> {/* <-- 1. COLUMNA NUEVA */}
                        <th>Puesto</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {/* --- 5. Mapea la lista FILTRADA --- */}
                    {empleadosFiltrados.length > 0 ? (
                        empleadosFiltrados.map(empleado => (
                            <tr key={empleado.idEmpleado}>
                                <td>{empleado.idEmpleado}</td>
                                <td>{empleado.nombre}</td>
                                <td>{empleado.username}</td>
                                <td>{empleado.puesto}</td>
                                <td>
                                    <div className="actions">
                                        <button className="btn btn-edit" onClick={() => handleEdit(empleado.idEmpleado)}>
                                            <FaEdit /> Editar
                                        </button>
                                        <button className="btn btn-delete" onClick={() => handleDelete(empleado.idEmpleado)}>
                                            <FaTrash /> Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{textAlign: 'center'}}>No se encontraron empleados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};