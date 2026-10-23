import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CampoForm from '../components/CampoForm'

describe('CampoForm', () => {
  it('muestra la etiqueta y no muestra error si no hay error', () => {
    render(<CampoForm id="nombre" etiqueta="Nombre" valor="" onChange={() => {}} />)

    expect(screen.getByLabelText('Nombre').className.includes('is-invalid')).toBe(false)
  })

  it('marca el campo como invalido cuando recibe un error', () => {
    render(<CampoForm id="nombre" etiqueta="Nombre" valor="" onChange={() => {}} error="Ingresa tu nombre" />)

    expect(screen.getByLabelText('Nombre').className.includes('is-invalid')).toBe(true)
    expect(screen.getByText('Ingresa tu nombre')).toBeTruthy()
  })

  it('llama a onChange cuando el usuario escribe', async () => {
    const user = userEvent.setup()
    const onChange = jasmine.createSpy('onChange')
    render(<CampoForm id="nombre" etiqueta="Nombre" valor="" onChange={onChange} />)

    await user.type(screen.getByLabelText('Nombre'), 'Ana')

    expect(onChange).toHaveBeenCalledTimes(3)
  })
})
