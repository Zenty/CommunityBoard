import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Spinner, Button, Modal } from 'react-bootstrap';
import type Post from '../interfaces/Post';
import type UserData from '../interfaces/UserData.ts';

PostDetailPage.route = {
  path: '/posts/:id'
};

// Define the context shape expected from layout
type OutletContextType = {
  isUser: boolean;
  isAdmin: boolean;
  userData: UserData | null;
};

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useOutletContext<OutletContextType>();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error('Failed to fetch post');
        const data: Post = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!post) return;

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setShowDeleteModal(false);
      navigate('/'); // Redirect to homepage after deletion
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Try again.');
    }
  };

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" />
        <div>Loading post...</div>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="text-center">
        <h2>Post not found</h2>
        <Button variant="primary" onClick={() => navigate(-1)}>Go Back</Button>
      </Container>
    );
  }

  const postData =
    typeof post.data === 'string' ? JSON.parse(post.data) : post.data;

  const {
    title = 'Untitled',
    author = 'Unknown',
    content = ''
  } = postData;

  const created = new Date(post.created).toLocaleDateString();
  const type = post.type || 'post';

  return (
    <Container className={`post-detail post-detail-${type}`}>
      <Button className="mb-3" variant="link" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <div className="d-flex flex-wrap-wrap justify-content-between align-items-center mb-4">
        <h1 style={{ minWidth: '150px', marginRight: '20px' }}>{title}</h1>
        <div>
          {isAdmin && (
            <Button
              variant="outline-danger"
              size="sm"
              title="Delete Post"
              onClick={() => setShowDeleteModal(true)}
            >
              <i className="bi bi-trash-fill"></i> Delete
            </Button>
          )}
        </div>
      </div>

      <div className="text-muted mb-2">
        {created} by <strong>{author}</strong>
      </div>

      <div className="mb-4">
        <span className="badge bg-secondary text-capitalize">{type}</span>
      </div>

      <div dangerouslySetInnerHTML={{ __html: content }} />

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
          <strong>{title}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}