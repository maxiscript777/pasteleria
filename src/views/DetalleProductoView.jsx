import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import CompartirRedes from '../components/CompartirRedes'
import { esPersonalizable, origenDe, tamanoDe } from '../data/catalogoInfo'
import { obtenerProductoPorId, precioFinal } from '../data/db'

function DetalleProductoView({ onAgregar }) {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setProducto(obtenerProductoPorId(id))
  }, [id])

  if (!producto) {
    return (
      <Container className="py-4">
        <h2>Producto no encontrado</h2>
        <Button as={Link} to="/productos">Volver a productos</Button>
      </Container>
    )
  }

  function agregar() {
    if (cantidad < 1 || cantidad > producto.stock) {
      setError('La cantidad debe estar entre 1 y ' + producto.stock)
      return
    }

    setError('')
    const extras = {}

    if (esPersonalizable(producto) && mensaje.trim() !== '') {
      extras.mensaje = mensaje.trim()
    }

    onAgregar(producto, cantidad, extras)
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Row className="g-4">
            <Col md={6}>
              <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded" />
            </Col>

            <Col md={6}>
              <h1>{producto.nombre}</h1>
              <p>{producto.descripcion}</p>
              <p className="fs-4 fw-bold">
                {producto.oferta && (
                  <span className="text-decoration-line-through text-muted me-2">
                    ${producto.precio.toLocaleString('es-CL')}
                  </span>
                )}
                ${precioFinal(producto).toLocaleString('es-CL')}
              </p>
              <p>Stock disponible: {producto.stock}</p>
              <p>
                <Badge bg="secondary" className="me-2">{producto.categoria}</Badge>
                {tamanoDe(producto) && <Badge bg="info" text="dark">Tamaño: {tamanoDe(producto)}</Badge>}
              </p>
              <p className="small"><strong>Origen de la receta:</strong> {origenDe(producto)}</p>

              {error && <Alert variant="danger">{error}</Alert>}

              <Row>
                <Col xs={6} sm={4}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="cantidad">Cantidad</Form.Label>
                    <Form.Control
                      id="cantidad"
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(event) => setCantidad(Number(event.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {esPersonalizable(producto) && (
                <Form.Group className="mb-3" controlId="mensaje">
                  <Form.Label>Mensaje personalizado (opcional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    maxLength={60}
                    placeholder="Ej: Feliz cumpleaños Ana"
                    value={mensaje}
                    onChange={(event) => setMensaje(event.target.value)}
                  />
                  <Form.Text>Maximo 60 caracteres. Lo escribiremos sobre tu torta.</Form.Text>
                </Form.Group>
              )}

              <Button onClick={agregar} className="me-2">Agregar al carrito</Button>
              <Button as={Link} to="/productos" variant="secondary">Volver</Button>

              <CompartirRedes
                texto={`Mira ${producto.nombre} en Pasteleria 1000 sabores`}
                ruta={`/producto/${producto.id}`}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default DetalleProductoView
