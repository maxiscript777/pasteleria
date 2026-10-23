import { Button, Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { obtenerOrdenes, obtenerUsuarios } from '../../data/db'

function AdminHistorial() {
  const { id } = useParams()
  const usuario = obtenerUsuarios().find((item) => item.id === Number(id))
  const ordenes = obtenerOrdenes().filter((orden) => orden.usuarioId === Number(id))

  return (
    <>
      <h1 className="h3 mb-3">
        Historial de compras{usuario ? ` de ${usuario.nombre}` : ''}
      </h1>

      {ordenes.length === 0 && <p>Este usuario todavia no tiene compras.</p>}

      {ordenes.length > 0 && (
        <Table responsive bordered>
          <thead>
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Boleta</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id}>
                <td>#{orden.id}</td>
                <td>{orden.fecha}</td>
                <td>${orden.total.toLocaleString('es-CL')}</td>
                <td>
                  <Button as={Link} to={`/admin/ordenes/${orden.id}`} size="sm">Ver boleta</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Button as={Link} to="/admin/usuarios" variant="secondary">Volver</Button>
    </>
  )
}

export default AdminHistorial
