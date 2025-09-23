import { useState, useEffect } from 'react';

export default function useAuth() {
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
  fetch('/api/login', { credentials: 'include' })
    .then(res => res.ok ? res.json() : null)
    .then(json => {
      if (json && !json.error) {
        // json is a stored user object
        console.log('User1:', json);
        setIsUser(true);
        if (json.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        console.log('Not logged in');
        setIsUser(false);
        setIsAdmin(false);
      }
    })
    .catch(err => {
      console.error('Fetch error:', err);
    });
}, []);

  return { isUser, isAdmin };
}