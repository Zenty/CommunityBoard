import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

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

  useEffect(() => {
    if (!isUser) {
      navigate('/');
    }
  }, [isUser, navigate]);
  
  return <>
    {!isUser ? (
      <><h2>Create Post</h2>
        <p>
          You don't have access to this page...
        </p>
      </>
      ) : (
        <h2>Create Post</h2>
        // Future form for creating a post will go here
      )}
  </>;
}