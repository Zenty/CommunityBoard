import { useState, useEffect } from 'react';

export default function isLoggedIn() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/login', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json && json.loggedIn) {
          setLoggedIn(true);
          setUserData(json);
        } else {
          setLoggedIn(false);
          setUserData(null);
        }
      })
      .catch(() => {
        setLoggedIn(false);
        setUserData(null);
      });
  }, []);

  return { loggedIn, userData };
}