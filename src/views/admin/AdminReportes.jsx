import { Card, Col, Row, Table } from 'react-bootstrap'
import { STOCK_CRITICO, obtenerMasVendidos, obtenerOrdenes, obtenerProductos } from '../../data/db'

function AdminReportes() {
  const ordenes = obtenerOrdenes()
  const criticos = obtenerProductos().filter((producto) => producto.stock <= STOCK_CRITICO)
  const masVendidos = obtenerMasVendidos().slice(0, 5)

  let ventas = 0
  ordenes.forEach((orden) => {
    ventas = ventas + orden.total
  })

  return (
    <>
      <h1 className="h3 mb-3">Reportes</h1>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Ventas totales</Card.Title>
              <p className="fs-4 mb-0">${ventas.toLocaleString('es-CL')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Ordenes</Card.Title>
              <p className="fs-4 mb-0">{ordenes.length}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Productos con poco stock</Card.Title>
              <p className="fs-4 mb-0">{criticos.length}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="h5">Productos mas vendidos</h2>

      {masVendidos.length === 0 && <p>Todavia no hay ventas.</p>}

      {masVendidos.length > 0 && (
        <Table responsive bordered>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Unidades vendidas</th>
            </tr>
          </thead>
          <tbody>
            {masVendidos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default AdminReportes
