import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

const producto = {
  id: 'P1001',
  nombre: 'Mousse de chocolate',
  categoria: 'Postres individuales',
  precio: 5000,
  imagen: '/img/mousse_choc.jpg',
}

function mostrarTarjeta(onAgregar) {
  render(
    <MemoryRouter>
      <ProductCard producto={producto} onAgregar={onAgregar} />
    </MemoryRouter>
  )
}

describe('ProductCard', () => {
  it('muestra el nombre y la categoria recibidos por props', () => {
    mostrarTarjeta(jasmine.createSpy('funcion'))

    expect(screen.getByText('Mousse de chocolate')).toBeTruthy()
    expect(screen.getByText('Postres individuales')).toBeTruthy()
  })

  it('el boton Ver detalle apunta a la ruta del producto', () => {
    mostrarTarjeta(jasmine.createSpy('funcion'))

    const enlace = screen.getByRole('button', { name: /ver detalle/i })
    expect(enlace.getAttribute('href')).toBe('/producto/P1001')
  })

  it('al presionar Agregar llama a onAgregar con el producto', async () => {
    const user = userEvent.setup()
    const onAgregar = jasmine.createSpy('funcion')
    mostrarTarjeta(onAgregar)

    await user.click(screen.getByRole('button', { name: /agregar/i }))

    expect(onAgregar).toHaveBeenCalledTimes(1)
    expect(onAgregar).toHaveBeenCalledWith(producto)
  })
})
