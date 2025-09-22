import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Header from "./partials/Header";
import Main from './partials/Main';
import Footer from './partials/Footer';
import BootstrapBreakpoints from './parts/BootstrapBreakpoints';

// turn off when not needed for debugging
const showBootstrapBreakpoints = false;

export default function App() {

  const [isDarkMode, setIsDarkMode] = useState(false);

  // scroll to top when the route changes
  useLocation();
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  return <>
    <Header {...{isDarkMode, setIsDarkMode}} />
    <Main />
    <Footer />
    {showBootstrapBreakpoints ? <BootstrapBreakpoints /> : null}
  </>;
};