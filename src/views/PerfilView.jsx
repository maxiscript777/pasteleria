import { useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import CampoForm from '../components/CampoForm'
import { obtenerCategorias, obtenerDescuento } from '../data/db'
import { validarPerfil } from '../data/validaciones'

// Perfil del cliente: datos personales y preferencias de compra.
function PerfilView({ usuario, onGuardar }) {
  const [datos, setDatos] = useState({
    nombre: usuario ? usuario.nombre : '',
    apellidos: usuario ? usuario.apellidos : '',
    fechaNacimiento: usuario && usuario.fechaNacimiento ? usuario.fechaNacimiento : '',
    codigo: usuario && usuario.codigo ? usuario.codigo : '',
    preferencia: usuario && usuario.preferencia ? usuario.preferencia : '',
  })
  const [errores, setErrores] = useState({})
  const [guardado, setGuardado] = useState(false)
  const categorias = obtenerCategorias()

  if (!usuario) {
    return (
      <Container className="py-4">
        <h1>Mi perfil</h1>
        <p>Debes iniciar sesion para ver tu perfil.</p>
        <Button as={Link} to="/login">Iniciar sesion</Button>
      </Container>
    )
  }

  const descuento = obtenerDescuento({ ...usuario, ...datos })

  function cambiar(event) {
    setDatos({ ...datos, [event.target.name]: event.target.value })
    setGuardado(false)
  }

  function guardar(event) {
    event.preventDefault()
    const nuevosErrores = validarPerfil(datos)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      setGuardado(false)
      return
    }

    onGuardar({ ...datos, codigo: datos.codigo.trim().toUpperCase() })
    setGuardado(true)
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h1 className="h3 mb-3">Mi perfil</h1>
              <p><strong>Correo:</strong> {usuario.correo}</p>

              {descuento.porcentaje > 0 && (
                <Alert variant="success">
                  {descuento.motivo}: {descuento.porcentaje}% en tus compras.
                </Alert>
              )}

              {guardado && <Alert variant="success">Datos actualizados</Alert>}

              <form onSubmit={guardar} noValidate>
                <CampoForm id="nombre" etiqueta="Nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} />
                <CampoForm id="apellidos" etiqueta="Apellidos" valor={datos.apellidos} onChange={cambiar} />
                <CampoForm id="fechaNacimiento" etiqueta="Fecha de nacimiento" tipo="date" valor={datos.fechaNacimiento} onChange={cambiar} error={errores.fechaNacimiento} />
                <CampoForm id="codigo" etiqueta="Codigo promocional" valor={datos.codigo} onChange={cambiar} error={errores.codigo} placeholder="Ej: FELICES50" />

                <Form.Group className="mb-3" controlId="preferencia">
                  <Form.Label>Categoria favorita (preferencia de compra)</Form.Label>
                  <Form.Select name="preferencia" value={datos.preferencia} onChange={cambiar}>
                    <option value="">Sin preferencia</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.nombre}>{categoria.nombre}</option>
                    ))}
                  </Form.Select>
                  <Form.Text>La usamos para recomendarte productos en la portada.</Form.Text>
                </Form.Group>

                <Button type="submit">Guardar cambios</Button>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default PerfilView
