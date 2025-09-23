import { useLocation } from 'react-router-dom';
import Header from "./partials/Header";
import Main from './partials/Main';
import Footer from './partials/Footer';
import BootstrapBreakpoints from './parts/BootstrapBreakpoints';
import useLocalStorage from "use-local-storage";
import useAuth from './utils/useAuth';

// turn off when not needed for debugging
const showBootstrapBreakpoints = false;

export default function App() {

  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>("isDarkMode", false) as [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  const { isUser, isAdmin } = useAuth();

  // scroll to top when the route changes
  useLocation();
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  return <>
    <Header {...{isUser, isAdmin, isDarkMode, setIsDarkMode}} />
    <Main {...{isUser, isAdmin, isDarkMode, setIsDarkMode}}/>
    <Footer {...{isUser, isAdmin, isDarkMode, setIsDarkMode}}/>
    {showBootstrapBreakpoints ? <BootstrapBreakpoints /> : null}
  </>;
};