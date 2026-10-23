import { Button, Container } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import BLOGS from '../data/blogs'

function DetalleBlogView() {
  const { id } = useParams()
  const blog = BLOGS.find((item) => item.id === Number(id))

  if (!blog) {
    return (
      <Container className="py-4">
        <h2>Articulo no encontrado</h2>
        <Button as={Link} to="/blogs">Volver al blog</Button>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h1>{blog.titulo}</h1>
      <img src={blog.imagen} alt={blog.titulo} className="detail-image my-3" />
      {blog.texto.map((parrafo) => (
        <p key={parrafo}>{parrafo}</p>
      ))}
      <Button as={Link} to="/blogs" variant="secondary">Volver</Button>
    </Container>
  )
}

export default DetalleBlogView
