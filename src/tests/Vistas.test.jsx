import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { obtenerProductoPorId, obtenerUsuarios } from '../data/db'

function mostrarApp(ruta) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  )
}

describe('Vistas de la tienda', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('el registro muestra un error por cada campo incorrecto', async () => {
    const user = userEvent.setup()
    mostrarApp('/registro')

    await user.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(screen.getByText('Ingresa tu nombre')).toBeTruthy()
    expect(screen.getByText('La contraseña debe tener entre 4 y 10 caracteres')).toBeTruthy()
  })

  it('un registro correcto crea el usuario y lleva al login', async () => {
    const user = userEvent.setup()
    mostrarApp('/registro')

    await user.type(screen.getByLabelText('Nombre'), 'Luis')
    await user.type(screen.getByLabelText('Correo'), 'luis@duoc.cl')
    await user.type(screen.getByLabelText('Contraseña'), 'abcd')
    await user.type(screen.getByLabelText('Repetir contraseña'), 'abcd')
    await user.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(obtenerUsuarios().length).toBe(3)
    expect(screen.getByRole('heading', { name: 'Iniciar sesion' })).toBeTruthy()
  })

  it('no deja registrar un correo que ya existe', async () => {
    const user = userEvent.setup()
    mostrarApp('/registro')

    await user.type(screen.getByLabelText('Nombre'), 'Otro')
    await user.type(screen.getByLabelText('Correo'), 'admin@duoc.cl')
    await user.type(screen.getByLabelText('Contraseña'), 'abcd')
    await user.type(screen.getByLabelText('Repetir contraseña'), 'abcd')
    await user.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(screen.getByText('Ese correo ya esta registrado')).toBeTruthy()
  })

  it('el formulario de contacto confirma el envio cuando los datos son correctos', async () => {
    const user = userEvent.setup()
    mostrarApp('/contacto')

    await user.type(screen.getByLabelText('Nombre'), 'Ana')
    await user.type(screen.getByLabelText('Correo'), 'ana@duoc.cl')
    await user.type(screen.getByLabelText('Mensaje'), 'Hola')
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(screen.getByText('Mensaje enviado. Te responderemos pronto.')).toBeTruthy()
  })

  it('el blog muestra los articulos y abre el detalle', () => {
    mostrarApp('/blog/1')

    expect(screen.getByRole('heading', { name: 'Como elegir la torta para tu fiesta' })).toBeTruthy()
  })

  it('un articulo que no existe muestra un aviso', () => {
    mostrarApp('/blog/99')

    expect(screen.getByText('Articulo no encontrado')).toBeTruthy()
  })

  it('la lista del blog muestra los dos articulos', () => {
    mostrarApp('/blogs')

    expect(screen.getAllByRole('button', { name: 'Leer mas' }).length).toBe(2)
  })

  it('la portada muestra las ofertas destacadas', () => {
    mostrarApp('/')

    expect(screen.getByText('Ofertas destacadas')).toBeTruthy()
    expect(screen.getAllByRole('button', { name: 'Agregar' }).length).toBe(3)
  })

  it('la pagina nosotros muestra la mision y la vision', () => {
    mostrarApp('/nosotros')

    expect(screen.getByText('Mision')).toBeTruthy()
    expect(screen.getByText('Vision')).toBeTruthy()
  })

  it('el detalle del producto no deja agregar mas unidades que el stock', async () => {
    const user = userEvent.setup()
    mostrarApp('/producto/TC001')

    await user.clear(screen.getByLabelText('Cantidad'))
    await user.type(screen.getByLabelText('Cantidad'), '99')
    await user.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(screen.getByText('La cantidad debe estar entre 1 y 10')).toBeTruthy()
  })

  it('el detalle del producto agrega la cantidad elegida al carrito', async () => {
    const user = userEvent.setup()
    mostrarApp('/producto/TC001')

    await user.clear(screen.getByLabelText('Cantidad'))
    await user.type(screen.getByLabelText('Cantidad'), '3')
    await user.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(JSON.parse(localStorage.getItem('carrito'))[0].cantidad).toBe(3)
  })

  it('un producto que no existe muestra un aviso', () => {
    mostrarApp('/producto/NOEXISTE')

    expect(screen.getByText('Producto no encontrado')).toBeTruthy()
  })

  it('la busqueda de productos filtra la lista por nombre', async () => {
    const user = userEvent.setup()
    mostrarApp('/productos')

    await user.type(screen.getByPlaceholderText('Buscar producto'), 'tiramisu')

    expect(screen.getByText('Tiramisu clasico')).toBeTruthy()
    expect(screen.queryByText('Mousse de chocolate')).toBeNull()
  })

  it('cerrar sesion vuelve a mostrar el enlace de iniciar sesion', async () => {
    const user = userEvent.setup()
    sessionStorage.setItem('usuarioActual', JSON.stringify({ id: 2, nombre: 'Cliente', apellidos: 'Demo', correo: 'cliente@gmail.com', rol: 'Cliente' }))
    mostrarApp('/')

    await user.click(screen.getByRole('button', { name: 'Cerrar sesion' }))

    expect(screen.getByText('Iniciar sesion')).toBeTruthy()
    expect(sessionStorage.getItem('usuarioActual')).toBeNull()
  })

  it('el carrito suma, resta y elimina productos', async () => {
    const user = userEvent.setup()
    localStorage.setItem('carrito', JSON.stringify([
      { id: 'P1001', nombre: 'Mousse de chocolate', precio: 5000, imagen: '/img/mousse_choc.jpg', cantidad: 1 },
    ]))
    mostrarApp('/carrito')

    await user.click(screen.getByRole('button', { name: '+' }))
    expect(screen.getByText('Total: $10.000')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: '-' }))
    await user.click(screen.getByRole('button', { name: '-' }))
    expect(screen.getByText('Tu carrito esta vacio.')).toBeTruthy()
  })

  it('despues de pagar se descuenta el stock de los productos comprados', async () => {
    spyOn(Math, 'random').and.returnValue(0.9)
    localStorage.setItem('carrito', JSON.stringify([
      { id: 'P1001', nombre: 'Mousse de chocolate', precio: 5000, imagen: '/img/mousse_choc.jpg', cantidad: 2 },
    ]))
    const user = userEvent.setup()
    mostrarApp('/comprar')

    await user.type(screen.getByLabelText('Nombre'), 'Ana')
    await user.type(screen.getByLabelText('Apellidos'), 'Perez')
    await user.type(screen.getByLabelText('Correo'), 'ana@duoc.cl')
    await user.type(screen.getByLabelText('Calle'), 'Los Olmos 123')
    await user.selectOptions(screen.getByLabelText('Region'), 'Region del Biobio')
    await user.selectOptions(screen.getByLabelText('Comuna'), 'Concepcion')
    await user.click(screen.getByRole('button', { name: /pagar ahora/i }))

    expect(obtenerProductoPorId('P1001').stock).toBe(18)
  })

  it('el checkout con la sesion iniciada completa los datos del cliente', () => {
    sessionStorage.setItem('usuarioActual', JSON.stringify({ id: 2, nombre: 'Cliente', apellidos: 'Demo', correo: 'cliente@gmail.com', rol: 'Cliente' }))
    localStorage.setItem('carrito', JSON.stringify([
      { id: 'P1001', nombre: 'Mousse de chocolate', precio: 5000, imagen: '/img/mousse_choc.jpg', cantidad: 1 },
    ]))
    mostrarApp('/comprar')

    expect(screen.getByLabelText('Correo').value).toBe('cliente@gmail.com')
  })
})
