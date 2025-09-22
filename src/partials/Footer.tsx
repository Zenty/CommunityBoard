import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  return <footer>
    <Container fluid data-bs-theme="light">
      <Row>
        <Col className="text-center py-3 text-bg-primary">
          © The Community Board {new Date().getFullYear()}
        </Col>
      </Row>
    </Container>
  </footer>;
}