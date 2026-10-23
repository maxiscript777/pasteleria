import { Form } from 'react-bootstrap'

function CampoForm({ id, etiqueta, valor, onChange, error, tipo = 'text', placeholder, autoComplete, as, filas, deshabilitado, min, maxLength }) {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{etiqueta}</Form.Label>
      <Form.Control
        type={tipo}
        name={id}
        value={valor}
        onChange={onChange}
        isInvalid={!!error}
        placeholder={placeholder}
        autoComplete={autoComplete}
        as={as}
        rows={filas}
        disabled={deshabilitado}
        min={min}
        maxLength={maxLength}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  )
}

export default CampoForm
