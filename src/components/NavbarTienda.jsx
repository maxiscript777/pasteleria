import { Badge, Button, Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { obtenerCategorias } from '../data/db'

function NavbarTienda({ cantidadCarrito, totalCarrito, usuario, onCerrarSesion }) {
  const categorias = obtenerCategorias()

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center gap-2">
          <img src="/img/logo.png" alt="" className="brand-logo" />
          Pasteleria 1000 sabores
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
            <NavDropdown title="Categorias" id="menu-categorias">
              <NavDropdown.Item as={NavLink} to="/categorias" end>Todas</NavDropdown.Item>
              {categorias.map((categoria) => (
                <NavDropdown.Item
                  key={categoria.id}
                  as={NavLink}
                  to={`/categorias/${categoria.id}`}
                >
                  {categoria.nombre}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <Nav.Link as={NavLink} to="/ofertas">Ofertas</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/blogs">Blog</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
            {usuario && usuario.rol === 'Administrador' && (
              <Nav.Link as={NavLink} to="/admin">Panel admin</Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-lg-center text-nowrap">
            <Nav.Link as={NavLink} to="/carrito">
              Carrito <Badge bg="warning" text="dark">{cantidadCarrito}</Badge> ${totalCarrito.toLocaleString('es-CL')}
            </Nav.Link>

            {usuario ? (
              <>
                <Nav.Link as={NavLink} to="/mis-pedidos">Mis pedidos</Nav.Link>
                <Nav.Link as={NavLink} to="/perfil">Mi perfil</Nav.Link>
                <span className="navbar-text me-lg-2">Hola, {usuario.nombre}</span>
                <Button variant="outline-light" size="sm" onClick={onCerrarSesion}>
                  Cerrar sesion
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Iniciar sesion</Nav.Link>
                <Button as={NavLink} to="/registro" size="sm">Crear cuenta</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarTienda
