import { useState } from 'react'
import { Alert, Button, Card } from 'react-bootstrap'
import CampoForm from '../../components/CampoForm'

function AdminPerfil({ usuario, onGuardar }) {
  const [datos, setDatos] = useState({ nombre: usuario.nombre, apellidos: usuario.apellidos })
  const [error, setError] = useState('')
  const [guardado, setGuardado] = useState(false)

  function cambiar(event) {
    setDatos({ ...datos, [event.target.name]: event.target.value })
  }

  function guardar(event) {
    event.preventDefault()

    if (datos.nombre.trim() === '') {
      setError('Ingresa tu nombre')
      setGuardado(false)
      return
    }

    onGuardar(datos)
    setError('')
    setGuardado(true)
  }

  return (
    <Card>
      <Card.Body>
        <h1 className="h3 mb-3">Perfil</h1>
        <p><strong>Correo:</strong> {usuario.correo}</p>
        <p><strong>Rol:</strong> {usuario.rol}</p>

        {guardado && <Alert variant="success">Datos actualizados</Alert>}

        <form onSubmit={guardar} noValidate>
          <CampoForm id="nombre" etiqueta="Nombre" valor={datos.nombre} onChange={cambiar} error={error} />
          <CampoForm id="apellidos" etiqueta="Apellidos" valor={datos.apellidos} onChange={cambiar} />
          <Button type="submit">Guardar</Button>
        </form>
      </Card.Body>
    </Card>
  )
}

export default AdminPerfil
