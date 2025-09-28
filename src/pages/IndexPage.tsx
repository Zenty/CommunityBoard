import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

IndexPage.route = {
  path: '/'
};

type OutletContextType = {
  isUser: boolean;
  isAdmin: boolean;
};


export default function IndexPage() {
  const { isUser } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  return <>
    <Container className="p-4 index-container">
      <div className="post-options-container">
        {isUser && (
          <div className="mb-4">
            <Row className="align-items-center justify-content-center g-2">
              {/* Search Field */}
              <Col className="flex-grow-1">
                <Form.Control type="text" placeholder="Search posts..." style={{ minWidth: '200px' }} />
              </Col>

              {/* Sort Dropdown */}
              <Col xs="auto">
                <Form.Select style={{ width: '150px' }}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="own">Own Posts</option>
                </Form.Select>
              </Col>

              {/* Create Post Button */}
              <Col xs="auto">
                <Button variant="primary" onClick={handleCreatePost}>
                  Create Post
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </div>
      <div className="post-container">
        {!isUser ? (
          <><h2>Welcome To The Community Board!</h2><p>
            You need to be signed in to view and post items to the board.
          </p></>
        ) : (
          <h2>There are currently no posts...</h2>
        )}
      </div>
    </Container>
  </>;
}