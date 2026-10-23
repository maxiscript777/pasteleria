// Detalle de precios: subtotal, descuentos aplicados y total a pagar.
// Solo muestra las lineas de descuento cuando el usuario tiene alguno.
function ResumenCompra({ resumen }) {
  const hayDescuento = resumen.porcentaje > 0 || resumen.montoGratis > 0

  if (!hayDescuento) {
    return null
  }

  return (
    <div className="text-end mb-2">
      <div>Subtotal: ${resumen.subtotal.toLocaleString('es-CL')}</div>

      {resumen.montoGratis > 0 && (
        <div className="text-success">
          Torta gratis de cumpleaños ({resumen.tortaGratis}): -${resumen.montoGratis.toLocaleString('es-CL')}
        </div>
      )}

      {resumen.porcentaje > 0 && (
        <div className="text-success">
          {resumen.motivo} ({resumen.porcentaje}%): -${resumen.montoDescuento.toLocaleString('es-CL')}
        </div>
      )}
    </div>
  )
}

export default ResumenCompra
