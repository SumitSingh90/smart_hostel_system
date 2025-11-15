import React from 'react';
import { getUser } from '../services/auth';

export default function Navbar() {
  const user = getUser();
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return React.createElement('header', { className: 'topbar' },
    React.createElement('div', { className: 'brand' }, 'Smart Hostel System'),
    React.createElement('div', { className: 'top-actions' },
      user ? React.createElement('span', null, 'Role: ', React.createElement('strong', null, user.role)) : null,
      React.createElement('button', { className: 'btn-ghost', onClick: handleLogout }, 'Logout')
    )
  );
}
