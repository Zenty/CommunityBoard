import type UserData from '../interfaces/UserData.ts';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

type HeaderProps = {
    isUser: boolean;
    isAdmin: boolean;
    userData: UserData | null;
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  };

export default function Main({isUser, isAdmin, userData}: HeaderProps) {
  return <main>
    <Container className="main-container">
      <Outlet context={{ isUser, isAdmin, userData }} />
    </Container>
  </main>;
}