import { useState } from 'react'
import { Button } from 'react-bootstrap'

// Botones para compartir una torta o una promocion en redes sociales.
// "ruta" es la direccion dentro de la tienda (ej: /producto/TC001).
function CompartirRedes({ texto, ruta }) {
  const [copiado, setCopiado] = useState(false)
  const url = window.location.origin + ruta
  const mensaje = encodeURIComponent(texto)
  const enlace = encodeURIComponent(url)

  function copiar() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => setCopiado(true))
    }
  }

  return (
    <div className="mt-3">
      <p className="mb-2 fw-bold">Compartir en redes sociales</p>
      <div className="d-flex flex-wrap gap-2">
        <Button
          as="a"
          size="sm"
          variant="outline-primary"
          href={`https://wa.me/?text=${mensaje}%20${enlace}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </Button>
        <Button
          as="a"
          size="sm"
          variant="outline-primary"
          href={`https://www.facebook.com/sharer/sharer.php?u=${enlace}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </Button>
        <Button
          as="a"
          size="sm"
          variant="outline-primary"
          href={`https://twitter.com/intent/tweet?text=${mensaje}&url=${enlace}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          X (Twitter)
        </Button>
        <Button size="sm" variant="outline-primary" onClick={copiar}>
          {copiado ? 'Enlace copiado' : 'Copiar enlace'}
        </Button>
      </div>
    </div>
  )
}

export default CompartirRedes
