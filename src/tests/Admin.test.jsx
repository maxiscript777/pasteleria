import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { crearOrden, obtenerProductoPorId, obtenerUsuarios } from '../data/db'

const admin = { id: 1, nombre: 'Admin', apellidos: 'Tienda', correo: 'admin@duoc.cl', rol: 'Administrador' }
const cliente = { id: 2, nombre: 'Cliente', apellidos: 'Demo', correo: 'cliente@gmail.com', rol: 'Cliente' }

function mostrarAdmin(ruta, usuario) {
  if (usuario) {
    sessionStorage.setItem('usuarioActual', JSON.stringify(usuario))
  }

  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  )
}

describe('Panel de admin', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('sin sesion no deja entrar al panel', () => {
    mostrarAdmin('/admin')

    expect(screen.getByText('No puedes entrar aqui')).toBeTruthy()
  })

  it('un cliente tampoco puede entrar al panel', () => {
    mostrarAdmin('/admin', cliente)

    expect(screen.getByText('No puedes entrar aqui')).toBeTruthy()
  })

  it('el administrador ve el dashboard', () => {
    mostrarAdmin('/admin', admin)

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeTruthy()
    expect(screen.getByText('Compras')).toBeTruthy()
  })

  it('crea un producto nuevo desde el formulario', async () => {
    const user = userEvent.setup()
    mostrarAdmin('/admin/productos/nuevo', admin)

    await user.type(screen.getByLabelText('Codigo'), 'X1')
    await user.type(screen.getByLabelText('Nombre'), 'Alfajor')
    await user.type(screen.getByLabelText('Precio'), '1500')
    await user.type(screen.getByLabelText('Stock'), '10')
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(obtenerProductoPorId('X1').nombre).toBe('Alfajor')
    expect(screen.getByText('Alfajor')).toBeTruthy()
  })

  it('no deja crear un producto con un codigo repetido', async () => {
    const user = userEvent.setup()
    mostrarAdmin('/admin/productos/nuevo', admin)

    await user.type(screen.getByLabelText('Codigo'), 'TC001')
    await user.type(screen.getByLabelText('Nombre'), 'Otra torta')
    await user.type(screen.getByLabelText('Precio'), '1000')
    await user.type(screen.getByLabelText('Stock'), '5')
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(screen.getByText('Ya existe un producto con ese codigo')).toBeTruthy()
  })

  it('la lista de criticos solo muestra productos con poco stock', () => {
    mostrarAdmin('/admin/criticos', admin)

    expect(screen.getByText('Torta vegana de chocolate')).toBeTruthy()
    expect(screen.queryByText('Mousse de chocolate')).toBeNull()
  })

  it('el boton +10 stock aumenta el stock del producto', async () => {
    const user = userEvent.setup()
    mostrarAdmin('/admin/criticos', admin)

    await user.click(screen.getAllByRole('button', { name: '+10 stock' })[0])

    expect(obtenerProductoPorId('TT002').stock).toBe(12)
  })

  it('agrega una categoria nueva a la lista', async () => {
    const user = userEvent.setup()
    mostrarAdmin('/admin/categorias', admin)

    await user.type(screen.getByLabelText('Nueva categoria'), 'Alfajores')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(screen.getByText('Alfajores')).toBeTruthy()
  })

  it('no deja eliminar una categoria que tiene productos', async () => {
    const user = userEvent.setup()
    mostrarAdmin('/admin/categorias', admin)

    await user.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    expect(screen.getByText('No se puede eliminar: la categoria tiene productos')).toBeTruthy()
  })

  it('el reporte avisa cuando todavia no hay ventas', () => {
    mostrarAdmin('/admin/reportes', admin)

    expect(screen.getByText('Todavia no hay ventas.')).toBeTruthy()
  })

  describe('con una orden registrada', () => {
    beforeEach(() => {
      crearOrden({
        usuarioId: 2,
        fecha: '22-10-2026',
        cliente: { nombre: 'Cliente', apellidos: 'Demo', correo: 'cliente@gmail.com' },
        direccion: { calle: 'Los Olmos 123', depto: '', region: 'Region del Biobio', comuna: 'Concepcion', indicaciones: '' },
        items: [{ id: 'P1001', nombre: 'Mousse de chocolate', precio: 5000, imagen: '/img/mousse_choc.jpg', cantidad: 2 }],
        total: 10000,
      })
    })

    it('la lista de ordenes muestra la compra con su total', () => {
      mostrarAdmin('/admin/ordenes', admin)

      expect(screen.getByText('#1')).toBeTruthy()
      expect(screen.getByText('$10.000')).toBeTruthy()
    })

    it('la boleta muestra el detalle de la orden', () => {
      mostrarAdmin('/admin/ordenes/1', admin)

      expect(screen.getByText('Boleta #1')).toBeTruthy()
      expect(screen.getByText('Mousse de chocolate')).toBeTruthy()
    })

    it('una boleta que no existe muestra un aviso', () => {
      mostrarAdmin('/admin/ordenes/99', admin)

      expect(screen.getByText('Boleta no encontrada')).toBeTruthy()
    })

    it('el historial del usuario muestra sus compras', () => {
      mostrarAdmin('/admin/usuarios/2/compras', admin)

      expect(screen.getByText('Historial de compras de Cliente')).toBeTruthy()
      expect(screen.getByText('#1')).toBeTruthy()
    })

    it('el historial de un usuario sin compras lo indica', () => {
      mostrarAdmin('/admin/usuarios/1/compras', admin)

      expect(screen.getByText('Este usuario todavia no tiene compras.')).toBeTruthy()
    })

    it('el reporte muestra los productos mas vendidos', () => {
      mostrarAdmin('/admin/reportes', admin)

      expect(screen.getByText('Mousse de chocolate')).toBeTruthy()
    })
  })

  it('la lista de usuarios muestra los correos registrados', () => {
    mostrarAdmin('/admin/usuarios', admin)

    expect(screen.getByText('cliente@gmail.com')).toBeTruthy()
  })

  it('crea un usuario nuevo desde el formulario', async () => {
    const user = userEvent.setup()
    mostrarAdmin('/admin/usuarios/nuevo', admin)

    await user.type(screen.getByLabelText('Nombre'), 'Luis')
    await user.type(screen.getByLabelText('Correo'), 'luis@duoc.cl')
    await user.type(screen.getByLabelText('Contraseña'), 'abcd')
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(obtenerUsuarios().length).toBe(3)
    expect(screen.getByText('luis@duoc.cl')).toBeTruthy()
  })

  it('el formulario de usuario muestra errores si faltan datos', async () => {
    const user = userEvent.setup()
    mostrarAdmin('/admin/usuarios/nuevo', admin)

    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(screen.getByText('Ingresa el nombre')).toBeTruthy()
  })

  it('elimina un producto cuando se confirma', async () => {
    spyOn(window, 'confirm').and.returnValue(true)
    const user = userEvent.setup()
    mostrarAdmin('/admin/productos', admin)

    await user.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    expect(obtenerProductoPorId('TC001')).toBeUndefined()
  })

  it('no elimina el producto si se cancela la confirmacion', async () => {
    spyOn(window, 'confirm').and.returnValue(false)
    const user = userEvent.setup()
    mostrarAdmin('/admin/productos', admin)

    await user.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    expect(obtenerProductoPorId('TC001')).toBeDefined()
  })

  it('el perfil guarda el nombre nuevo del administrador', async () => {
    const user = userEvent.setup()
    mostrarAdmin('/admin/perfil', admin)

    await user.clear(screen.getByLabelText('Nombre'))
    await user.type(screen.getByLabelText('Nombre'), 'Jefe')
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(screen.getByText('Datos actualizados')).toBeTruthy()
    expect(obtenerUsuarios()[0].nombre).toBe('Jefe')
  })

  it('el perfil no deja guardar un nombre vacio', async () => {
    const user = userEvent.setup()
    mostrarAdmin('/admin/perfil', admin)

    await user.clear(screen.getByLabelText('Nombre'))
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(screen.getByText('Ingresa tu nombre')).toBeTruthy()
  })
})
