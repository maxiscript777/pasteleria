import {
  claveValida,
  correoValido,
  fechaManana,
  validarPerfil,
  validarContacto,
  validarEnvio,
  validarRegistro,
} from '../data/validaciones'

describe('validaciones', () => {
  it('acepta solo los dominios de correo permitidos', () => {
    expect(correoValido('ana@duoc.cl')).toBe(true)
    expect(correoValido('ana@gmail.com')).toBe(true)
    expect(correoValido('ana@hotmail.com')).toBe(false)
  })

  it('la contraseña debe tener entre 4 y 10 caracteres', () => {
    expect(claveValida('abc')).toBe(false)
    expect(claveValida('abcd')).toBe(true)
    expect(claveValida('12345678901')).toBe(false)
  })

  it('validarRegistro entrega un error por cada campo incorrecto', () => {
    const errores = validarRegistro({ nombre: '', correo: 'x', clave: '1', repetir: '2' })

    expect(Object.keys(errores)).toEqual(['nombre', 'correo', 'clave', 'repetir'])
  })

  it('validarRegistro no entrega errores si los datos son correctos', () => {
    const errores = validarRegistro({ nombre: 'Ana', correo: 'ana@duoc.cl', clave: 'abcd', repetir: 'abcd' })

    expect(errores).toEqual({})
  })

  it('validarEnvio pide la region y la comuna', () => {
    const errores = validarEnvio({
      nombre: 'Ana', apellidos: 'Perez', correo: 'ana@duoc.cl',
      calle: 'Los Olmos 123', region: '', comuna: '',
    })

    expect(errores.region).toBeDefined()
    expect(errores.comuna).toBeDefined()
    expect(errores.calle).toBeUndefined()
  })

  it('validarContacto rechaza un mensaje de mas de 500 caracteres', () => {
    const errores = validarContacto({ nombre: 'Ana', correo: 'ana@duoc.cl', mensaje: 'a'.repeat(501) })

    expect(errores.mensaje).toBeDefined()
  })

  it('validarRegistro acepta el codigo FELICES50 y rechaza otros codigos', () => {
    const base = { nombre: 'Ana', correo: 'ana@duoc.cl', clave: 'abcd', repetir: 'abcd' }

    expect(validarRegistro({ ...base, codigo: 'felices50' })).toEqual({})
    expect(validarRegistro({ ...base, codigo: 'MALO' }).codigo).toBeDefined()
  })

  it('validarRegistro rechaza una fecha de nacimiento en el futuro', () => {
    const base = { nombre: 'Ana', correo: 'ana@duoc.cl', clave: 'abcd', repetir: 'abcd' }

    expect(validarRegistro({ ...base, fechaNacimiento: '2990-01-01' }).fechaNacimiento).toBeDefined()
    expect(validarRegistro({ ...base, fechaNacimiento: '1990-05-20' })).toEqual({})
  })

  it('validarEnvio exige que la fecha de entrega sea desde mañana', () => {
    const datos = {
      nombre: 'Ana', apellidos: 'Perez', correo: 'ana@duoc.cl',
      calle: 'Los Olmos 123', region: 'X', comuna: 'Y',
    }

    expect(validarEnvio({ ...datos, fechaEntrega: '2000-01-01' }).fechaEntrega).toBeDefined()
    expect(validarEnvio({ ...datos, fechaEntrega: fechaManana() }).fechaEntrega).toBeUndefined()
    expect(validarEnvio({ ...datos, fechaEntrega: '' }).fechaEntrega).toBeUndefined()
  })

  it('validarPerfil pide el nombre', () => {
    expect(validarPerfil({ nombre: '', fechaNacimiento: '', codigo: '' }).nombre).toBeDefined()
    expect(validarPerfil({ nombre: 'Ana', fechaNacimiento: '', codigo: '' })).toEqual({})
  })
})
