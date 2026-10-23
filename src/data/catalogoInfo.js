// Informacion extra de cada producto (tamano, origen de la receta y si se puede personalizar).
// Esta separada de db.js para no cambiar los productos que ya estaban guardados en el navegador.

export const TAMANOS = ['Individual', 'Pequeña', 'Mediana', 'Grande']

const INFO = {
  TC001: { tamano: 'Mediana', origen: 'Receta clasica de ganache con avellanas, creada por nuestros maestros pasteleros en los años 70.' },
  TC002: { tamano: 'Grande', origen: 'Inspirada en las tortas de celebracion de las pastelerias chilenas de barrio.' },
  TT001: { tamano: 'Pequeña', origen: 'El bizcocho de vainilla con crema pastelera es la primera torta que vendio la pasteleria.' },
  TT002: { tamano: 'Mediana', origen: 'Torta tradicional chilena de manjar y nueces, preparada como en las onces de antes.' },
  P1001: { tamano: 'Individual', origen: 'Postre de chocolate de alta calidad pensado para una persona.' },
  P1002: { tamano: 'Individual', origen: 'Receta italiana de capas de cafe, mascarpone y cacao.' },
  PSA001: { tamano: 'Mediana', origen: 'Receta desarrollada junto a estudiantes de gastronomia para quienes cuidan el azucar.' },
  PSA002: { tamano: 'Mediana', origen: 'Version liviana del cheesecake clasico, endulzada de forma natural.' },
  PT001: { tamano: 'Individual', origen: 'Dulce tradicional chileno de las panaderias de barrio, con manzanas especiadas.' },
  PT002: { tamano: 'Pequeña', origen: 'Tarta originaria de Galicia (España), hecha con almendras, azucar y huevos.' },
  PG001: { tamano: 'Individual', origen: 'Receta creada para personas celiacas, sin sacrificar el sabor.' },
  PG002: { tamano: 'Pequeña', origen: 'Pan de molde sin gluten pensado para sandwiches y acompañar las comidas.' },
  PV001: { tamano: 'Mediana', origen: 'Receta vegana de los estudiantes de gastronomia de Duoc, sin leche ni huevos.' },
  PV002: { tamano: 'Individual', origen: 'Galletas de avena crujientes, sin ingredientes de origen animal.' },
  TE001: { tamano: 'Grande', origen: 'Torta de celebracion que se decora a gusto de cada cliente.' },
  TE002: { tamano: 'Grande', origen: 'Torta de varios pisos para el dia mas importante de una pareja.' },
}

const ORIGEN_POR_DEFECTO = 'Receta hecha en nuestra pasteleria con ingredientes de calidad y mucho cariño.'

export function tamanoDe(producto) {
  return INFO[producto.id] ? INFO[producto.id].tamano : ''
}

export function origenDe(producto) {
  return INFO[producto.id] ? INFO[producto.id].origen : ORIGEN_POR_DEFECTO
}

// Las tortas permiten agregar un mensaje especial (ej: "Feliz cumpleaños Ana").
export function esPersonalizable(producto) {
  return producto.categoria.toLowerCase().includes('torta')
}

// Tipo de torta (cuadrada o circular) segun la categoria del producto.
export function tipoDe(producto) {
  const categoria = producto.categoria.toLowerCase()

  if (categoria.includes('cuadrada')) {
    return 'Cuadrada'
  }
  if (categoria.includes('circular')) {
    return 'Circular'
  }

  return ''
}
