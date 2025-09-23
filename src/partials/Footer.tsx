import { Container, Row, Col } from 'react-bootstrap';

type HeaderProps = {
    isUser: boolean;
    isAdmin: boolean;
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  };

export default function Footer({}: HeaderProps) {
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