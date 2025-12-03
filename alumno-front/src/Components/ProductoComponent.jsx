import React, { useState, useEffect } from 'react';
// 1. Importa los servicios JSON
import { crearProducto, getProductoById, updateProducto } from '../services/ProductoService'; 
import { listarTipos } from '../services/TipoService';
// 2. Importa el servicio para subir archivos
import { uploadFile } from '../services/FileStorageService'; 
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';

export const ProductoComponent = () => {
    // --- Estados para los campos del formulario ---
    const [nombreProducto, setNombreProducto] = useState('');
    const [descripcionProducto, setDescripcionProducto] = useState('');
    const [precioProducto, setPrecioProducto] = useState('');
    const [tipoId, setTipoId] = useState('');
    const [estado, setEstado] = useState(true);

    // --- Estados para la Imagen (Lógica de 2 Pasos) ---
    const [imagenRuta, setImagenRuta] = useState(''); // Guarda el NOMBRE del archivo (ej: 'mi-foto.png')
    const [previewImage, setPreviewImage] = useState(null); // Para la URL de la vista previa de la imagen nueva
    const [isUploading, setIsUploading] = useState(false); // Para deshabilitar el botón mientras sube

    // --- Otros Estados ---
    const [tipos, setTipos] = useState([]);
    const [errors, setErrors] = useState({
        nombreProducto: '', descripcionProducto: '', precioProducto: '', tipoId: '', imagen: ''
    });
    const navegar = useNavigate();
    const { id_producto } = useParams();

    useEffect(() => {
        // Carga la lista de tipos
        listarTipos().then(response => {
            setTipos(response.data);
        }).catch(error => console.error("Error al cargar tipos:", error));

        // Si es modo EDICIÓN, carga los datos del producto
        if (id_producto) {
            getProductoById(id_producto).then((response) => {
                const producto = response.data;
                setNombreProducto(producto.nombreProducto);
                setDescripcionProducto(producto.descripcionProducto);
                setPrecioProducto(producto.precioProducto);
                setTipoId(producto.tipo.id_tipo);
                setEstado(producto.estado);
                // Carga el nombre del archivo existente (asegúrate que tu DTO usa 'imagenRuta')
                setImagenRuta(producto.imagenRuta); 
            }).catch(error => console.error("Error al cargar producto:", error));
        }
    }, [id_producto]); // Se ejecuta si el id_producto cambia

    // --- Lógica de subida de archivo (cuando el usuario selecciona uno) ---
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPreviewImage(URL.createObjectURL(file)); // Muestra vista previa al instante
            setIsUploading(true); // Bloquea el botón de guardar
            setErrors(prev => ({ ...prev, imagen: '' })); // Limpia error previo

            // PASO 1: Sube el archivo INMEDIATAMENTE al backend
            uploadFile(file).then(response => {
                // Extrae el nombre del archivo de la respuesta del backend
                const filename = response.data.split(": ")[1]; 
                
                setImagenRuta(filename); // Guarda el nombre del archivo en el estado
                console.log("Imagen subida. Nombre guardado:", filename);
                setIsUploading(false); // Desbloquea el botón
            }).catch(error => {
                console.error("Error al subir el archivo:", error);
                alert("Error al subir la imagen, intente de nuevo.");
                setErrors(prev => ({ ...prev, imagen: 'Error al subir imagen' }));
                setIsUploading(false);
            });
        }
    };

    // --- Validación de campos ---
    function validaForm() {
        let valida = true;
        const errorsCopy = { nombreProducto: '', descripcionProducto: '', precioProducto: '', tipoId: '', imagen: '' };

        if (!nombreProducto.trim()) { errorsCopy.nombreProducto = 'El nombre es requerido'; valida = false; }
        if (!descripcionProducto.trim()) { errorsCopy.descripcionProducto = 'La descripción es requerida'; valida = false; }
        if (!precioProducto || precioProducto <= 0) { errorsCopy.precioProducto = 'El precio debe ser mayor a 0'; valida = false; }
        if (!tipoId) { errorsCopy.tipoId = 'Debe seleccionar un tipo'; valida = false; }
        
        // La imagen solo es obligatoria si estamos creando un producto nuevo
        if (!id_producto && !imagenRuta) {
            errorsCopy.imagen = 'Debes subir una imagen (y esperar a que cargue)';
            valida = false;
        }

        setErrors(errorsCopy);
        return valida;
    }

    // --- Función de Guardado (envía JSON) ---
    function saveOrUpdateProducto(e) {
        e.preventDefault();
        
        if (isUploading) {
            alert("Por favor, espera a que la imagen termine de subir.");
            return;
        }

        if (validaForm()) {
            // El DTO ahora incluye 'imagenRuta' como un string (debe coincidir con tu DTO de Java, usualmente camelCase)
            const producto = { 
                nombreProducto, 
                descripcionProducto, 
                precioProducto, 
                tipo: { id_tipo: parseInt(tipoId) }, 
                estado,
                imagenRuta // <-- El nombre del archivo que ya subimos
            };
            
            if (id_producto) { // MODO EDICIÓN
                updateProducto(id_producto, producto).then(() => {
                    alert("Producto actualizado con éxito ✅");
                    navegar('/productos');
                }).catch(error => console.error("Error al actualizar:", error));
            } else { // MODO CREACIÓN
                crearProducto(producto).then(() => {
                    alert("Producto guardado con éxito ✅");
                    navegar('/productos');
                }).catch(error => console.error("Error al crear:", error));
            }
        }
    }

    // --- Vista Previa (usa la ruta /uploads/) ---
    const getImagenSrc = () => {
        if (previewImage) {
            return previewImage; // 1. Muestra la nueva imagen seleccionada
        }
        if (imagenRuta) {
            // 2. Muestra la imagen existente (usando la ruta de MvcConfig)
            return `http://localhost:7073/uploads/${imagenRuta}`; 
        }
        return 'https://via.placeholder.com/150'; // 3. Placeholder
    };

    return (
        <div className="container">
            <h2 className="title">{id_producto ? 'Editar Producto' : 'Registro de Nuevo Producto'}</h2>
            
            <form onSubmit={saveOrUpdateProducto}>
                {/* --- Layout de 2 Columnas --- */}
                <div className="form-grid">
                    
                    {/* Campo Nombre */}
                    <div className="form-group">
                        <label>Nombre del Producto</label>
                        <input 
                            type="text" 
                            value={nombreProducto} 
                            className={`form-control ${errors.nombreProducto ? 'is-invalid' : ''}`}
                            onChange={(e) => setNombreProducto(e.target.value)} 
                        />
                        {errors.nombreProducto && <div className='invalid-feedback'>{errors.nombreProducto}</div>}
                    </div>

                    {/* Campo Precio */}
                    <div className="form-group">
                        <label>Precio</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={precioProducto} 
                            className={`form-control ${errors.precioProducto ? 'is-invalid' : ''}`}
                            onChange={(e) => setPrecioProducto(e.target.value)} 
                        />
                        {errors.precioProducto && <div className='invalid-feedback'>{errors.precioProducto}</div>}
                    </div>

                    {/* Campo Descripción */}
                    <div className="form-group full-width">
                        <label>Descripción</label>
                        <input 
                            type="text" 
                            value={descripcionProducto} 
                            className={`form-control ${errors.descripcionProducto ? 'is-invalid' : ''}`}
                            onChange={(e) => setDescripcionProducto(e.target.value)} 
                        />
                        {errors.descripcionProducto && <div className='invalid-feedback'>{errors.descripcionProducto}</div>}
                    </div>

                    {/* Campo Tipo de Producto */}
                    <div className="form-group">
                        <label>Tipo de Producto</label>
                        <select 
                            value={tipoId} 
                            className={`form-control ${errors.tipoId ? 'is-invalid' : ''}`}
                            onChange={(e) => setTipoId(e.target.value)}
                        >
                            <option value="">-- Selecciona un tipo --</option>
                            {tipos.map(tipo => (
                                <option key={tipo.id_tipo} value={tipo.id_tipo}>{tipo.tipo}</option>
                            ))}
                        </select>
                        {errors.tipoId && <div className='invalid-feedback'>{errors.tipoId}</div>}
                    </div>
                </div>

                {/* --- Input de Archivo (Ancho Completo) --- */}
                <div className="form-group full-width">
                    <label>Imagen del Producto</label>
                    <input 
                        type="file" 
                        className={`form-control ${errors.imagen ? 'is-invalid' : ''}`}
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                    />
                    {errors.imagen && <div className='invalid-feedback'>{errors.imagen}</div>}
                </div>
                
                {/* --- Vista Previa de la Imagen --- */}
                <div style={{textAlign: 'center', margin: '1rem 0'}}>
                    <img 
                        src={getImagenSrc()} 
                        alt="Vista previa" 
                        style={{width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd'}} 
                    />
                </div>

                {/* --- Checkbox de Estado --- */}
                <div className="form-group form-check">
                    <input 
                        type="checkbox" 
                        className="form-check-input"
                        checked={estado}
                        onChange={(e) => setEstado(e.target.checked)}
                        id="estadoCheck"
                    />
                    <label className="form-check-label" htmlFor="estadoCheck">
                        Producto Activo
                    </label>
                </div>

                {/* --- Botones de Acción --- */}
                <div className="actions">
                    <button type="submit" className="btn btn-save" disabled={isUploading}>
                        {isUploading ? "Subiendo imagen..." : (id_producto ? "Actualizar" : "Guardar Producto")}
                    </button>
                    <button type="button" className="btn btn-cancel" onClick={() => navegar('/productos')}>
                        <FaTimes /> Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};