import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import NavbarTienda from './components/NavbarTienda'
import HomeView from './views/HomeView'
import ProductosView from './views/ProductosView'
import DetalleProductoView from './views/DetalleProductoView'
import CategoriasView from './views/CategoriasView'
import OfertasView from './views/OfertasView'
import NosotrosView from './views/NosotrosView'
import BlogsView from './views/BlogsView'
import DetalleBlogView from './views/DetalleBlogView'
import ContactoView from './views/ContactoView'
import LoginView from './views/LoginView'
import RegistroView from './views/RegistroView'
import CarritoView from './views/CarritoView'
import CheckoutView from './views/CheckoutView'
import PagoCorrectoView from './views/PagoCorrectoView'
import PagoErrorView from './views/PagoErrorView'
import PerfilView from './views/PerfilView'
import MisPedidosView from './views/MisPedidosView'
import AdminLayout from './views/admin/AdminLayout'
import AdminDashboard from './views/admin/AdminDashboard'
import AdminOrdenes from './views/admin/AdminOrdenes'
import AdminBoleta from './views/admin/AdminBoleta'
import AdminProductos from './views/admin/AdminProductos'
import AdminProductoForm from './views/admin/AdminProductoForm'
import AdminCriticos from './views/admin/AdminCriticos'
import AdminCategorias from './views/admin/AdminCategorias'
import AdminUsuarios from './views/admin/AdminUsuarios'
import AdminUsuarioForm from './views/admin/AdminUsuarioForm'
import AdminHistorial from './views/admin/AdminHistorial'
import AdminReportes from './views/admin/AdminReportes'
import AdminPerfil from './views/admin/AdminPerfil'
import {
  actualizarUsuario,
  calcularTotal,
  cerrarSesion,
  guardarCarrito,
  guardarSesion,
  obtenerCarrito,
  obtenerSesion,
  precioFinal,
} from './data/db'

function App() {
  const [carrito, setCarrito] = useState(obtenerCarrito())
  const [usuario, setUsuario] = useState(obtenerSesion())
  const location = useLocation()
  const enAdmin = location.pathname.startsWith('/admin')

  function actualizarCarrito(nuevoCarrito) {
    setCarrito(nuevoCarrito)
    guardarCarrito(nuevoCarrito)
  }

  // "extras" guarda cosas como el mensaje personalizado de una torta.
  function agregarAlCarrito(producto, cantidad = 1, extras = {}) {
    const existe = carrito.some((item) => item.id === producto.id)

    if (existe) {
      actualizarCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad, ...extras }
            : item
        )
      )
      return
    }

    actualizarCarrito([
      ...carrito,
      {
        id: producto.id,
        nombre: producto.nombre,
        precio: precioFinal(producto),
        imagen: producto.imagen,
        cantidad: cantidad,
        ...extras,
      },
    ])
  }

  function cambiarCantidad(id, cambio) {
    const nuevoCarrito = carrito
      .map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + cambio } : item
      )
      .filter((item) => item.cantidad > 0)
    actualizarCarrito(nuevoCarrito)
  }

  function eliminarDelCarrito(id) {
    actualizarCarrito(carrito.filter((item) => item.id !== id))
  }

  function iniciar(usuarioLogueado) {
    guardarSesion(usuarioLogueado)
    setUsuario(usuarioLogueado)
  }

  function guardarPerfil(cambios) {
    const actualizado = { ...usuario, ...cambios }
    actualizarUsuario(usuario.id, cambios)
    guardarSesion(actualizado)
    setUsuario(actualizado)
  }

  function salir() {
    cerrarSesion()
    setUsuario(null)
  }

  let cantidadCarrito = 0
  carrito.forEach((item) => {
    cantidadCarrito = cantidadCarrito + item.cantidad
  })

  return (
    <>
      {!enAdmin && (
        <NavbarTienda
          cantidadCarrito={cantidadCarrito}
          totalCarrito={calcularTotal(carrito)}
          usuario={usuario}
          onCerrarSesion={salir}
        />
      )}

      <Routes>
        <Route path="/" element={<HomeView onAgregar={agregarAlCarrito} usuario={usuario} />} />
        <Route path="/productos" element={<ProductosView onAgregar={agregarAlCarrito} />} />
        <Route path="/producto/:id" element={<DetalleProductoView onAgregar={agregarAlCarrito} />} />
        <Route path="/categorias" element={<CategoriasView onAgregar={agregarAlCarrito} />} />
        <Route path="/categorias/:id" element={<CategoriasView onAgregar={agregarAlCarrito} />} />
        <Route path="/ofertas" element={<OfertasView onAgregar={agregarAlCarrito} />} />
        <Route path="/nosotros" element={<NosotrosView />} />
        <Route path="/blogs" element={<BlogsView />} />
        <Route path="/blog/:id" element={<DetalleBlogView />} />
        <Route path="/contacto" element={<ContactoView />} />
        <Route path="/login" element={<LoginView onLogin={iniciar} />} />
        <Route path="/registro" element={<RegistroView />} />
        <Route
          path="/carrito"
          element={
            <CarritoView
              carrito={carrito}
              usuario={usuario}
              onCambiarCantidad={cambiarCantidad}
              onEliminar={eliminarDelCarrito}
              onLimpiar={() => actualizarCarrito([])}
            />
          }
        />
        <Route
          path="/comprar"
          element={
            <CheckoutView
              carrito={carrito}
              usuario={usuario}
              onVaciar={() => actualizarCarrito([])}
            />
          }
        />
        <Route path="/pago-correcto/:id" element={<PagoCorrectoView />} />
        <Route path="/pago-error" element={<PagoErrorView />} />
        <Route path="/pedido/:id" element={<PagoCorrectoView />} />
        <Route path="/perfil" element={<PerfilView usuario={usuario} onGuardar={guardarPerfil} />} />
        <Route path="/mis-pedidos" element={<MisPedidosView usuario={usuario} />} />

        <Route path="/admin" element={<AdminLayout usuario={usuario} onCerrarSesion={salir} />}>
          <Route index element={<AdminDashboard />} />
          <Route path="ordenes" element={<AdminOrdenes />} />
          <Route path="ordenes/:id" element={<AdminBoleta />} />
          <Route path="productos" element={<AdminProductos />} />
          <Route path="productos/nuevo" element={<AdminProductoForm />} />
          <Route path="productos/:id/editar" element={<AdminProductoForm />} />
          <Route path="criticos" element={<AdminCriticos />} />
          <Route path="categorias" element={<AdminCategorias />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="usuarios/nuevo" element={<AdminUsuarioForm />} />
          <Route path="usuarios/:id/editar" element={<AdminUsuarioForm />} />
          <Route path="usuarios/:id/compras" element={<AdminHistorial />} />
          <Route path="reportes" element={<AdminReportes />} />
          <Route path="perfil" element={<AdminPerfil usuario={usuario} onGuardar={guardarPerfil} />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
