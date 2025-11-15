import React from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../services/auth';

export default function Sidebar() {
  const user = getUser() || {};
  const role = user.role || 'guest';

  function linkEl(to, label) {
    return React.createElement('li', { key: to }, React.createElement(Link, { to, className: 'nav-link' }, label));
  }

  let items = [];
  if (role === 'admin') {
    items = [
      ['/admin', 'Overview'],
      ['/admin/add-student', 'Add Student'],
      ['/admin/add-worker', 'Add Worker'],
      ['/admin/complaints', 'Complaints'],
      ['/admin/send-mail', 'Send Mail']
    ];
  } else if (role === 'student') {
    items = [
      ['/student', 'Overview'],
      ['/student/submit-complaint', 'Submit Complaint'],
      ['/student/my-complaints', 'My Complaints'],
      ['/student/cleaning-schedule', 'Cleaning Schedule'],
      ['/student/menu', 'Mess Menu']
    ];
  } else if (role === 'worker') {
    items = [
      ['/worker', 'Overview'],
      ['/worker/tasks', 'Tasks'],
      ['/worker/add-menu', 'Add Menu']
    ];
  }

  return React.createElement('aside', { className: 'sidebar' },
    React.createElement('div', { className: 'sidebar-brand' }, 'SmartHostel'),
    React.createElement('ul', { className: 'nav-list' }, items.map(i => linkEl(i[0], i[1])))
  );
}
