import { Button, Card } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import TablaItems from '../../components/TablaItems'
import { estadoDeOrden, obtenerOrdenPorId } from '../../data/db'

function AdminBoleta() {
  const { id } = useParams()
  const orden = obtenerOrdenPorId(Number(id))

  if (!orden) {
    return (
      <>
        <h1 className="h3">Boleta no encontrada</h1>
        <Button as={Link} to="/admin/ordenes">Volver a ordenes</Button>
      </>
    )
  }

  return (
    <Card>
      <Card.Body>
        <h1 className="h3">Boleta #{orden.id}</h1>
        <p className="text-muted">Fecha: {orden.fecha}</p>
        <p>
          <strong>Cliente:</strong> {orden.cliente.nombre} {orden.cliente.apellidos} ({orden.cliente.correo})
        </p>
        <p>
          <strong>Direccion:</strong> {orden.direccion.calle} {orden.direccion.depto}, {orden.direccion.comuna}, {orden.direccion.region}
        </p>
        <p><strong>Estado:</strong> {estadoDeOrden(orden)}</p>
        {orden.fechaEntrega && (
          <p><strong>Fecha de entrega preferida:</strong> {orden.fechaEntrega.split('-').reverse().join('-')}</p>
        )}
        <TablaItems items={orden.items} />
        {orden.descuento && orden.descuento.porcentaje > 0 && (
          <p className="text-end mb-1">
            {orden.descuento.motivo} ({orden.descuento.porcentaje}%): -${orden.descuento.monto.toLocaleString('es-CL')}
          </p>
        )}
        {orden.montoTortaGratis > 0 && (
          <p className="text-end mb-1">
            Torta gratis de cumpleaños ({orden.tortaGratis}): -${orden.montoTortaGratis.toLocaleString('es-CL')}
          </p>
        )}
        <h3 className="text-end">Total: ${orden.total.toLocaleString('es-CL')}</h3>
        <Button as={Link} to="/admin/ordenes" variant="secondary">Volver</Button>
      </Card.Body>
    </Card>
  )
}

export default AdminBoleta
