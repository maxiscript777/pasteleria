import {
  ESTADOS_PEDIDO,
  actualizarCategoria,
  actualizarEstadoOrden,
  calcularEdad,
  calcularResumen,
  esCumpleanos,
  estadoDeOrden,
  obtenerCategorias,
  obtenerDescuento,
  obtenerRecomendados,
  obtenerTortaGratis,
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  calcularTotal,
  crearOrden,
  crearUsuario,
  descontarStock,
  iniciarSesion,
  obtenerCarrito,
  obtenerMasVendidos,
  obtenerOrdenPorId,
  precioFinal,
  obtenerProductoPorId,
  obtenerProductos,
} from '../data/db'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('db de productos', () => {
  it('la primera vez entrega los productos iniciales', () => {
    expect(obtenerProductos().length).toBe(16)
  })

  it('crearProducto agrega un producto nuevo', () => {
    crearProducto({ id: 'X1', nombre: 'Alfajor', categoria: 'Postres', precio: 1000 })

    expect(obtenerProductos().length).toBe(17)
    expect(obtenerProductoPorId('X1').nombre).toBe('Alfajor')
  })

  it('actualizarProducto cambia solo los datos indicados', () => {
    actualizarProducto('TC001', { precio: 47000 })

    expect(obtenerProductoPorId('TC001').precio).toBe(47000)
    expect(obtenerProductoPorId('TC001').nombre).toBe('Torta cuadrada de chocolate')
  })

  it('eliminarProducto quita el producto de la lista', () => {
    eliminarProducto('TC001')

    expect(obtenerProductoPorId('TC001')).toBeUndefined()
    expect(obtenerProductos().length).toBe(15)
  })

  it('el carrito comienza vacio', () => {
    expect(obtenerCarrito()).toEqual([])
  })

  it('precioFinal usa el precio de oferta cuando el producto esta en oferta', () => {
    expect(precioFinal({ precio: 1000, oferta: true, precioOferta: 800 })).toBe(800)
    expect(precioFinal({ precio: 1000, oferta: false, precioOferta: 0 })).toBe(1000)
  })

  it('calcularTotal suma precio por cantidad de cada producto', () => {
    const items = [{ precio: 1000, cantidad: 2 }, { precio: 500, cantidad: 1 }]

    expect(calcularTotal(items)).toBe(2500)
  })

  it('iniciarSesion entrega el usuario solo con la clave correcta', () => {
    expect(iniciarSesion('admin@duoc.cl', 'admin123').rol).toBe('Administrador')
    expect(iniciarSesion('admin@duoc.cl', 'otra')).toBeUndefined()
  })

  it('crearUsuario le asigna un id nuevo', () => {
    const nuevo = crearUsuario({ nombre: 'Ana', correo: 'ana@duoc.cl', clave: 'abcd', rol: 'Cliente' })

    expect(nuevo.id).toBe(3)
  })

  it('crearOrden guarda la orden y se puede buscar por id', () => {
    const orden = crearOrden({ total: 5000, items: [] })

    expect(obtenerOrdenPorId(orden.id).total).toBe(5000)
  })

  it('obtenerMasVendidos suma las unidades y ordena de mayor a menor', () => {
    crearOrden({ total: 0, items: [{ id: 'A', nombre: 'Torta A', cantidad: 1 }, { id: 'B', nombre: 'Torta B', cantidad: 5 }] })
    crearOrden({ total: 0, items: [{ id: 'A', nombre: 'Torta A', cantidad: 2 }] })

    const lista = obtenerMasVendidos()

    expect(lista[0].nombre).toBe('Torta B')
    expect(lista[1].cantidad).toBe(3)
  })

  it('actualizarCategoria tambien cambia la categoria de sus productos', () => {
    actualizarCategoria(5, 'Veganos')

    expect(obtenerProductoPorId('PV001').categoria).toBe('Veganos')
  })

  it('descontarStock resta lo comprado y nunca deja el stock en negativo', () => {
    descontarStock([{ id: 'P1001', cantidad: 3 }, { id: 'PV001', cantidad: 5 }])

    expect(obtenerProductoPorId('P1001').stock).toBe(17)
    expect(obtenerProductoPorId('PV001').stock).toBe(0)
  })
})

describe('catalogo de la Forma C', () => {
  it('trae las 8 categorias del caso', () => {
    expect(obtenerCategorias().length).toBe(8)
  })

  it('agrega los productos nuevos a un navegador que ya tenia el catalogo anterior', () => {
    localStorage.setItem('productos', JSON.stringify([{ id: 'TC001', nombre: 'Torta cuadrada de chocolate', categoria: 'Tortas cuadradas', precio: 1, stock: 1 }]))
    localStorage.setItem('categorias', JSON.stringify([{ id: 1, nombre: 'Tortas cuadradas' }]))

    expect(obtenerProductoPorId('TE002').nombre).toBe('Torta especial de boda')
    expect(obtenerCategorias().length).toBe(8)
  })

  it('despues de actualizar el catalogo respeta los productos que borra el administrador', () => {
    obtenerProductos()
    eliminarProducto('TE002')

    expect(obtenerProductoPorId('TE002')).toBeUndefined()
  })
})

describe('descuentos y promociones', () => {
  const hoy = new Date(2026, 9, 23)

  it('calcularEdad descuenta un año si todavia no cumple', () => {
    expect(calcularEdad('1970-10-23', hoy)).toBe(56)
    expect(calcularEdad('1970-10-24', hoy)).toBe(55)
    expect(calcularEdad('', hoy)).toBeNull()
  })

  it('un usuario mayor de 50 años recibe 50% de descuento', () => {
    expect(obtenerDescuento({ fechaNacimiento: '1960-05-10' }, hoy).porcentaje).toBe(50)
  })

  it('el codigo FELICES50 da 10% de descuento', () => {
    expect(obtenerDescuento({ fechaNacimiento: '2000-01-01', codigo: 'FELICES50' }, hoy).porcentaje).toBe(10)
    expect(obtenerDescuento({ codigo: 'OTRO' }, hoy).porcentaje).toBe(0)
  })

  it('los descuentos no se suman: se aplica el mayor', () => {
    expect(obtenerDescuento({ fechaNacimiento: '1950-01-01', codigo: 'FELICES50' }, hoy).porcentaje).toBe(50)
  })

  it('sin usuario no hay descuento', () => {
    expect(obtenerDescuento(null, hoy).porcentaje).toBe(0)
  })

  it('esCumpleanos compara solo el dia y el mes', () => {
    expect(esCumpleanos('2001-10-23', hoy)).toBe(true)
    expect(esCumpleanos('2001-10-22', hoy)).toBe(false)
  })

  it('un estudiante Duoc recibe la torta mas barata gratis el dia de su cumpleaños', () => {
    const usuario = { correo: 'ana@duoc.cl', fechaNacimiento: '2002-10-23' }
    const items = [
      { id: 'TE001', nombre: 'Torta especial de cumpleaños', precio: 55000, cantidad: 1 },
      { id: 'TT001', nombre: 'Torta circular de vainilla', precio: 40000, cantidad: 1 },
      { id: 'P1001', nombre: 'Mousse de chocolate', precio: 5000, cantidad: 1 },
    ]

    expect(obtenerTortaGratis(usuario, items, hoy).id).toBe('TT001')
    expect(obtenerTortaGratis({ ...usuario, correo: 'ana@gmail.com' }, items, hoy)).toBeNull()
    expect(obtenerTortaGratis(usuario, items, new Date(2026, 9, 24))).toBeNull()
  })

  it('calcularResumen aplica el descuento sobre el subtotal', () => {
    const items = [{ id: 'P1001', nombre: 'Mousse de chocolate', precio: 5000, cantidad: 2 }]
    const resumen = calcularResumen(items, { fechaNacimiento: '1950-01-01' }, hoy)

    expect(resumen.subtotal).toBe(10000)
    expect(resumen.montoDescuento).toBe(5000)
    expect(resumen.total).toBe(5000)
  })

  it('calcularResumen sin usuario entrega el total normal', () => {
    const resumen = calcularResumen([{ id: 'A', nombre: 'Torta A', precio: 1000, cantidad: 3 }], null, hoy)

    expect(resumen.total).toBe(3000)
    expect(resumen.porcentaje).toBe(0)
  })
})

describe('estado de los pedidos', () => {
  it('una orden nueva parte en preparacion y el administrador puede cambiarla', () => {
    const orden = crearOrden({ total: 1000, items: [] })

    expect(estadoDeOrden(orden)).toBe(ESTADOS_PEDIDO[0])

    actualizarEstadoOrden(orden.id, 'Entregado')

    expect(estadoDeOrden(obtenerOrdenPorId(orden.id))).toBe('Entregado')
  })
})

describe('recomendaciones', () => {
  it('sin compras entrega productos con stock', () => {
    const { personalizado, productos } = obtenerRecomendados(null, 3)

    expect(personalizado).toBe(false)
    expect(productos.length).toBe(3)
  })

  it('recomienda productos de la categoria que el usuario ya compro y no repite lo comprado', () => {
    crearOrden({ usuarioId: 2, total: 5000, items: [{ id: 'P1001', nombre: 'Mousse de chocolate', cantidad: 1 }] })

    const { personalizado, productos } = obtenerRecomendados({ id: 2 }, 3)

    expect(personalizado).toBe(true)
    expect(productos[0].id).toBe('P1002')
    expect(productos.some((producto) => producto.id === 'P1001')).toBe(false)
  })

  it('usa la categoria favorita del perfil', () => {
    const { productos } = obtenerRecomendados({ id: 9, preferencia: 'Productos sin gluten' }, 2)

    expect(productos[0].categoria).toBe('Productos sin gluten')
  })
})
