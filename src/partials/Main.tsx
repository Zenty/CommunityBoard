import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useStateObject } from '../utils/useStateObject';

export default function Main() {
  // a state to use with outlet context
  const stateAndSetter = useStateObject({
    categoryChoice: 'All',
    sortChoice: 'Price (low to high)',
    bwImages: false
  });

  return <main className="mt-5" data-bs-theme="light">
    <Container className="mt-5 mb-4" data-bs-theme="light">
      <Outlet context={stateAndSetter} />
    </Container>
  </main>;
}