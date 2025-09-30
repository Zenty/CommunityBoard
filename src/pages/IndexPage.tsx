import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Modal } from 'react-bootstrap';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useFilteredPosts } from '../utils/useFilteredPosts';
import type Post from '../interfaces/Post.ts';
import type UserData from '../interfaces/UserData.ts';

IndexPage.route = {
  path: '/'
};

type OutletContextType = {
  isUser: boolean;
  isAdmin: boolean;
  userData: UserData | null;
};


export default function IndexPage() {
  const { isUser, isAdmin, userData } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const filteredPosts = useFilteredPosts({ posts, searchTerm, typeFilter, sortOption, userData });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Post[] = await res.json();
        setPosts(Array.isArray(data) ? data : []); // Ensure valid array
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setPosts([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    if (isUser) {
      fetchPosts();
    } else {
      setLoading(false); // No need to fetch if not a user
    }
  }, [isUser]);

  return <>
    <Container className="index-container">
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
          <>
            <h2>Welcome To The Community Board!</h2>
            <p>You need to be signed in to view and post items to the board.</p>
          </>
        ) : loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" />
            <span className="ms-2">Loading posts...</span>
          </div>
        ) : posts.length === 0 ? (
          <h2>There are currently no posts...</h2>
        ) : (
          <Row xs={1} sm={2} md={2} className="g-4">
            {filteredPosts.map((post) => {
              let postData: {
                title?: string;
                author?: string;
                blurb?: string;
                content?: string;
              } = {};

              if (typeof post.data === 'string') {
                try {
                  postData = JSON.parse(post.data);
                } catch (e) {
                  console.warn(`Invalid JSON in post ${post.id}:`, e);
                }
              } else if (typeof post.data === 'object' && post.data !== null) {
                postData = post.data;
              }

              const title = postData.title || 'Untitled';
              const blurb = postData.blurb || '';
              const created = new Date(post.created).toLocaleDateString();
              const author = postData.author || 'Unknown';
              const type = post.type || 'post';

              return (
                <Col key={post.id}>
                  <Card className={`card-${type}`}>
                    <Card.Body>
                      <Card.Title as="h3">
                          <span>{title}</span>
                          {isAdmin && (
                            <Button
                              variant="link"
                              className="text-danger p-0 ms-2"
                              title="Delete Post"
                              onClick={() => {
                                setPostToDelete(post);
                                setShowDeleteModal(true);
                              }}
                            >
                              <i className="bi bi-trash-fill" style={{ fontSize: '1.2rem' }}></i>
                            </Button>
                          )}
                        </Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {created} by <b><i>{author}</i></b>
                      </Card.Subtitle>
                      <Card.Text>{blurb}</Card.Text>
                      <div className="text-end">
                        <span className="badge bg-secondary text-capitalize">{type}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </Container>
    {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{' '}
          <strong>
            {postToDelete &&
              (() => {
                const parsed =
                  typeof postToDelete.data === 'string'
                    ? JSON.parse(postToDelete.data)
                    : postToDelete.data;
                return parsed.title || 'this post';
              })()}
          </strong>
          ? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              if (!postToDelete) return;

              try {
                const response = await fetch(`/api/posts/${postToDelete.id}`, {
                  method: 'DELETE'
                });

                if (!response.ok) {
                  throw new Error('Failed to delete post');
                }

                setPosts((prevPosts) =>
                  prevPosts.filter((p) => p.id !== postToDelete.id)
                );
                setShowDeleteModal(false);
                setPostToDelete(null);
              } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete post. Try again.');
              }
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
  </>;
}