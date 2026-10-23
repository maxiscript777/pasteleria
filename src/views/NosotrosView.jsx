import { Card, Col, Container, Row } from 'react-bootstrap'

function NosotrosView() {
  return (
    <Container className="py-4">
      <h1 className="mb-3">Nosotros</h1>
      <p>
        Somos la Pasteleria 1000 sabores. Hace 50 años que hacemos tortas y
        postres para las fiestas de nuestros clientes, y siempre usamos buenos
        ingredientes.
      </p>

      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Mision</Card.Title>
              <Card.Text>
                Hacer tortas y postres ricos, con sabor de siempre y
                opciones para todos los gustos.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Vision</Card.Title>
              <Card.Text>
                Ser la pasteleria favorita de las familias chilenas y
                llegar a mas hogares.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-1 align-items-center">
        <Col md={5}>
          <img src="/img/equipo.jpg" alt="Equipo de la Pasteleria 1000 sabores" className="img-fluid rounded shadow-sm" />
        </Col>
        <Col md={7}>
          <h2 className="h4">Nuestra historia</h2>
          <p>
            Pasteleria 1000 sabores celebra su 50 aniversario como un referente de la reposteria
            chilena. En 1995 participamos en un record Guinness al colaborar en la creacion de la
            torta mas grande del mundo, y desde entonces seguimos creando recetas con el mismo
            cariño de siempre.
          </p>
          <p>
            Cada receta tradicional tiene su historia: en la ficha de cada producto cuentas con el
            origen de la preparacion.
          </p>
        </Col>
      </Row>

      <Card className="shadow-sm mt-4">
        <Card.Body>
          <Card.Title as="h2" className="h4">Impacto comunitario</Card.Title>
          <Card.Text>
            Tus compras apoyan a los estudiantes de gastronomia de Duoc, que participan en la
            creacion de nuestras recetas y en los consejos del blog. Asi aportamos a la formacion de
            nuevos talentos y fortalecemos a la comunidad local.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default NosotrosView
