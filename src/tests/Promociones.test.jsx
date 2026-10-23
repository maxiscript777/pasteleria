import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import CompartirRedes from '../components/CompartirRedes'
import SeguimientoPedido from '../components/SeguimientoPedido'
import CarritoView from '../views/CarritoView'
import { crearOrden, obtenerOrdenPorId } from '../data/db'

const admin = { id: 1, nombre: 'Admin', apellidos: 'Tienda', correo: 'admin@duoc.cl', rol: 'Administrador' }
const mayor = { id: 2, nombre: 'Rosa', apellidos: 'Soto', correo: 'rosa@gmail.com', rol: 'Cliente', fechaNacimiento: '1950-03-15' }

function mostrarApp(ruta) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  )
}

describe('Catalogo, filtros y personalizacion', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('el catalogo muestra los productos nuevos de la Forma C', () => {
    mostrarApp('/productos')

    expect(screen.getByText('Torta especial de boda')).toBeTruthy()
    expect(screen.getByText('Brownie sin gluten')).toBeTruthy()
  })

  it('filtrar por tipo Circular oculta las tortas cuadradas', async () => {
    const user = userEvent.setup()
    mostrarApp('/productos')

    await user.selectOptions(screen.getByLabelText('Filtrar por tipo de torta'), 'Circular')

    expect(screen.getByText('Torta circular de manjar')).toBeTruthy()
    expect(screen.queryByText('Torta cuadrada de frutas')).toBeNull()
  })

  it('filtrar por tamaño Individual muestra solo los postres individuales', async () => {
    const user = userEvent.setup()
    mostrarApp('/productos')

    await user.selectOptions(screen.getByLabelText('Filtrar por tamaño'), 'Individual')

    expect(screen.getByText('Mousse de chocolate')).toBeTruthy()
    expect(screen.queryByText('Torta especial de boda')).toBeNull()
  })

  it('el mensaje personalizado de una torta se guarda en el carrito', async () => {
    const user = userEvent.setup()
    mostrarApp('/producto/TE001')

    await user.type(screen.getByLabelText('Mensaje personalizado (opcional)'), 'Feliz cumpleaños Ana')
    await user.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(JSON.parse(localStorage.getItem('carrito'))[0].mensaje).toBe('Feliz cumpleaños Ana')
  })

  it('un postre individual no ofrece mensaje personalizado', () => {
    mostrarApp('/producto/P1001')

    expect(screen.queryByLabelText('Mensaje personalizado (opcional)')).toBeNull()
  })

  it('el detalle muestra el origen de la receta', () => {
    mostrarApp('/producto/PT002')

    expect(screen.getByText(/Galicia/)).toBeTruthy()
  })

  it('la pagina nosotros muestra la seccion de impacto comunitario', () => {
    mostrarApp('/nosotros')

    expect(screen.getByText('Impacto comunitario')).toBeTruthy()
  })
})

describe('Registro con promociones', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('un codigo promocional incorrecto muestra un error', async () => {
    const user = userEvent.setup()
    mostrarApp('/registro')

    await user.type(screen.getByLabelText('Nombre'), 'Luis')
    await user.type(screen.getByLabelText('Correo'), 'luis@duoc.cl')
    await user.type(screen.getByLabelText('Contraseña'), 'abcd')
    await user.type(screen.getByLabelText('Repetir contraseña'), 'abcd')
    await user.type(screen.getByLabelText('Codigo promocional (opcional)'), 'MALO')
    await user.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(screen.getByText('El codigo promocional no es valido')).toBeTruthy()
  })

  it('el codigo FELICES50 queda guardado en el usuario nuevo', async () => {
    const user = userEvent.setup()
    mostrarApp('/registro')

    await user.type(screen.getByLabelText('Nombre'), 'Luis')
    await user.type(screen.getByLabelText('Correo'), 'luis@duoc.cl')
    await user.type(screen.getByLabelText('Contraseña'), 'abcd')
    await user.type(screen.getByLabelText('Repetir contraseña'), 'abcd')
    await user.type(screen.getByLabelText('Codigo promocional (opcional)'), 'felices50')
    await user.click(screen.getByRole('button', { name: 'Registrarme' }))

    const usuarios = JSON.parse(localStorage.getItem('usuarios'))

    expect(usuarios[usuarios.length - 1].codigo).toBe('FELICES50')
  })
})

describe('CarritoView con descuento', () => {
  const carrito = [
    { id: 'P1001', nombre: 'Mousse de chocolate', precio: 5000, imagen: '/img/mousse_choc.jpg', cantidad: 2 },
  ]

  function mostrarCarrito(usuario) {
    render(
      <MemoryRouter>
        <CarritoView carrito={carrito} usuario={usuario} onCambiarCantidad={() => {}} onEliminar={() => {}} />
      </MemoryRouter>
    )
  }

  it('un usuario mayor de 50 años paga la mitad', () => {
    mostrarCarrito(mayor)

    expect(screen.getByText('Total: $5.000')).toBeTruthy()
    expect(screen.getByText(/Descuento por ser mayor de 50 años/)).toBeTruthy()
  })

  it('un usuario sin descuento paga el subtotal', () => {
    mostrarCarrito({ ...mayor, fechaNacimiento: '2000-01-01' })

    expect(screen.getByText('Total: $10.000')).toBeTruthy()
    expect(screen.queryByText(/Descuento/)).toBeNull()
  })
})

describe('Seguimiento de pedidos', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('SeguimientoPedido muestra el estado recibido por props', () => {
    render(<SeguimientoPedido estado="En camino" />)

    expect(screen.getByText('Estado de tu pedido:', { exact: false })).toBeTruthy()
    expect(screen.getAllByText('En camino').length).toBeGreaterThan(0)
  })

  it('el administrador cambia el estado de una orden', async () => {
    const user = userEvent.setup()
    sessionStorage.setItem('usuarioActual', JSON.stringify(admin))
    const orden = crearOrden({
      usuarioId: 2,
      fecha: '23-10-2026',
      cliente: { nombre: 'Rosa', apellidos: 'Soto', correo: 'rosa@gmail.com' },
      direccion: { calle: 'Los Olmos 123', depto: '', region: 'Region del Biobio', comuna: 'Concepcion', indicaciones: '' },
      items: [{ id: 'P1001', nombre: 'Mousse de chocolate', precio: 5000, imagen: '/img/mousse_choc.jpg', cantidad: 2 }],
      total: 10000,
    })
    mostrarApp('/admin/ordenes')

    await user.selectOptions(screen.getByLabelText('Estado de la orden ' + orden.id), 'En camino')

    expect(obtenerOrdenPorId(orden.id).estado).toBe('En camino')
  })

  it('el cliente ve el estado de su pedido en Mis pedidos', () => {
    sessionStorage.setItem('usuarioActual', JSON.stringify(mayor))
    crearOrden({
      usuarioId: 2,
      fecha: '23-10-2026',
      cliente: { nombre: 'Rosa', apellidos: 'Soto', correo: 'rosa@gmail.com' },
      direccion: { calle: 'Los Olmos 123', depto: '', region: 'Region del Biobio', comuna: 'Concepcion', indicaciones: '' },
      items: [{ id: 'P1001', nombre: 'Mousse de chocolate', precio: 5000, imagen: '/img/mousse_choc.jpg', cantidad: 1 }],
      total: 5000,
      estado: 'En camino',
    })
    mostrarApp('/mis-pedidos')

    expect(screen.getByText(/Tu pedido #1 esta:/)).toBeTruthy()
  })

  it('Mis pedidos pide iniciar sesion si no hay usuario', () => {
    mostrarApp('/mis-pedidos')

    expect(screen.getByText('Debes iniciar sesion para ver tus pedidos.')).toBeTruthy()
  })
})

describe('Compartir en redes sociales', () => {
  it('muestra los enlaces para compartir la ruta recibida', () => {
    render(<CompartirRedes texto="Mira esta torta" ruta="/producto/TC001" />)

    const whatsapp = screen.getByText('WhatsApp')

    expect(whatsapp.getAttribute('href')).toContain('wa.me')
    expect(decodeURIComponent(whatsapp.getAttribute('href'))).toContain('/producto/TC001')
    expect(screen.getByText('Facebook')).toBeTruthy()
  })
})
