const PRODUCTOS_INICIALES = [
  { id: 'TC001', nombre: 'Torta cuadrada de chocolate', categoria: 'Tortas cuadradas', precio: 45000, oferta: true, precioOferta: 40000, stock: 10, descripcion: 'Torta de chocolate con capas de crema y avellanas.', imagen: '/img/torta_cuadrada_choc.jpg' },
  { id: 'TC002', nombre: 'Torta cuadrada de frutas', categoria: 'Tortas cuadradas', precio: 50000, oferta: false, precioOferta: 0, stock: 8, descripcion: 'Frutas frescas y crema chantilly sobre un bizcocho suave.', imagen: '/img/torta_cua_frutas.jpg' },
  { id: 'TT001', nombre: 'Torta circular de vainilla', categoria: 'Tortas circulares', precio: 40000, oferta: true, precioOferta: 35000, stock: 10, descripcion: 'Bizcocho de vainilla relleno con crema pastelera.', imagen: '/img/torta_circ_vainilla.jpg' },
  { id: 'TT002', nombre: 'Torta circular de manjar', categoria: 'Tortas circulares', precio: 42000, oferta: false, precioOferta: 0, stock: 2, descripcion: 'Torta tradicional chilena con manjar y nueces.', imagen: '/img/torta_circ_manjar.jpg' },
  { id: 'P1001', nombre: 'Mousse de chocolate', categoria: 'Postres individuales', precio: 5000, oferta: false, precioOferta: 0, stock: 20, descripcion: 'Postre cremoso de chocolate para una persona.', imagen: '/img/mousse_choc.jpg' },
  { id: 'P1002', nombre: 'Tiramisu clasico', categoria: 'Postres individuales', precio: 5500, oferta: true, precioOferta: 4500, stock: 15, descripcion: 'Postre italiano con cafe y queso mascarpone.', imagen: '/img/tiramisu.jpg' },
  { id: 'PSA001', nombre: 'Torta sin azucar de naranja', categoria: 'Productos sin azucar', precio: 48000, oferta: false, precioOferta: 0, stock: 5, descripcion: 'Torta liviana de naranja, sin azucar.', imagen: '/img/torta_naranja.jpg' },
  { id: 'PV001', nombre: 'Torta vegana de chocolate', categoria: 'Productos veganos', precio: 50000, oferta: false, precioOferta: 0, stock: 1, descripcion: 'Torta de chocolate sin leche ni huevos.', imagen: '/img/torta_veg_choc.jpg' },
  { id: 'PSA002', nombre: 'Cheesecake sin azucar', categoria: 'Productos sin azucar', precio: 47000, oferta: false, precioOferta: 0, stock: 8, descripcion: 'Suave y cremoso, una opcion perfecta para disfrutar sin culpa.', imagen: '/img/psa002-cheesecake.svg' },
  { id: 'PT001', nombre: 'Empanada de manzana', categoria: 'Pasteleria tradicional', precio: 3000, oferta: false, precioOferta: 0, stock: 25, descripcion: 'Pasteleria tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.', imagen: '/img/pt001-empanada.svg' },
  { id: 'PT002', nombre: 'Tarta de Santiago', categoria: 'Pasteleria tradicional', precio: 6000, oferta: false, precioOferta: 0, stock: 12, descripcion: 'Tradicional tarta española hecha con almendras, azucar y huevos, una delicia para los amantes de los postres clasicos.', imagen: '/img/pt002-tarta-santiago.svg' },
  { id: 'PG001', nombre: 'Brownie sin gluten', categoria: 'Productos sin gluten', precio: 4000, oferta: false, precioOferta: 0, stock: 18, descripcion: 'Rico y denso, perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.', imagen: '/img/pg001-brownie.svg' },
  { id: 'PG002', nombre: 'Pan sin gluten', categoria: 'Productos sin gluten', precio: 3500, oferta: false, precioOferta: 0, stock: 15, descripcion: 'Suave y esponjoso, ideal para sandwiches o para acompañar cualquier comida.', imagen: '/img/pg002-pan.svg' },
  { id: 'PV002', nombre: 'Galletas veganas de avena', categoria: 'Productos veganos', precio: 4500, oferta: false, precioOferta: 0, stock: 20, descripcion: 'Crujientes y sabrosas, una excelente opcion para un snack saludable y vegano.', imagen: '/img/pv002-galletas.svg' },
  { id: 'TE001', nombre: 'Torta especial de cumpleaños', categoria: 'Tortas especiales', precio: 55000, oferta: false, precioOferta: 0, stock: 6, descripcion: 'Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes unicos.', imagen: '/img/te001-cumpleanos.svg' },
  { id: 'TE002', nombre: 'Torta especial de boda', categoria: 'Tortas especiales', precio: 60000, oferta: false, precioOferta: 0, stock: 6, descripcion: 'Elegante y deliciosa, diseñada para ser el centro de atencion en cualquier boda.', imagen: '/img/te002-boda.svg' },
]

const CATEGORIAS_INICIALES = [
  { id: 1, nombre: 'Tortas cuadradas' },
  { id: 2, nombre: 'Tortas circulares' },
  { id: 3, nombre: 'Postres individuales' },
  { id: 4, nombre: 'Productos sin azucar' },
  { id: 5, nombre: 'Productos veganos' },
  { id: 6, nombre: 'Pasteleria tradicional' },
  { id: 7, nombre: 'Productos sin gluten' },
  { id: 8, nombre: 'Tortas especiales' },
]

// Si el navegador ya tenia guardados los 8 productos y 5 categorias de la version anterior,
// esta funcion agrega los nuevos una sola vez (despues respeta lo que haga el administrador).
const VERSION_CATALOGO = '2'

function completarCatalogo() {
  if (localStorage.getItem('catalogoVersion') === VERSION_CATALOGO) {
    return
  }

  if (localStorage.getItem('productos') !== null) {
    const productos = leer('productos', [])
    PRODUCTOS_INICIALES.forEach((inicial) => {
      if (!productos.some((producto) => producto.id === inicial.id)) {
        productos.push(inicial)
      }
    })
    guardar('productos', productos)
  }

  if (localStorage.getItem('categorias') !== null) {
    const categorias = leer('categorias', [])
    CATEGORIAS_INICIALES.forEach((inicial) => {
      if (!categorias.some((categoria) => categoria.nombre === inicial.nombre)) {
        categorias.push({ id: siguienteId(categorias), nombre: inicial.nombre })
      }
    })
    guardar('categorias', categorias)
  }

  localStorage.setItem('catalogoVersion', VERSION_CATALOGO)
}

const USUARIOS_INICIALES = [
  { id: 1, nombre: 'Admin', apellidos: 'Tienda', correo: 'admin@duoc.cl', clave: 'admin123', rol: 'Administrador' },
  { id: 2, nombre: 'Cliente', apellidos: 'Demo', correo: 'cliente@gmail.com', clave: 'cliente1', rol: 'Cliente' },
]

function leer(clave, valorInicial, almacen = localStorage) {
  const texto = almacen.getItem(clave)

  if (texto === null) {
    return valorInicial
  }

  return JSON.parse(texto)
}

function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor))
}

function obtenerLista(clave, inicial) {
  if (localStorage.getItem(clave) === null) {
    guardar(clave, inicial)
  }

  return leer(clave, [])
}

function siguienteId(lista) {
  let mayor = 0

  lista.forEach((item) => {
    if (item.id > mayor) {
      mayor = item.id
    }
  })

  return mayor + 1
}

export function obtenerProductos() {
  completarCatalogo()
  return obtenerLista('productos', PRODUCTOS_INICIALES)
}

export function obtenerProductoPorId(id) {
  return obtenerProductos().find((producto) => producto.id === id)
}

export function crearProducto(producto) {
  const productos = obtenerProductos()
  productos.push(producto)
  guardar('productos', productos)
  return producto
}

export function actualizarProducto(id, cambios) {
  const productos = obtenerProductos().map((producto) =>
    producto.id === id ? { ...producto, ...cambios } : producto
  )
  guardar('productos', productos)
}

export function eliminarProducto(id) {
  const productos = obtenerProductos().filter((producto) => producto.id !== id)
  guardar('productos', productos)
}

export function obtenerCategorias() {
  completarCatalogo()
  return obtenerLista('categorias', CATEGORIAS_INICIALES)
}

export const STOCK_CRITICO = 5

export function crearCategoria(nombre) {
  const categorias = obtenerCategorias()
  categorias.push({ id: siguienteId(categorias), nombre: nombre })
  guardar('categorias', categorias)
}

export function actualizarCategoria(id, nombre) {
  const anterior = obtenerCategorias().find((categoria) => categoria.id === id)
  const categorias = obtenerCategorias().map((categoria) =>
    categoria.id === id ? { ...categoria, nombre: nombre } : categoria
  )
  guardar('categorias', categorias)

  const productos = obtenerProductos().map((producto) =>
    producto.categoria === anterior.nombre ? { ...producto, categoria: nombre } : producto
  )
  guardar('productos', productos)
}

export function eliminarCategoria(id) {
  const categorias = obtenerCategorias().filter((categoria) => categoria.id !== id)
  guardar('categorias', categorias)
}

export function obtenerUsuarios() {
  return obtenerLista('usuarios', USUARIOS_INICIALES)
}

export function buscarUsuarioPorCorreo(correo) {
  return obtenerUsuarios().find((usuario) => usuario.correo === correo)
}

export function crearUsuario(usuario) {
  const usuarios = obtenerUsuarios()
  const nuevo = { ...usuario, id: siguienteId(usuarios) }
  usuarios.push(nuevo)
  guardar('usuarios', usuarios)
  return nuevo
}

export function actualizarUsuario(id, cambios) {
  const usuarios = obtenerUsuarios().map((usuario) =>
    usuario.id === id ? { ...usuario, ...cambios } : usuario
  )
  guardar('usuarios', usuarios)
}

export function eliminarUsuario(id) {
  const usuarios = obtenerUsuarios().filter((usuario) => usuario.id !== id)
  guardar('usuarios', usuarios)
}

export function iniciarSesion(correo, clave) {
  return obtenerUsuarios().find(
    (usuario) => usuario.correo === correo && usuario.clave === clave
  )
}

export function guardarSesion(usuario) {
  sessionStorage.setItem('usuarioActual', JSON.stringify(usuario))
}

export function obtenerSesion() {
  return leer('usuarioActual', null, sessionStorage)
}

export function cerrarSesion() {
  sessionStorage.removeItem('usuarioActual')
}

export function obtenerOrdenes() {
  return obtenerLista('ordenes', [])
}

export function obtenerOrdenPorId(id) {
  return obtenerOrdenes().find((orden) => orden.id === id)
}

export function crearOrden(orden) {
  const ordenes = obtenerOrdenes()
  const nueva = { ...orden, id: siguienteId(ordenes) }
  ordenes.push(nueva)
  guardar('ordenes', ordenes)
  return nueva
}

export function obtenerMasVendidos() {
  const vendidos = []

  obtenerOrdenes().forEach((orden) => {
    orden.items.forEach((item) => {
      const existente = vendidos.find((vendido) => vendido.id === item.id)

      if (existente) {
        existente.cantidad = existente.cantidad + item.cantidad
      } else {
        vendidos.push({ id: item.id, nombre: item.nombre, cantidad: item.cantidad })
      }
    })
  })

  return vendidos.sort((a, b) => b.cantidad - a.cantidad)
}

export function obtenerCarrito() {
  return leer('carrito', [])
}

export function guardarCarrito(carrito) {
  guardar('carrito', carrito)
}

export function precioFinal(producto) {
  return producto.oferta ? producto.precioOferta : producto.precio
}

export function calcularTotal(items) {
  let total = 0

  items.forEach((item) => {
    total = total + item.precio * item.cantidad
  })

  return total
}

export function descontarStock(items) {
  items.forEach((item) => {
    const producto = obtenerProductoPorId(item.id)

    if (producto) {
      actualizarProducto(item.id, { stock: Math.max(0, producto.stock - item.cantidad) })
    }
  })
}

export function simularPago() {
  return Math.random() > 0.3
}

// ---------- Descuentos y promociones (Forma C) ----------

export const CODIGO_PROMO = 'FELICES50'
export const EDAD_DESCUENTO = 50
export const PORCENTAJE_EDAD = 50
export const PORCENTAJE_CODIGO = 10

export function calcularEdad(fechaNacimiento, hoy = new Date()) {
  if (!fechaNacimiento) {
    return null
  }

  const [anio, mes, dia] = fechaNacimiento.split('-').map(Number)
  let edad = hoy.getFullYear() - anio

  if (hoy.getMonth() + 1 < mes || (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)) {
    edad = edad - 1
  }

  return edad
}

export function esCorreoDuoc(correo) {
  return !!correo && correo.toLowerCase().endsWith('@duoc.cl')
}

export function esCumpleanos(fechaNacimiento, hoy = new Date()) {
  if (!fechaNacimiento) {
    return false
  }

  const [, mes, dia] = fechaNacimiento.split('-').map(Number)
  return hoy.getMonth() + 1 === mes && hoy.getDate() === dia
}

// Entrega el mayor descuento que le corresponde al usuario (no se suman).
export function obtenerDescuento(usuario, hoy = new Date()) {
  if (!usuario) {
    return { porcentaje: 0, motivo: '' }
  }

  const edad = calcularEdad(usuario.fechaNacimiento, hoy)

  if (edad !== null && edad > EDAD_DESCUENTO) {
    return { porcentaje: PORCENTAJE_EDAD, motivo: 'Descuento por ser mayor de 50 años' }
  }

  if (usuario.codigo && usuario.codigo.toUpperCase() === CODIGO_PROMO) {
    return { porcentaje: PORCENTAJE_CODIGO, motivo: 'Descuento de por vida con el codigo ' + CODIGO_PROMO }
  }

  return { porcentaje: 0, motivo: '' }
}

// Estudiantes Duoc (correo @duoc.cl) reciben una torta gratis el dia de su cumpleaños.
export function obtenerTortaGratis(usuario, items, hoy = new Date()) {
  if (!usuario || !esCorreoDuoc(usuario.correo) || !esCumpleanos(usuario.fechaNacimiento, hoy)) {
    return null
  }

  const tortas = items.filter((item) => item.nombre.toLowerCase().startsWith('torta'))

  if (tortas.length === 0) {
    return null
  }

  return tortas.reduce((barata, item) => (item.precio < barata.precio ? item : barata))
}

export function calcularResumen(items, usuario, hoy = new Date()) {
  const subtotal = calcularTotal(items)
  const gratis = obtenerTortaGratis(usuario, items, hoy)
  const montoGratis = gratis ? gratis.precio : 0
  const descuento = obtenerDescuento(usuario, hoy)
  const montoDescuento = Math.round(((subtotal - montoGratis) * descuento.porcentaje) / 100)

  return {
    subtotal: subtotal,
    porcentaje: descuento.porcentaje,
    motivo: descuento.motivo,
    montoDescuento: montoDescuento,
    tortaGratis: gratis ? gratis.nombre : '',
    montoGratis: montoGratis,
    total: subtotal - montoGratis - montoDescuento,
  }
}

// ---------- Estado de los pedidos ----------

export const ESTADOS_PEDIDO = ['En preparacion', 'Listo para despacho', 'En camino', 'Entregado']

export function estadoDeOrden(orden) {
  return orden.estado || ESTADOS_PEDIDO[0]
}

export function actualizarEstadoOrden(id, estado) {
  const ordenes = obtenerOrdenes().map((orden) =>
    orden.id === id ? { ...orden, estado: estado } : orden
  )
  guardar('ordenes', ordenes)
}

export function obtenerOrdenesDeUsuario(usuarioId) {
  return obtenerOrdenes().filter((orden) => orden.usuarioId === usuarioId)
}

// ---------- Recomendaciones segun el historial de compras ----------

export function obtenerRecomendados(usuario, cantidad = 3) {
  const productos = obtenerProductos().filter((producto) => producto.stock > 0)
  const compradas = {}
  const comprados = []

  if (usuario) {
    obtenerOrdenesDeUsuario(usuario.id).forEach((orden) => {
      orden.items.forEach((item) => {
        comprados.push(item.id)
        const producto = productos.find((candidato) => candidato.id === item.id)

        if (producto) {
          compradas[producto.categoria] = (compradas[producto.categoria] || 0) + item.cantidad
        }
      })
    })
  }

  const preferencia = usuario && usuario.preferencia ? usuario.preferencia : ''
  const personalizado = comprados.length > 0 || preferencia !== ''
  const candidatos = productos.filter((producto) => !comprados.includes(producto.id))
  const puntaje = (producto) =>
    (compradas[producto.categoria] || 0) * 10 + (producto.categoria === preferencia ? 5 : 0)

  candidatos.sort((a, b) => puntaje(b) - puntaje(a))

  return { personalizado: personalizado, productos: candidatos.slice(0, cantidad) }
}
