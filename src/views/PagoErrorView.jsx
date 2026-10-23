import { Button, Card, Container } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import TablaItems from '../components/TablaItems'

function PagoErrorView() {
  const location = useLocation()
  const orden = location.state ? location.state.orden : null

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h1 className="h3 text-danger">No se pudo realizar el pago</h1>

          {orden ? (
            <>
              <p>
                <strong>Cliente:</strong> {orden.cliente.nombre} {orden.cliente.apellidos} ({orden.cliente.correo})
              </p>
              <TablaItems items={orden.items} />
              <h3 className="text-center">Total: ${orden.total.toLocaleString('es-CL')}</h3>
            </>
          ) : (
            <p>Ocurrio un problema con tu compra.</p>
          )}

          <div className="text-center mt-3">
            <Button as={Link} to="/comprar" variant="success">Volver a realizar el pago</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default PagoErrorView
