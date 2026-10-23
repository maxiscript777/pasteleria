import { CODIGO_PROMO } from './db'

export function correoValido(correo) {
  const dominios = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com']
  return dominios.some((dominio) => correo.endsWith(dominio))
}

export function claveValida(clave) {
  return clave.length >= 4 && clave.length <= 10
}

export function validarRegistro(datos) {
  const errores = {}

  if (datos.nombre.trim() === '') {
    errores.nombre = 'Ingresa tu nombre'
  }
  if (!correoValido(datos.correo)) {
    errores.correo = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com'
  }
  if (!claveValida(datos.clave)) {
    errores.clave = 'La contraseña debe tener entre 4 y 10 caracteres'
  }
  if (datos.repetir !== datos.clave) {
    errores.repetir = 'Las contraseñas no coinciden'
  }
  if (datos.fechaNacimiento && !fechaNacimientoValida(datos.fechaNacimiento)) {
    errores.fechaNacimiento = 'Ingresa una fecha de nacimiento valida'
  }
  if (datos.codigo && datos.codigo.trim().toUpperCase() !== CODIGO_PROMO) {
    errores.codigo = 'El codigo promocional no es valido'
  }

  return errores
}

// Fechas en formato AAAA-MM-DD (el mismo que usa <input type="date">).
function formatoFecha(fecha) {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${fecha.getFullYear()}-${mes}-${dia}`
}

export function fechaHoy() {
  return formatoFecha(new Date())
}

export function fechaManana() {
  const manana = new Date()
  manana.setDate(manana.getDate() + 1)

  return formatoFecha(manana)
}

export function fechaNacimientoValida(fecha) {
  const date = new Date(fecha + 'T00:00:00')
  const anio = Number(fecha.split('-')[0])

  return !isNaN(date.getTime()) && date <= new Date() && anio >= 1900
}

export function validarEnvio(datos) {
  const errores = {}

  if (datos.nombre.trim() === '') {
    errores.nombre = 'Ingresa tu nombre'
  }
  if (datos.apellidos.trim() === '') {
    errores.apellidos = 'Ingresa tus apellidos'
  }
  if (!correoValido(datos.correo)) {
    errores.correo = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com'
  }
  if (datos.calle.trim() === '') {
    errores.calle = 'Ingresa la calle'
  }
  if (datos.region === '') {
    errores.region = 'Selecciona una region'
  }
  if (datos.comuna === '') {
    errores.comuna = 'Selecciona una comuna'
  }
  if (datos.fechaEntrega && datos.fechaEntrega <= fechaHoy()) {
    errores.fechaEntrega = 'Elige una fecha de entrega desde mañana'
  }

  return errores
}

export function validarPerfil(datos) {
  const errores = {}

  if (datos.nombre.trim() === '') {
    errores.nombre = 'Ingresa tu nombre'
  }
  if (datos.fechaNacimiento && !fechaNacimientoValida(datos.fechaNacimiento)) {
    errores.fechaNacimiento = 'Ingresa una fecha de nacimiento valida'
  }
  if (datos.codigo && datos.codigo.trim().toUpperCase() !== CODIGO_PROMO) {
    errores.codigo = 'El codigo promocional no es valido'
  }

  return errores
}

export function validarContacto(datos) {
  const errores = {}

  if (datos.nombre.trim() === '') {
    errores.nombre = 'Ingresa tu nombre'
  }
  if (!correoValido(datos.correo)) {
    errores.correo = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com'
  }
  if (datos.mensaje.trim() === '' || datos.mensaje.length > 500) {
    errores.mensaje = 'Escribe un mensaje de maximo 500 caracteres'
  }

  return errores
}

export function validarProducto(datos) {
  const errores = {}

  if (datos.id.trim() === '') {
    errores.id = 'Ingresa el codigo'
  }
  if (datos.nombre.trim() === '') {
    errores.nombre = 'Ingresa el nombre'
  }
  if (!(Number(datos.precio) > 0)) {
    errores.precio = 'El precio debe ser mayor a 0'
  }
  if (datos.stock === '' || !Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0) {
    errores.stock = 'El stock debe ser un numero entero (0 o mas)'
  }
  if (datos.oferta && !(Number(datos.precioOferta) > 0 && Number(datos.precioOferta) < Number(datos.precio))) {
    errores.precioOferta = 'El precio de oferta debe ser menor al precio normal'
  }

  return errores
}

export function validarUsuario(datos) {
  const errores = {}

  if (datos.nombre.trim() === '') {
    errores.nombre = 'Ingresa el nombre'
  }
  if (!correoValido(datos.correo)) {
    errores.correo = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com'
  }
  if (!claveValida(datos.clave)) {
    errores.clave = 'La contraseña debe tener entre 4 y 10 caracteres'
  }

  return errores
}
