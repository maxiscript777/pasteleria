import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import BLOGS from '../data/blogs'

function BlogsView() {
  return (
    <Container className="py-4">
      <h1 className="mb-4">Blog</h1>

      <Row className="g-4">
        {BLOGS.map((blog) => (
          <Col key={blog.id} md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={blog.imagen} alt={blog.titulo} className="product-image" />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{blog.titulo}</Card.Title>
                <Card.Text>{blog.resumen}</Card.Text>
                <Button as={Link} to={`/blog/${blog.id}`} className="mt-auto align-self-start">
                  Leer mas
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default BlogsView
