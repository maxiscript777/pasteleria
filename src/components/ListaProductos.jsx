import { Col, Row } from 'react-bootstrap'
import ProductCard from './ProductCard'

function ListaProductos({ productos, onAgregar }) {
  if (productos.length === 0) {
    return <p>No se encontraron productos.</p>
  }

  return (
    <Row className="g-4">
      {productos.map((producto) => (
        <Col key={producto.id} xs={12} md={6} lg={4}>
          <ProductCard producto={producto} onAgregar={onAgregar} />
        </Col>
      ))}
    </Row>
  )
}

export default ListaProductos
