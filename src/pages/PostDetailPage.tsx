import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Spinner, Button, Modal } from 'react-bootstrap';
import type { PostWithComments } from '../interfaces/Post';
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
  const { isUser, isAdmin, userData } = useOutletContext<OutletContextType>();

  const [post, setPost] = useState<PostWithComments | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);

  // Reusable fetchPost function
  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/view_post_with_comments/${id}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      const data: PostWithComments = await res.json();
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

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    setPostingComment(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postid: post?.id,
          authorid: userData?.id,
          data: JSON.stringify({
            text: newComment.trim(),
            authorName: userData?.firstName + ' ' + userData?.lastName || 'Anonymous',
            role: isAdmin ? 'admin' : 'user',
          }),
        }),
      });

      if (!response.ok) throw new Error('Failed to post comment');

      setNewComment('');
      await fetchPost(); // refresh to show new comment
    } catch (err) {
      console.error(err);
      alert('Could not post comment.');
    } finally {
      setPostingComment(false);
    }
  };

  const validCommentsCount = Array.isArray(post.commentsData)
  ? post.commentsData.filter((comment) => {
      try {
        let parsedData = typeof comment.data === 'string' ? JSON.parse(comment.data) : comment.data;
        return parsedData?.text?.trim().length > 0;
      } catch {
        return false;
      }
    }).length
  : 0;

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

      <hr className="my-4" />

      <h4>Comments ({validCommentsCount})</h4>

      {/* Comment List */}
      {Array.isArray(post.commentsData) && post.commentsData.length > 0 && (
        post.commentsData
          .map((comment) => {
            let commentText = '';
            let authorName = 'Anonymous';
            let role = 'user';

            try {
              if (typeof comment.data === 'string') {
                const parsed = JSON.parse(comment.data);
                commentText = parsed?.text || '';
                authorName = parsed?.authorName || authorName;
                role = parsed?.role || role;
              } else if (comment.data && typeof comment.data === 'object') {
                commentText = comment.data.text || '';
                authorName = comment.data.authorName || authorName;
                role = comment.data.role || role;
              }
            } catch (e) {
              console.error('Failed to parse comment data', e);
            }

            // If no actual comment text, skip rendering this comment
            if (!commentText.trim()) {
              return null;
            }

            return (
              <div key={comment.commentId} className="mb-3 p-3 comment-body border rounded bg-light">
                <div className="d-flex align-items-center gap-2 fw-bold">
                  {authorName}{' '}
                  {role === 'admin' && (
                    <span className="badge" style={{ fontSize: '0.75em' }}>
                      Admin
                    </span>
                  )}
                </div>
                <div className="text-muted" style={{ fontSize: '0.85em' }}>
                  {new Date(comment.created + 'Z').toLocaleString()}
                </div>
                <div className="mt-2">{commentText}</div>
              </div>
            );
          })
          .filter(Boolean) // remove any nulls from comments without text
      )}

      {/* Comment Form */}
      {isUser && (
        <div className="mt-4">
          <h5>Add a Comment</h5>
          <textarea
            className="form-control mb-2"
            rows={3}
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            variant="primary"
            onClick={handleCommentSubmit}
            disabled={postingComment || !newComment.trim()}
          >
            {postingComment ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      )}

    </Container>
  );
}