import { Table } from 'react-bootstrap'

function TablaItems({ items }) {
  return (
    <Table responsive bordered>
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td><img src={item.imagen} alt={item.nombre} className="cart-image" /></td>
            <td>
              {item.nombre}
              {item.mensaje && <div className="small fst-italic">Mensaje: {item.mensaje}</div>}
            </td>
            <td>${item.precio.toLocaleString('es-CL')}</td>
            <td>{item.cantidad}</td>
            <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default TablaItems
