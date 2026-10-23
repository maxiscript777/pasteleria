import { useEffect, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import ListaProductos from '../components/ListaProductos'
import { TAMANOS, tamanoDe, tipoDe } from '../data/catalogoInfo'
import { obtenerProductos } from '../data/db'

function ProductosView({ onAgregar }) {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [tipo, setTipo] = useState('')
  const [tamano, setTamano] = useState('')

  useEffect(() => {
    setProductos(obtenerProductos())
  }, [])

  const categorias = []
  productos.forEach((producto) => {
    if (!categorias.includes(producto.categoria)) {
      categorias.push(producto.categoria)
    }
  })

  const filtrados = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (categoria === '' || producto.categoria === categoria) &&
      (tipo === '' || tipoDe(producto) === tipo) &&
      (tamano === '' || tamanoDe(producto) === tamano)
  )

  return (
    <Container className="py-4">
      <h1 className="mb-4">Productos</h1>

      <Row className="g-3 mb-4">
        <Col md={12} lg={4}>
          <Form.Control
            placeholder="Buscar producto"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </Col>
        <Col md={4} lg={3}>
          <Form.Select
            aria-label="Filtrar por categoria"
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
          >
            <option value="">Todas las categorias</option>
            {categorias.map((nombre) => (
              <option key={nombre} value={nombre}>{nombre}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4} lg={2}>
          <Form.Select
            aria-label="Filtrar por tipo de torta"
            value={tipo}
            onChange={(event) => setTipo(event.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="Cuadrada">Cuadrada</option>
            <option value="Circular">Circular</option>
          </Form.Select>
        </Col>
        <Col md={4} lg={3}>
          <Form.Select
            aria-label="Filtrar por tamaño"
            value={tamano}
            onChange={(event) => setTamano(event.target.value)}
          >
            <option value="">Todos los tamaños</option>
            {TAMANOS.map((nombre) => (
              <option key={nombre} value={nombre}>{nombre}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <ListaProductos productos={filtrados} onAgregar={onAgregar} />
    </Container>
  )
}

export default ProductosView
