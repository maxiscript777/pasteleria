import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { obtenerOrdenes, obtenerProductos, obtenerUsuarios } from '../../data/db'

const ACCESOS = [
  { titulo: 'Ordenes', ruta: '/admin/ordenes', texto: 'Revisa las compras y sus boletas.' },
  { titulo: 'Productos', ruta: '/admin/productos', texto: 'Crea, edita y elimina productos.' },
  { titulo: 'Categorias', ruta: '/admin/categorias', texto: 'Organiza los productos por categoria.' },
  { titulo: 'Usuarios', ruta: '/admin/usuarios', texto: 'Mira y cambia las cuentas de usuarios.' },
  { titulo: 'Reportes', ruta: '/admin/reportes', texto: 'Ventas y productos mas vendidos.' },
  { titulo: 'Perfil', ruta: '/admin/perfil', texto: 'Tus datos de administrador.' },
]

function AdminDashboard() {
  const ordenes = obtenerOrdenes()
  const productos = obtenerProductos()
  const usuarios = obtenerUsuarios()

  return (
    <>
      <h1 className="h3">Dashboard</h1>
      <p className="text-muted">Resumen de la tienda</p>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card bg="primary" text="white">
            <Card.Body>
              <Card.Title>Compras</Card.Title>
              <p className="fs-3 mb-0">{ordenes.length}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg="success" text="white">
            <Card.Body>
              <Card.Title>Productos</Card.Title>
              <p className="fs-3 mb-0">{productos.length}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg="warning">
            <Card.Body>
              <Card.Title>Usuarios</Card.Title>
              <p className="fs-3 mb-0">{usuarios.length}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        {ACCESOS.map((acceso) => (
          <Col key={acceso.ruta} sm={6} lg={4}>
            <Card as={Link} to={acceso.ruta} className="h-100 text-decoration-none shadow-sm">
              <Card.Body>
                <Card.Title>{acceso.titulo}</Card.Title>
                <Card.Text>{acceso.texto}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default AdminDashboard
