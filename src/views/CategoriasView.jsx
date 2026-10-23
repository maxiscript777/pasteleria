import { Card, Col, Container, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import ListaProductos from '../components/ListaProductos'
import { obtenerCategorias, obtenerProductos } from '../data/db'

function CategoriasView({ onAgregar }) {
  const { id } = useParams()
  const categorias = obtenerCategorias()
  const seleccionada = categorias.find((categoria) => categoria.id === Number(id))
  const productos = obtenerProductos().filter(
    (producto) => !seleccionada || producto.categoria === seleccionada.nombre
  )

  return (
    <Container className="py-4">
      <h1 className="mb-4">Categorias</h1>

      <Row className="g-3 mb-4">
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

      <h2 className="h4 mb-3">{seleccionada ? seleccionada.nombre : 'Todos los productos'}</h2>
      <ListaProductos productos={productos} onAgregar={onAgregar} />
    </Container>
  )
}

export default CategoriasView
