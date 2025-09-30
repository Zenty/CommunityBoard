import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate, useOutletContext } from 'react-router-dom';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [typeFilter, setTypeFilter] = useState('');

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
                <Form.Control
                  type="text"
                  placeholder="Search posts..."
                  style={{ minWidth: '200px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>

              {/* Type Filter Dropdown */}
              <Col xs="auto">
                <Form.Select
                  style={{ width: '180px' }}
                  defaultValue=""
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="post">Post</option>
                  <option value="announcement">Announcement</option>
                  <option value="question">Question</option>
                  <option value="event">Event</option>
                  <option value="advert">Advert</option>
                </Form.Select>
              </Col>

              {/* Sort Dropdown */}
              <Col xs="auto">
                <Form.Select
                  style={{ width: '150px' }}
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
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