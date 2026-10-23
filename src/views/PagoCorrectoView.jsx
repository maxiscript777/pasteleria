import { useState } from 'react'
import { Alert, Button, Card, Container } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import SeguimientoPedido from '../components/SeguimientoPedido'
import TablaItems from '../components/TablaItems'
import { estadoDeOrden, obtenerOrdenPorId } from '../data/db'

function PagoCorrectoView() {
  const { id } = useParams()
  const orden = obtenerOrdenPorId(Number(id))
  const [mensaje, setMensaje] = useState('')

  if (!orden) {
    return (
      <Container className="py-4">
        <h2>Orden no encontrada</h2>
        <Button as={Link} to="/">Volver al inicio</Button>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h1 className="h3 text-success">Compra realizada, nro #{orden.id}</h1>
          <p className="text-muted">Fecha: {orden.fecha}</p>

          <p>
            <strong>Cliente:</strong> {orden.cliente.nombre} {orden.cliente.apellidos} ({orden.cliente.correo})
          </p>
          <p>
            <strong>Direccion:</strong> {orden.direccion.calle} {orden.direccion.depto}, {orden.direccion.comuna}, {orden.direccion.region}
          </p>
          {orden.direccion.indicaciones && (
            <p><strong>Indicaciones:</strong> {orden.direccion.indicaciones}</p>
          )}

          {orden.fechaEntrega && (
            <p><strong>Fecha de entrega preferida:</strong> {orden.fechaEntrega.split('-').reverse().join('-')}</p>
          )}

          <TablaItems items={orden.items} />

          {orden.descuento && orden.descuento.porcentaje > 0 && (
            <p className="text-end text-success mb-1">
              {orden.descuento.motivo} ({orden.descuento.porcentaje}%): -${orden.descuento.monto.toLocaleString('es-CL')}
            </p>
          )}
          {orden.montoTortaGratis > 0 && (
            <p className="text-end text-success mb-1">
              Torta gratis de cumpleaños ({orden.tortaGratis}): -${orden.montoTortaGratis.toLocaleString('es-CL')}
            </p>
          )}

          <h3 className="text-center">Total pagado: ${orden.total.toLocaleString('es-CL')}</h3>

          <SeguimientoPedido estado={estadoDeOrden(orden)} />

          {mensaje && <Alert variant="info" className="mt-3">{mensaje}</Alert>}

          <div className="d-flex justify-content-center gap-2 mt-3">
            <Button variant="danger" onClick={() => window.print()}>Imprimir boleta en PDF</Button>
            <Button variant="success" onClick={() => setMensaje('Boleta enviada a ' + orden.cliente.correo)}>
              Enviar boleta por email
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default PagoCorrectoView
