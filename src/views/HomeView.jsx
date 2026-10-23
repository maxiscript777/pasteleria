import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ListaProductos from '../components/ListaProductos'
import {
  esCorreoDuoc,
  esCumpleanos,
  obtenerCategorias,
  obtenerProductos,
  obtenerRecomendados,
  precioFinal,
} from '../data/db'

function HomeView({ onAgregar, usuario }) {
  const ofertas = obtenerProductos().filter((producto) => producto.oferta)
  const categorias = obtenerCategorias()
  const recomendados = obtenerRecomendados(usuario, 8)
  const sugeridos = recomendados.productos.filter((producto) => !producto.oferta).slice(0, 3)
  const cumpleDuoc = usuario && esCorreoDuoc(usuario.correo) && esCumpleanos(usuario.fechaNacimiento)

  return (
    <Container className="py-4">
      {cumpleDuoc && (
        <Alert variant="success">
          ¡Feliz cumpleaños, {usuario.nombre}! Hoy tienes una torta gratis en tu compra por ser estudiante Duoc.
        </Alert>
      )}

      <Row className="align-items-center g-4 mb-5">
        <Col md={6}>
          <h1>50 años de dulzura y tradicion</h1>
          <p className="lead">
            Tortas y postres para cada ocasion, hechos como siempre
            en Chile.
          </p>
          <Button as={Link} to="/productos" size="lg" className="me-2">Ver catalogo</Button>
          <Button as={Link} to="/ofertas" size="lg" variant="outline-primary">Ver ofertas</Button>
        </Col>
        <Col md={6}>
          <img src="/img/torta_circ_vainilla.jpg" alt="Torta de vainilla" className="detail-image rounded shadow" />
        </Col>
      </Row>

      <h2 className="mb-3">Ofertas destacadas</h2>
      <ListaProductos productos={ofertas} onAgregar={onAgregar} />

      {sugeridos.length > 0 && (
        <>
          <h2 className="mt-5 mb-3">
            {recomendados.personalizado ? 'Recomendados para ti' : 'Te pueden gustar'}
          </h2>
          <Row className="g-3">
            {sugeridos.map((producto) => (
              <Col key={producto.id} md={4}>
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex align-items-center gap-3">
                    <img src={producto.imagen} alt={producto.nombre} className="cart-image" />
                    <div className="flex-grow-1">
                      <Card.Title className="fs-6 mb-1">{producto.nombre}</Card.Title>
                      <Card.Text className="mb-1 small">${precioFinal(producto).toLocaleString('es-CL')}</Card.Text>
                      <Link to={`/producto/${producto.id}`}>Ver producto</Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      <h2 className="mt-5 mb-3">Categorias</h2>
      <Row className="g-3">
        {categorias.map((categoria) => (
          <Col key={categoria.id} xs={6} md={4} lg>
            <Card
              as={Link}
              to={`/categorias/${categoria.id}`}
              className="h-100 text-center text-decoration-none shadow-sm"
            >
              <Card.Body>{categoria.nombre}</Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default HomeView
