import { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { STOCK_CRITICO, eliminarProducto, obtenerProductos } from '../../data/db'

function AdminProductos() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    setProductos(obtenerProductos())
  }, [])

  function borrar(id) {
    if (window.confirm('¿Eliminar este producto?')) {
      eliminarProducto(id)
      setProductos(obtenerProductos())
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Productos</h1>
        <div className="d-flex gap-2">
          <Button as={Link} to="/admin/criticos" variant="outline-danger">Productos con poco stock</Button>
          <Button as={Link} to="/admin/productos/nuevo">Nuevo producto</Button>
        </div>
      </div>

      <Table responsive bordered hover>
        <thead>
          <tr>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Categoria</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id} className={producto.stock <= STOCK_CRITICO ? 'table-danger' : ''}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.categoria}</td>
              <td>${producto.precio.toLocaleString('es-CL')}</td>
              <td>{producto.stock}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button as={Link} to={`/admin/productos/${producto.id}/editar`} size="sm">Editar</Button>
                  <Button size="sm" variant="danger" onClick={() => borrar(producto.id)}>Eliminar</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default AdminProductos
