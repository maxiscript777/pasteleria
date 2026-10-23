import { useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { eliminarUsuario, obtenerUsuarios } from '../../data/db'

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState(obtenerUsuarios())

  function borrar(id) {
    if (window.confirm('¿Eliminar este usuario?')) {
      eliminarUsuario(id)
      setUsuarios(obtenerUsuarios())
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Usuarios</h1>
        <Button as={Link} to="/admin/usuarios/nuevo">Nuevo usuario</Button>
      </div>

      <Table responsive bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre} {usuario.apellidos}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button as={Link} to={`/admin/usuarios/${usuario.id}/editar`} size="sm">Editar</Button>
                  <Button as={Link} to={`/admin/usuarios/${usuario.id}/compras`} size="sm" variant="info">Historial</Button>
                  <Button size="sm" variant="danger" onClick={() => borrar(usuario.id)}>Eliminar</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default AdminUsuarios
