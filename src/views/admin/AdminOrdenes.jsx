import { useState } from 'react'
import { Button, Form, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ESTADOS_PEDIDO, actualizarEstadoOrden, estadoDeOrden, obtenerOrdenes } from '../../data/db'

function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState(obtenerOrdenes())

  function cambiarEstado(id, estado) {
    actualizarEstadoOrden(id, estado)
    setOrdenes(obtenerOrdenes())
  }

  return (
    <>
      <h1 className="h3 mb-3">Ordenes</h1>

      {ordenes.length === 0 && <p>Todavia no hay compras.</p>}

      {ordenes.length > 0 && (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Boleta</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id}>
                <td>#{orden.id}</td>
                <td>{orden.fecha}</td>
                <td>{orden.cliente.nombre} {orden.cliente.apellidos}</td>
                <td>${orden.total.toLocaleString('es-CL')}</td>
                <td>
                  <Form.Select
                    size="sm"
                    aria-label={`Estado de la orden ${orden.id}`}
                    value={estadoDeOrden(orden)}
                    onChange={(event) => cambiarEstado(orden.id, event.target.value)}
                  >
                    {ESTADOS_PEDIDO.map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </Form.Select>
                </td>
                <td>
                  <Button as={Link} to={`/admin/ordenes/${orden.id}`} size="sm">Ver boleta</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default AdminOrdenes
