import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useStateObject } from '../utils/useStateObject';

type HeaderProps = {
    isUser: boolean;
    isAdmin: boolean;
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  };

export default function Main({}: HeaderProps) {
  // a state to use with outlet context
  const stateAndSetter = useStateObject({
    categoryChoice: 'All',
    sortChoice: 'Price (low to high)',
    bwImages: false
  });

  return <main>
    <Container className="p-4">
      <Outlet context={stateAndSetter}/>
    </Container>
  </main>;
}