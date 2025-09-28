import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

type HeaderProps = {
    isUser: boolean;
    isAdmin: boolean;
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  };

export default function Main({isUser, isAdmin}: HeaderProps) {
  return <main>
    <Container className="p-4">
      <Outlet context={{ isUser, isAdmin }} />
    </Container>
  </main>;
}