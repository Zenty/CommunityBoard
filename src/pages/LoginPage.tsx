import { useState } from 'react';
import { Form, Button, Alert, Tabs, Tab, Container, Row, Col } from 'react-bootstrap';

LoginPage.route = {
  path: '/login'
};

export default function LoginPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordRepeat, setRegisterPasswordRepeat] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        setSuccess('Logged in successfully!');
        window.location.href = '/';
      }
    } catch (err) {
      setError('Login failed.');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Passwords must match
    if (registerPassword !== registerPasswordRepeat) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          firstName: registerFirstName,
          lastName: registerLastName
        }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setSuccess('Registered successfully! You can now log in.');
    } catch (err) {
      setError('Registration failed.');
    }
    setLoading(false);
  };

  return (
    <Container style={{ maxWidth: 400, marginTop: 80 }} className="login-page-form">
      <Row>
        <Col>
          <Tabs defaultActiveKey="login" className="mb-3">
            <Tab eventKey="login" title="Login">
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="loginEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="loginPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
            </Tab>
            <Tab eventKey="register" title="Register">
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3" controlId="registerFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={registerFirstName}
                    onChange={e => setRegisterFirstName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="registerLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={registerLastName}
                    onChange={e => setRegisterLastName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="registerEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={registerEmail}
                    onChange={e => setRegisterEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="registerPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={registerPassword}
                    onChange={e => setRegisterPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="registerPasswordRepeat">
                  <Form.Label>Repeat Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={registerPasswordRepeat}
                    onChange={e => setRegisterPasswordRepeat(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="success" type="submit" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </Form>
            </Tab>
          </Tabs>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {success && <Alert variant="success" className="mt-3">{success}</Alert>}
        </Col>
      </Row>
    </Container>
  );
}