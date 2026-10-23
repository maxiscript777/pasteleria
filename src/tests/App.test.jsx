import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

function mostrarApp(ruta) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  )
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('la ruta /ofertas muestra solo los productos en oferta', () => {
    mostrarApp('/ofertas')

    expect(screen.getByText('Torta cuadrada de chocolate')).toBeTruthy()
    expect(screen.queryByText('Torta cuadrada de frutas')).toBeNull()
  })

  it('la ruta /categorias/:nombre filtra por categoria', () => {
    mostrarApp('/categorias/5')

    expect(screen.getByText('Torta vegana de chocolate')).toBeTruthy()
    expect(screen.queryByText('Mousse de chocolate')).toBeNull()
  })

  it('un login incorrecto muestra un mensaje de error', async () => {
    const user = userEvent.setup()
    mostrarApp('/login')

    await user.type(screen.getByLabelText('Correo'), 'nadie@duoc.cl')
    await user.type(screen.getByLabelText('Contraseña'), 'mala')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(screen.getByText('Correo o contraseña incorrectos')).toBeTruthy()
  })

  it('un login correcto muestra el nombre del usuario en la barra', async () => {
    const user = userEvent.setup()
    mostrarApp('/login')

    await user.type(screen.getByLabelText('Correo'), 'cliente@gmail.com')
    await user.type(screen.getByLabelText('Contraseña'), 'cliente1')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(screen.getByText('Hola, Cliente')).toBeTruthy()
  })

  it('agregar un producto actualiza el contador del carrito', async () => {
    const user = userEvent.setup()
    mostrarApp('/productos')

    await user.click(screen.getAllByRole('button', { name: 'Agregar' })[0])

    expect(screen.getByText('1')).toBeTruthy()
  })

  it('el pago exitoso crea la orden y muestra la boleta', async () => {
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
    await user.selectOptions(screen.getByLabelText('Region'), 'Region Metropolitana de Santiago')
    await user.selectOptions(screen.getByLabelText('Comuna'), 'Maipu')
    await user.click(screen.getByRole('button', { name: /pagar ahora/i }))

    expect(screen.getByText('Compra realizada, nro #1')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('carrito')).length).toBe(0)
  })

  it('el pago fallido muestra la pantalla de error y conserva el carrito', async () => {
    spyOn(Math, 'random').and.returnValue(0.1)
    localStorage.setItem('carrito', JSON.stringify([
      { id: 'P1001', nombre: 'Mousse de chocolate', precio: 5000, imagen: '/img/mousse_choc.jpg', cantidad: 1 },
    ]))
    const user = userEvent.setup()
    mostrarApp('/comprar')

    await user.type(screen.getByLabelText('Nombre'), 'Ana')
    await user.type(screen.getByLabelText('Apellidos'), 'Perez')
    await user.type(screen.getByLabelText('Correo'), 'ana@duoc.cl')
    await user.type(screen.getByLabelText('Calle'), 'Los Olmos 123')
    await user.selectOptions(screen.getByLabelText('Region'), 'Region de Valparaiso')
    await user.selectOptions(screen.getByLabelText('Comuna'), 'Quilpue')
    await user.click(screen.getByRole('button', { name: /pagar ahora/i }))

    expect(screen.getByText('No se pudo realizar el pago')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('carrito')).length).toBe(1)
  })
})
