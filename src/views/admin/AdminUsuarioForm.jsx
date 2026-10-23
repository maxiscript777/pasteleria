import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import CampoForm from '../../components/CampoForm'
import {
  actualizarUsuario,
  buscarUsuarioPorCorreo,
  crearUsuario,
  obtenerUsuarios,
} from '../../data/db'
import { validarUsuario } from '../../data/validaciones'

function AdminUsuarioForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [datos, setDatos] = useState({ nombre: '', apellidos: '', correo: '', clave: '', rol: 'Cliente' })
  const [errores, setErrores] = useState({})

  useEffect(() => {
    if (id) {
      const usuario = obtenerUsuarios().find((item) => item.id === Number(id))

      if (usuario) {
        setDatos(usuario)
      }
    }
  }, [id])

  function cambiar(event) {
    setDatos({ ...datos, [event.target.name]: event.target.value })
  }

  function guardar(event) {
    event.preventDefault()
    const nuevosErrores = validarUsuario(datos)
    const repetido = buscarUsuarioPorCorreo(datos.correo)

    if (repetido && repetido.id !== Number(id)) {
      nuevosErrores.correo = 'Ese correo ya esta registrado'
    }

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    if (id) {
      actualizarUsuario(Number(id), datos)
    } else {
      crearUsuario(datos)
    }

    navigate('/admin/usuarios')
  }

  return (
    <Card>
      <Card.Body>
        <h1 className="h3 mb-3">{id ? 'Editar usuario' : 'Nuevo usuario'}</h1>

        <form onSubmit={guardar} noValidate>
          <Row>
            <Col md={6}>
              <CampoForm id="nombre" etiqueta="Nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} />
            </Col>
            <Col md={6}>
              <CampoForm id="apellidos" etiqueta="Apellidos" valor={datos.apellidos} onChange={cambiar} />
            </Col>
          </Row>

          <CampoForm id="correo" etiqueta="Correo" tipo="email" valor={datos.correo} onChange={cambiar} error={errores.correo} />
          <CampoForm id="clave" etiqueta="Contraseña" tipo="password" valor={datos.clave} onChange={cambiar} error={errores.clave} />

          <Form.Group className="mb-3" controlId="rol">
            <Form.Label>Rol</Form.Label>
            <Form.Select name="rol" value={datos.rol} onChange={cambiar}>
              <option value="Administrador">Administrador</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Cliente">Cliente</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit">Guardar</Button>
            <Button variant="secondary" onClick={() => navigate('/admin/usuarios')}>Cancelar</Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  )
}

export default AdminUsuarioForm
