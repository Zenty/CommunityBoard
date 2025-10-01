import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Spinner, Button, Modal } from 'react-bootstrap';
import type Post from '../interfaces/Post';
import type UserData from '../interfaces/UserData.ts';
import type PostData from '../interfaces/PostData';

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
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Reusable fetchPost function
  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${id}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      const data: Post = await res.json();
      setPost(data);

      const postData = typeof data.data === 'string'
        ? JSON.parse(data.data)
        : data.data;

      setEditTitle(postData.title || '');
      setEditContent(postData.content || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch post on component mount or id change
  useEffect(() => {
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
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Try again.');
    }
  };

  const handleSave = async () => {
    if (!post) return;

    setSaving(true);

    let parsedData;
    try {
      parsedData = typeof post.data === 'string' ? JSON.parse(post.data) : post.data;
    } catch (err) {
      console.error('Failed to parse post.data during save.', err);
      parsedData = {};
    }

    const trimmedContent = editContent.trim();
    const generatedBlurb = trimmedContent.length > 50 ? trimmedContent.slice(0, 50) + '…' : trimmedContent;

    const updatedData = {
      title: editTitle.trim(),
      author: parsedData.author || 'Unknown',
      blurb: generatedBlurb,
      content: trimmedContent
    };

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...post,
          data: JSON.stringify(updatedData)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      // Refetch post after successful save
      await fetchPost();

      setEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Try again.');
    } finally {
      setSaving(false);
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

  let postData: PostData = {
    title: '',
    author: '',
    blurb: '',
    content: ''
  };

  try {
    postData =
      typeof post.data === 'string'
        ? JSON.parse(post.data) as PostData
        : post.data as PostData;
  } catch (e) {
    console.error('Failed to parse post.data:', e);
  }

  const {
    title = 'Untitled',
    author = 'Unknown',
    content = ''
  } = postData;

  const created = post.created ? new Date(post.created).toLocaleDateString() : 'Invalid date';
  const type = post.type || 'post';

  return (
    <Container className={`post-detail post-detail-${type}`}>
      <Button className="mb-3" variant="link" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-2">
        {editing ? (
          <input
            type="text"
            className="form-control w-100 mb-2"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Post title"
          />
        ) : (
          <h1 className="w-100" style={{ minWidth: '150px', marginRight: '20px' }}>{title}</h1>
        )}

        {isAdmin && !editing && (
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              title="Edit Post"
              onClick={() => setEditing(true)}
            >
              <i className="bi bi-pencil-fill"></i> Edit
            </Button>

            <Button
              variant="outline-danger"
              size="sm"
              title="Delete Post"
              onClick={() => setShowDeleteModal(true)}
            >
              <i className="bi bi-trash-fill"></i> Delete
            </Button>
          </div>
        )}
      </div>

      <div className="text-muted mb-2">
        {created} by <strong>{author}</strong>
      </div>

      <div className="mb-4">
        <span className="badge bg-secondary text-capitalize">{type}</span>
      </div>

      {editing ? (
        <>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows={10}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </div>

          <div className="d-flex gap-2">
            <Button variant="success" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="secondary" onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}

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