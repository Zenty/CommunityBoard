import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';

CreatePostPage.route = {
  path: '/create-post'
};

type OutletContextType = {
  isUser: boolean;
  isAdmin: boolean;
};

export default function CreatePostPage() {
  const { isUser } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [blurb, setBlurb] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('post');
  const [error, setError] = useState('');

  useEffect(() => {
    const trimmed = content.trim();
    setBlurb(trimmed.length > 50 ? trimmed.slice(0, 50) + '…' : trimmed);
  }, [content]);

  useEffect(() => {
    if (!isUser) {
      navigate('/');
    }
  }, [isUser, navigate]);

  
   const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !type.trim()) {
      setError('All fields are required.');
      return;
    }

    try {
      const postPayload = {
        type,
        data: JSON.stringify({
          title: title.trim(),
          blurb,
          content: content.trim(),
        }),
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(postPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      window.location.href = '/';
    } catch (err) {
      console.error(err);
      setError('Failed to create post. Please try again.');
    }
  };

  if (!isUser) {
    return (
      <Container className="mt-5">
        <h2>Create Post</h2>
        <p>You don't have access to this page...</p>
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: '700px' }}>
      <h2>Create Post</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleCreatePost}>
        <Form.Group className="mb-3" controlId="postTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="postType">
          <Form.Label>Post Type</Form.Label>
          <Form.Select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="post">Post</option>
            <option value="announcement">Announcement</option>
            <option value="question">Question</option>
            <option value="event">Event</option>
            <option value="advert">Advert</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4" controlId="postContent">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            placeholder="Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="autoBlurb">
          <Form.Label>Auto-Generated Blurb (Preview)</Form.Label>
          <Form.Control
            type="text"
            value={blurb}
            readOnly
            plaintext
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Post
        </Button>
      </Form>
    </Container>
  );
}