import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { precioFinal } from '../data/db'

function ProductCard({ producto, onAgregar }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={producto.imagen}
        alt={producto.nombre}
        className="product-image"
      />

      <Card.Body className="d-flex flex-column">
        <Card.Title>{producto.nombre}</Card.Title>
        <Card.Text>{producto.categoria}</Card.Text>
        <Card.Text className="fw-bold">
          {producto.oferta && (
            <span className="text-decoration-line-through text-muted me-2">
              ${producto.precio.toLocaleString('es-CL')}
            </span>
          )}
          ${precioFinal(producto).toLocaleString('es-CL')}
        </Card.Text>

        <div className="mt-auto d-flex gap-2">
          <Button as={Link} to={`/producto/${producto.id}`} variant="outline-primary">
            Ver detalle
          </Button>
          <Button onClick={() => onAgregar(producto)}>Agregar</Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ProductCard
