import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import CampoForm from '../../components/CampoForm'
import {
  actualizarProducto,
  crearProducto,
  obtenerCategorias,
  obtenerProductoPorId,
} from '../../data/db'
import { validarProducto } from '../../data/validaciones'

function AdminProductoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const categorias = obtenerCategorias()
  const [datos, setDatos] = useState({
    id: '',
    nombre: '',
    categoria: categorias[0].nombre,
    precio: '',
    stock: '',
    descripcion: '',
    imagen: '/img/mousse_choc.jpg',
    oferta: false,
    precioOferta: '',
  })
  const [errores, setErrores] = useState({})

  useEffect(() => {
    if (id) {
      const producto = obtenerProductoPorId(id)

      if (producto) {
        setDatos(producto)
      }
    }
  }, [id])

  function cambiar(event) {
    const valor = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setDatos({ ...datos, [event.target.name]: valor })
  }

  function guardar(event) {
    event.preventDefault()
    const nuevosErrores = validarProducto(datos)

    if (!id && obtenerProductoPorId(datos.id)) {
      nuevosErrores.id = 'Ya existe un producto con ese codigo'
    }

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    const producto = {
      ...datos,
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      precioOferta: datos.oferta ? Number(datos.precioOferta) : 0,
    }

    if (id) {
      actualizarProducto(id, producto)
    } else {
      crearProducto(producto)
    }

    navigate('/admin/productos')
  }

  return (
    <Card>
      <Card.Body>
        <h1 className="h3 mb-3">{id ? 'Editar producto' : 'Nuevo producto'}</h1>

        <form onSubmit={guardar} noValidate>
          <Row>
            <Col md={4}>
              <CampoForm id="id" etiqueta="Codigo" valor={datos.id} onChange={cambiar} error={errores.id} deshabilitado={!!id} />
            </Col>
            <Col md={8}>
              <CampoForm id="nombre" etiqueta="Nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} />
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="categoria">
            <Form.Label>Categoria</Form.Label>
            <Form.Select name="categoria" value={datos.categoria} onChange={cambiar}>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.nombre}>{categoria.nombre}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Row>
            <Col md={6}>
              <CampoForm id="precio" etiqueta="Precio" tipo="number" valor={datos.precio} onChange={cambiar} error={errores.precio} />
            </Col>
            <Col md={6}>
              <CampoForm id="stock" etiqueta="Stock" tipo="number" valor={datos.stock} onChange={cambiar} error={errores.stock} />
            </Col>
          </Row>

          <CampoForm id="descripcion" etiqueta="Descripcion" as="textarea" filas={3} valor={datos.descripcion} onChange={cambiar} />
          <CampoForm id="imagen" etiqueta="Imagen (ruta)" valor={datos.imagen} onChange={cambiar} />

          <Form.Check
            type="checkbox"
            id="oferta"
            name="oferta"
            label="Producto en oferta"
            checked={datos.oferta}
            onChange={cambiar}
            className="mb-3"
          />

          {datos.oferta && (
            <CampoForm id="precioOferta" etiqueta="Precio de oferta" tipo="number" valor={datos.precioOferta} onChange={cambiar} error={errores.precioOferta} />
          )}

          <div className="d-flex gap-2">
            <Button type="submit">Guardar</Button>
            <Button variant="secondary" onClick={() => navigate('/admin/productos')}>Cancelar</Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  )
}

export default AdminProductoForm
