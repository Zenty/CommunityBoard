import { Container } from 'react-bootstrap';
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
  return <>
    <Container className="p-4 index-container">
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