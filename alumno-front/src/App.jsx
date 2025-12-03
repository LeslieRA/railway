import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// --- Componentes Públicos ---
import { Header } from './Components/Header'; 
import { LoginComponent } from './Components/LoginComponent';
import { MenuComponent } from './Components/MenuComponent'; 
import { ClienteComponent } from './Components/ClienteComponent'; // Importa Cliente
import { ReservaComponent } from './Components/ReservaComponent'; // Importa Reserva

// --- Componentes Privados ---
import { ListClienteComponent } from './Components/ListClienteComponent';
import { ListProductoComponent } from './Components/ListProductoComponent';
import { ProductoComponent } from './Components/ProductoComponent';
import { ListTipoComponent } from './Components/ListTipoComponent';
import { TipoComponent } from './Components/TipoComponent';
import { ListEmpleadoComponent } from './Components/ListEmpleadoComponent';
import { EmpleadoComponent } from './Components/EmpleadoComponent';
import { MesaComponent } from './Components/MesaComponent';
import { ListMesaComponent } from './Components/ListMesaComponent';
import { VentaComponent } from './Components/VentaComponent';
import { ListVentaComponent } from './Components/ListVentaComponent';
import { DetalleVentaComponent } from './Components/DetalleVentaComponent';
import { ListReservaComponent } from './Components/ListReservaComponent';
import { MisVentasComponent } from './Components/MisVentasComponent'; // Importa el nuevo componente
import { MisReservasClienteComponent } from './Components/MisReservasClienteComponent'; // 1. IMPORTAR
// Componente de Seguridad
import { ProtectedRoute } from './Components/ProtectedRoute';


import { ReservaClienteComponent } from './Components/ReservaClienteComponent';
import { EditarVentaMeseroComponent } from './Components/EditarVentaMeseroComponent';


function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          
            {/* =========================================
                RUTAS PÚBLICAS (Sin Login)
               ========================================= */}
            
            <Route path="/login" element={<LoginComponent />} />
            
            {/* Menú Principal */}
            <Route path='/' element={<MenuComponent />} />
            <Route path='/menu' element={<MenuComponent />} />

            {/* 👇 AHORA SON PÚBLICAS 👇 */}
            <Route path='/registrar-cliente' element={<ClienteComponent />} />
            <Route path='/registrar-reserva' element={<ReservaComponent />} />


            {/* =========================================
                RUTAS PROTEGIDAS (Requieren Login)
               ========================================= */}
            
            {/* --- Clientes (Gestión) --- */}
            <Route path='/clientes' element={<ProtectedRoute><ListClienteComponent /></ProtectedRoute>} />
            <Route path='/editar-cliente/:id_cliente' element={<ProtectedRoute><ClienteComponent /></ProtectedRoute>} />

            {/* --- Reservas (Gestión) --- */}
            <Route path='/reservas' element={<ProtectedRoute><ListReservaComponent /></ProtectedRoute>} />
            <Route path='/editar-reserva/:idReserva' element={<ProtectedRoute><ReservaComponent /></ProtectedRoute>} />

            {/* --- Productos --- */}
            <Route path='/productos' element={<ProtectedRoute><ListProductoComponent /></ProtectedRoute>} />
            <Route path='/registrar-producto' element={<ProtectedRoute><ProductoComponent /></ProtectedRoute>} />
            <Route path='/editar-producto/:id_producto' element={<ProtectedRoute><ProductoComponent /></ProtectedRoute>} />
            
            {/* --- Tipos --- */}
            <Route path='/tipos' element={<ProtectedRoute><ListTipoComponent /></ProtectedRoute>} />
            <Route path='/registrar-tipo' element={<ProtectedRoute><TipoComponent /></ProtectedRoute>} />
            <Route path='/editar-tipo/:id' element={<ProtectedRoute><TipoComponent /></ProtectedRoute>} />

            {/* --- Empleados --- */}
            <Route path='/empleados' element={<ProtectedRoute><ListEmpleadoComponent /></ProtectedRoute>} />
            <Route path='/registrar-empleado' element={<ProtectedRoute><EmpleadoComponent /></ProtectedRoute>} />
            <Route path='/editar-empleado/:idEmpleado' element={<ProtectedRoute><EmpleadoComponent /></ProtectedRoute>} />

            {/* --- Mesas --- */}
            <Route path='/mesas' element={<ProtectedRoute><ListMesaComponent /></ProtectedRoute>} />
            <Route path='/registrar-mesa' element={<ProtectedRoute><MesaComponent /></ProtectedRoute>} />
            <Route path='/editar-mesa/:idMesa' element={<ProtectedRoute><MesaComponent /></ProtectedRoute>} />

            {/* --- Ventas --- */}
            <Route path='/registrar-venta' element={<ProtectedRoute><VentaComponent /></ProtectedRoute>} />
            <Route path='/historial-ventas' element={<ProtectedRoute><ListVentaComponent /></ProtectedRoute>} />
            <Route path='/venta-detalles/:idVenta' element={<ProtectedRoute><DetalleVentaComponent /></ProtectedRoute>} />
            <Route path='/editar-venta/:idVenta' element={<ProtectedRoute><VentaComponent /></ProtectedRoute>} />

            {/* Nueva ruta para que el mesero vea sus clientes */}
            <Route path='/mis-ventas' element={<ProtectedRoute><MisVentasComponent /></ProtectedRoute>} />


              {/* Cambiamos ListReservaComponent por MisReservasClienteComponent */}
            <Route path='/mis-reservas' element={
                <ProtectedRoute><MisReservasClienteComponent /></ProtectedRoute>
            } />

             {/* Crear Reserva (Vista Cliente Exclusiva) */}
            <Route path='/reservarCliente' element={
                <ProtectedRoute><ReservaClienteComponent /></ProtectedRoute>
            } />

            {/* Ruta especial para que el mesero edite SU venta */}
            <Route path='/editar-venta-mesero/:idVenta' element={
                <ProtectedRoute><EditarVentaMeseroComponent /></ProtectedRoute>
            } />




            </Routes>    
      </main>
    </BrowserRouter>
  );
}

export default App;