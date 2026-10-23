import { Alert, Badge, ProgressBar } from 'react-bootstrap'
import { ESTADOS_PEDIDO } from '../data/db'

// Muestra en que etapa va un pedido: desde la preparacion hasta la entrega.
function SeguimientoPedido({ estado }) {
  const posicion = ESTADOS_PEDIDO.indexOf(estado)
  const avance = ((posicion + 1) / ESTADOS_PEDIDO.length) * 100

  return (
    <div className="my-3">
      <h2 className="h5">Seguimiento del pedido</h2>

      <Alert variant={estado === 'Entregado' ? 'success' : 'info'} className="py-2">
        Estado de tu pedido: <strong>{estado}</strong>
      </Alert>

      <ProgressBar now={avance} variant={estado === 'Entregado' ? 'success' : 'warning'} className="mb-2" />

      <div className="d-flex justify-content-between flex-wrap gap-1">
        {ESTADOS_PEDIDO.map((nombre, indice) => (
          <Badge key={nombre} bg={indice <= posicion ? 'success' : 'secondary'}>
            {nombre}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export default SeguimientoPedido
