import { useState } from 'react'
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import CampoForm from '../components/CampoForm'
import { iniciarSesion } from '../data/db'

function LoginView({ onLogin }) {
  const navigate = useNavigate()
  const [datos, setDatos] = useState({ correo: '', clave: '' })
  const [error, setError] = useState('')

  function cambiar(event) {
    setDatos({ ...datos, [event.target.name]: event.target.value })
  }

  function enviar(event) {
    event.preventDefault()
    const usuario = iniciarSesion(datos.correo, datos.clave)

    if (!usuario) {
      setError('Correo o contraseña incorrectos')
      return
    }

    onLogin(usuario)
    navigate(usuario.rol === 'Administrador' ? '/admin' : '/')
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h1 className="h3 mb-3">Iniciar sesion</h1>

              {error && <Alert variant="danger">{error}</Alert>}

              <form onSubmit={enviar}>
                <CampoForm id="correo" etiqueta="Correo" tipo="email" valor={datos.correo} onChange={cambiar} autoComplete="email" />
                <CampoForm id="clave" etiqueta="Contraseña" tipo="password" valor={datos.clave} onChange={cambiar} autoComplete="current-password" />
                <Button type="submit" className="w-100">Ingresar</Button>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginView
