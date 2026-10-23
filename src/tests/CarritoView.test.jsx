import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CarritoView from '../views/CarritoView'

const carrito = [
  { id: 'P1001', nombre: 'Mousse de chocolate', precio: 5000, imagen: '/img/mousse_choc.jpg', cantidad: 2 },
  { id: 'P1002', nombre: 'Tiramisu clasico', precio: 5500, imagen: '/img/tiramisu.jpg', cantidad: 1 },
]

function mostrarCarrito(items, onCambiarCantidad = jasmine.createSpy('funcion'), onEliminar = jasmine.createSpy('funcion')) {
  render(
    <MemoryRouter>
      <CarritoView
        carrito={items}
        onCambiarCantidad={onCambiarCantidad}
        onEliminar={onEliminar}
      />
    </MemoryRouter>
  )
}

describe('CarritoView', () => {
  it('muestra un mensaje cuando el carrito esta vacio', () => {
    mostrarCarrito([])

    expect(screen.getByText('Tu carrito esta vacio.')).toBeTruthy()
  })

  it('muestra todos los productos y el total', () => {
    mostrarCarrito(carrito)

    expect(screen.getByText('Mousse de chocolate')).toBeTruthy()
    expect(screen.getByText('Tiramisu clasico')).toBeTruthy()
    expect(screen.getByText('Total: $15.500')).toBeTruthy()
  })

  it('el boton + llama a onCambiarCantidad con el id y 1', async () => {
    const user = userEvent.setup()
    const onCambiarCantidad = jasmine.createSpy('funcion')
    mostrarCarrito(carrito, onCambiarCantidad)

    await user.click(screen.getAllByRole('button', { name: '+' })[0])

    expect(onCambiarCantidad).toHaveBeenCalledWith('P1001', 1)
  })

  it('el boton Eliminar llama a onEliminar con el id', async () => {
    const user = userEvent.setup()
    const onEliminar = jasmine.createSpy('funcion')
    mostrarCarrito(carrito, jasmine.createSpy('funcion'), onEliminar)

    await user.click(screen.getAllByRole('button', { name: /eliminar/i })[1])

    expect(onEliminar).toHaveBeenCalledWith('P1002')
  })
})
