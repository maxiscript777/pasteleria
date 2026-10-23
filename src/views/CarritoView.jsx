import { Button, Container, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ResumenCompra from '../components/ResumenCompra'
import { calcularResumen } from '../data/db'

function CarritoView({ carrito, usuario, onCambiarCantidad, onEliminar, onLimpiar }) {
  const resumen = calcularResumen(carrito, usuario)
  const total = resumen.total

  if (carrito.length === 0) {
    return (
      <Container className="py-4">
        <h1>Carrito</h1>
        <p>Tu carrito esta vacio.</p>
        <Button as={Link} to="/productos">Ver productos</Button>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Carrito</h1>

      <Table responsive bordered>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((item) => (
            <tr key={item.id}>
              <td><img src={item.imagen} alt={item.nombre} className="cart-image" /></td>
              <td>
                {item.nombre}
                {item.mensaje && <div className="small fst-italic">Mensaje: {item.mensaje}</div>}
              </td>
              <td>${item.precio.toLocaleString('es-CL')}</td>
              <td>
                <Button size="sm" variant="outline-secondary" onClick={() => onCambiarCantidad(item.id, -1)}>-</Button>
                <span className="mx-2">{item.cantidad}</span>
                <Button size="sm" variant="outline-secondary" onClick={() => onCambiarCantidad(item.id, 1)}>+</Button>
              </td>
              <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
              <td>
                <Button size="sm" variant="danger" onClick={() => onEliminar(item.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ResumenCompra resumen={resumen} />

      <h3 className="text-end">Total: ${total.toLocaleString('es-CL')}</h3>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onLimpiar}>Limpiar</Button>
        <Button as={Link} to="/comprar" variant="success">Comprar ahora</Button>
      </div>
    </Container>
  )
}

export default CarritoView
