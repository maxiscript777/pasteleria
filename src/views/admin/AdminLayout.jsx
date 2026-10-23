import { Button, Col, Container, Nav, Row } from 'react-bootstrap'
import { Link, NavLink, Outlet } from 'react-router-dom'

function AdminLayout({ usuario, onCerrarSesion }) {
  if (!usuario || usuario.rol !== 'Administrador') {
    return (
      <Container className="py-4">
        <h2>No puedes entrar aqui</h2>
        <p>Debes iniciar sesion como administrador.</p>
        <Button as={Link} to="/login">Iniciar sesion</Button>
      </Container>
    )
  }

  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="bg-light border-end py-3">
          <h2 className="h6 text-muted">Panel de admin</h2>
          <Nav className="flex-column">
            <Nav.Link as={NavLink} to="/admin" end>Dashboard</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/ordenes">Ordenes</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/productos">Productos</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/categorias">Categorias</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/usuarios">Usuarios</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/reportes">Reportes</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/perfil">Perfil</Nav.Link>
          </Nav>
          <hr />
          <Button as={Link} to="/" variant="dark" className="w-100 mb-2">Tienda</Button>
          <Button variant="danger" className="w-100" onClick={onCerrarSesion}>Cerrar sesion</Button>
        </Col>

        <Col md={9} lg={10} className="py-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}

export default AdminLayout
