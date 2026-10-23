import { Alert, Badge, Button, Container, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { estadoDeOrden, obtenerOrdenesDeUsuario } from '../data/db'

// Lista de pedidos del cliente con su estado y avisos de los que todavia no se entregan.
function MisPedidosView({ usuario }) {
  if (!usuario) {
    return (
      <Container className="py-4">
        <h1>Mis pedidos</h1>
        <p>Debes iniciar sesion para ver tus pedidos.</p>
        <Button as={Link} to="/login">Iniciar sesion</Button>
      </Container>
    )
  }

  const ordenes = obtenerOrdenesDeUsuario(usuario.id)
  const pendientes = ordenes.filter((orden) => estadoDeOrden(orden) !== 'Entregado')

  return (
    <Container className="py-4">
      <h1 className="mb-3">Mis pedidos</h1>

      {pendientes.map((orden) => (
        <Alert key={orden.id} variant="info" className="py-2">
          Tu pedido #{orden.id} esta: <strong>{estadoDeOrden(orden)}</strong>
        </Alert>
      ))}

      {ordenes.length === 0 && <p>Todavia no has hecho compras.</p>}

      {ordenes.length > 0 && (
        <Table responsive bordered>
          <thead>
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id}>
                <td>#{orden.id}</td>
                <td>{orden.fecha}</td>
                <td>${orden.total.toLocaleString('es-CL')}</td>
                <td>
                  <Badge bg={estadoDeOrden(orden) === 'Entregado' ? 'success' : 'warning'} text={estadoDeOrden(orden) === 'Entregado' ? undefined : 'dark'}>
                    {estadoDeOrden(orden)}
                  </Badge>
                </td>
                <td>
                  <Button as={Link} to={`/pedido/${orden.id}`} size="sm">Ver seguimiento</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  )
}

export default MisPedidosView
