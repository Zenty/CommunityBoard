import { useState, useEffect } from 'react';

export default function useAuth() {
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
  fetch('/api/login', { credentials: 'include' })
    .then(res => res.ok ? res.json() : null)
    .then(json => {
      if (json && !json.error) {
        // json is a stored user object
        setIsUser(true);
        if (json.role === 'admin') {
          setIsAdmin(true);
          setUserData(json);
        } else {
          setIsAdmin(false);
          setUserData(json);
        }
      } else {
        console.log('Not logged in');
        setIsUser(false);
        setIsAdmin(false);
        setUserData(null);
      }
    })
    .catch(err => {
      console.error('Fetch error:', err);
    });
}, []);

  return { isUser, isAdmin, userData };
}