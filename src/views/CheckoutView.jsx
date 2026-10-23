import { useState } from 'react'
import { Alert, Badge, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import CampoForm from '../components/CampoForm'
import ResumenCompra from '../components/ResumenCompra'
import TablaItems from '../components/TablaItems'
import { calcularResumen, crearOrden, descontarStock, simularPago } from '../data/db'
import REGIONES from '../data/regiones'
import { fechaManana, validarEnvio } from '../data/validaciones'

function CheckoutView({ carrito, usuario, onVaciar }) {
  const navigate = useNavigate()
  const [datos, setDatos] = useState({
    nombre: usuario ? usuario.nombre : '',
    apellidos: usuario ? usuario.apellidos : '',
    correo: usuario ? usuario.correo : '',
    calle: '',
    depto: '',
    region: '',
    comuna: '',
    indicaciones: '',
    fechaEntrega: '',
  })
  const [errores, setErrores] = useState({})
  const resumen = calcularResumen(carrito, usuario)
  const total = resumen.total
  const comunas = datos.region === '' ? [] : REGIONES[datos.region]

  function cambiar(event) {
    setDatos({ ...datos, [event.target.name]: event.target.value })
  }

  function cambiarRegion(event) {
    setDatos({ ...datos, region: event.target.value, comuna: '' })
  }

  function pagar(event) {
    event.preventDefault()
    const nuevosErrores = validarEnvio(datos)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    const orden = {
      usuarioId: usuario ? usuario.id : null,
      fecha: new Date().toLocaleDateString('es-CL'),
      cliente: { nombre: datos.nombre, apellidos: datos.apellidos, correo: datos.correo },
      direccion: {
        calle: datos.calle,
        depto: datos.depto,
        region: datos.region,
        comuna: datos.comuna,
        indicaciones: datos.indicaciones,
      },
      fechaEntrega: datos.fechaEntrega,
      estado: 'En preparacion',
      items: carrito,
      subtotal: resumen.subtotal,
      descuento: {
        porcentaje: resumen.porcentaje,
        motivo: resumen.motivo,
        monto: resumen.montoDescuento,
      },
      tortaGratis: resumen.tortaGratis,
      montoTortaGratis: resumen.montoGratis,
      total: total,
    }

    if (simularPago()) {
      const creada = crearOrden(orden)
      descontarStock(carrito)
      onVaciar()
      navigate(`/pago-correcto/${creada.id}`)
    } else {
      navigate('/pago-error', { state: { orden: orden } })
    }
  }

  if (carrito.length === 0) {
    return (
      <Container className="py-4">
        <h1>Comprar</h1>
        <p>No tienes productos en el carrito.</p>
        <Button as={Link} to="/productos">Ver productos</Button>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h1 className="h3">Carrito de compra</h1>
              <p className="text-muted mb-0">Completa la siguiente informacion</p>
            </div>
            <Badge bg="primary" className="fs-6">Total a pagar: ${total.toLocaleString('es-CL')}</Badge>
          </div>

          <TablaItems items={carrito} />

          {resumen.tortaGratis && (
            <Alert variant="success">
              ¡Feliz cumpleaños! Tu torta ({resumen.tortaGratis}) va de regalo por ser estudiante Duoc.
            </Alert>
          )}
          <ResumenCompra resumen={resumen} />

          <form onSubmit={pagar} noValidate>
            <h2 className="h5 mt-4">Informacion del cliente</h2>
            <Row>
              <Col md={6}>
                <CampoForm id="nombre" etiqueta="Nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} autoComplete="given-name" />
              </Col>
              <Col md={6}>
                <CampoForm id="apellidos" etiqueta="Apellidos" valor={datos.apellidos} onChange={cambiar} error={errores.apellidos} autoComplete="family-name" />
              </Col>
            </Row>
            <CampoForm id="correo" etiqueta="Correo" tipo="email" valor={datos.correo} onChange={cambiar} error={errores.correo} autoComplete="email" />

            <h2 className="h5 mt-4">Direccion de entrega de los productos</h2>
            <Row>
              <Col md={8}>
                <CampoForm id="calle" etiqueta="Calle" valor={datos.calle} onChange={cambiar} error={errores.calle} autoComplete="street-address" />
              </Col>
              <Col md={4}>
                <CampoForm id="depto" etiqueta="Departamento (opcional)" valor={datos.depto} onChange={cambiar} placeholder="Ej: 603" />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="region">
                  <Form.Label>Region</Form.Label>
                  <Form.Select name="region" value={datos.region} onChange={cambiarRegion} isInvalid={!!errores.region}>
                    <option value="">Selecciona una region</option>
                    {Object.keys(REGIONES).map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="comuna">
                  <Form.Label>Comuna</Form.Label>
                  <Form.Select name="comuna" value={datos.comuna} onChange={cambiar} isInvalid={!!errores.comuna}>
                    <option value="">Selecciona una comuna</option>
                    {comunas.map((comuna) => (
                      <option key={comuna} value={comuna}>{comuna}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <CampoForm id="indicaciones" etiqueta="Indicaciones para la entrega (opcional)" as="textarea" filas={3} valor={datos.indicaciones} onChange={cambiar} />
            <CampoForm id="fechaEntrega" etiqueta="Fecha de entrega preferida (opcional)" tipo="date" min={fechaManana()} valor={datos.fechaEntrega} onChange={cambiar} error={errores.fechaEntrega} />

            <div className="text-end">
              <Button type="submit" variant="success">
                Pagar ahora ${total.toLocaleString('es-CL')}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default CheckoutView
