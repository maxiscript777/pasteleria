import { useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import CampoForm from '../components/CampoForm'
import { buscarUsuarioPorCorreo, crearUsuario } from '../data/db'
import { validarRegistro } from '../data/validaciones'

function RegistroView() {
  const navigate = useNavigate()
  const [datos, setDatos] = useState({ nombre: '', correo: '', clave: '', repetir: '', fechaNacimiento: '', codigo: '' })
  const [errores, setErrores] = useState({})

  function cambiar(event) {
    setDatos({ ...datos, [event.target.name]: event.target.value })
  }

  function enviar(event) {
    event.preventDefault()
    const nuevosErrores = validarRegistro(datos)

    if (Object.keys(nuevosErrores).length === 0 && buscarUsuarioPorCorreo(datos.correo)) {
      nuevosErrores.correo = 'Ese correo ya esta registrado'
    }

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    crearUsuario({
      nombre: datos.nombre,
      apellidos: '',
      correo: datos.correo,
      clave: datos.clave,
      rol: 'Cliente',
      fechaNacimiento: datos.fechaNacimiento,
      codigo: datos.codigo.trim().toUpperCase(),
    })
    navigate('/login')
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h1 className="h3 mb-3">Crear cuenta</h1>

              <form onSubmit={enviar} noValidate>
                <CampoForm id="nombre" etiqueta="Nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} autoComplete="name" />
                <CampoForm id="correo" etiqueta="Correo" tipo="email" valor={datos.correo} onChange={cambiar} error={errores.correo} autoComplete="email" />
                <CampoForm id="clave" etiqueta="Contraseña" tipo="password" valor={datos.clave} onChange={cambiar} error={errores.clave} autoComplete="new-password" />
                <CampoForm id="repetir" etiqueta="Repetir contraseña" tipo="password" valor={datos.repetir} onChange={cambiar} error={errores.repetir} autoComplete="new-password" />
                <CampoForm id="fechaNacimiento" etiqueta="Fecha de nacimiento (opcional)" tipo="date" valor={datos.fechaNacimiento} onChange={cambiar} error={errores.fechaNacimiento} />
                <CampoForm id="codigo" etiqueta="Codigo promocional (opcional)" valor={datos.codigo} onChange={cambiar} error={errores.codigo} placeholder="Ej: FELICES50" />
                <p className="small text-secondary">
                  Mayores de 50 años: 50% de descuento en todos los productos. Con el codigo FELICES50: 10% de descuento de por vida.
                  Estudiantes Duoc con correo @duoc.cl: torta gratis el dia de su cumpleaños.
                </p>
                <Button type="submit" className="w-100">Registrarme</Button>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default RegistroView
