import { useState } from 'react'
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap'
import CampoForm from '../components/CampoForm'
import { validarContacto } from '../data/validaciones'

function ContactoView() {
  const [datos, setDatos] = useState({ nombre: '', correo: '', mensaje: '' })
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  function cambiar(event) {
    setDatos({ ...datos, [event.target.name]: event.target.value })
  }

  function enviar(event) {
    event.preventDefault()
    const nuevosErrores = validarContacto(datos)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      setEnviado(false)
      return
    }

    setEnviado(true)
    setDatos({ nombre: '', correo: '', mensaje: '' })
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h1 className="h3 mb-3">Contacto</h1>

              {enviado && <Alert variant="success">Mensaje enviado. Te responderemos pronto.</Alert>}

              <form onSubmit={enviar} noValidate>
                <CampoForm id="nombre" etiqueta="Nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} autoComplete="name" />
                <CampoForm id="correo" etiqueta="Correo" tipo="email" valor={datos.correo} onChange={cambiar} error={errores.correo} autoComplete="email" />
                <CampoForm id="mensaje" etiqueta="Mensaje" as="textarea" filas={4} valor={datos.mensaje} onChange={cambiar} error={errores.mensaje} />
                <Button type="submit">Enviar</Button>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ContactoView
