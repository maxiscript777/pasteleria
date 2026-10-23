import { Container } from 'react-bootstrap'
import CompartirRedes from '../components/CompartirRedes'
import ListaProductos from '../components/ListaProductos'
import { obtenerProductos } from '../data/db'

function OfertasView({ onAgregar }) {
  const ofertas = obtenerProductos().filter((producto) => producto.oferta)

  return (
    <Container className="py-4">
      <h1 className="mb-4">Ofertas</h1>
      <ListaProductos productos={ofertas} onAgregar={onAgregar} />
      <CompartirRedes texto="Mira las ofertas de Pasteleria 1000 sabores" ruta="/ofertas" />
    </Container>
  )
}

export default OfertasView
