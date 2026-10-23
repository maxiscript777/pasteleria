import { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { STOCK_CRITICO, actualizarProducto, obtenerProductos } from '../../data/db'

function AdminCriticos() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    setProductos(obtenerProductos())
  }, [])

  function reponer(producto) {
    actualizarProducto(producto.id, { stock: producto.stock + 10 })
    setProductos(obtenerProductos())
  }

  const criticos = productos.filter((producto) => producto.stock <= STOCK_CRITICO)

  return (
    <>
      <h1 className="h3 mb-3">Productos con poco stock</h1>
      <p className="text-muted">Productos con stock de {STOCK_CRITICO} unidades o menos.</p>

      {criticos.length === 0 && <p>No hay productos con poco stock.</p>}

      {criticos.length > 0 && (
        <Table responsive bordered>
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Nombre</th>
              <th>Stock</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {criticos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.stock}</td>
                <td>
                  <Button size="sm" variant="success" onClick={() => reponer(producto)}>+10 stock</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default AdminCriticos
