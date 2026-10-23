import { useState } from 'react'
import { Alert, Button, Card, Table } from 'react-bootstrap'
import CampoForm from '../../components/CampoForm'
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  obtenerCategorias,
  obtenerProductos,
} from '../../data/db'

function AdminCategorias() {
  const [categorias, setCategorias] = useState(obtenerCategorias())
  const [nombre, setNombre] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')

  function guardar(event) {
    event.preventDefault()

    if (nombre.trim() === '') {
      setError('Ingresa el nombre de la categoria')
      return
    }

    if (editandoId) {
      actualizarCategoria(editandoId, nombre)
    } else {
      crearCategoria(nombre)
    }

    setNombre('')
    setEditandoId(null)
    setError('')
    setCategorias(obtenerCategorias())
  }

  function editar(categoria) {
    setEditandoId(categoria.id)
    setNombre(categoria.nombre)
  }

  function borrar(categoria) {
    const enUso = obtenerProductos().some((producto) => producto.categoria === categoria.nombre)

    if (enUso) {
      setError('No se puede eliminar: la categoria tiene productos')
      return
    }

    eliminarCategoria(categoria.id)
    setError('')
    setCategorias(obtenerCategorias())
  }

  return (
    <>
      <h1 className="h3 mb-3">Categorias</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <form onSubmit={guardar} noValidate>
            <CampoForm
              id="nombre"
              etiqueta={editandoId ? 'Editar categoria' : 'Nueva categoria'}
              valor={nombre}
              onChange={(event) => setNombre(event.target.value)}
            />
            <Button type="submit">{editandoId ? 'Guardar cambios' : 'Agregar'}</Button>
          </form>
        </Card.Body>
      </Card>

      <Table responsive bordered>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td>{categoria.id}</td>
              <td>{categoria.nombre}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button size="sm" onClick={() => editar(categoria)}>Editar</Button>
                  <Button size="sm" variant="danger" onClick={() => borrar(categoria)}>Eliminar</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default AdminCategorias
