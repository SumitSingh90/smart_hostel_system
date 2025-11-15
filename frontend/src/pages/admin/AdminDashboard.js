import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ students: 0, workers: 0, complaints: 0 });

  useEffect(() => {
    (async () => {
      try {
        const c = await api.get('/admin/complaints');
        const complaints = c.data || c || [];
        setCounts({ students: 0, workers: 0, complaints: Array.isArray(complaints) ? complaints.length : 0 });
      } catch (e) { console.error(e); }
    })();
  }, []);

  return React.createElement(React.Fragment, null,
    React.createElement(Navbar, null),
    React.createElement(Sidebar, null),
    React.createElement('main', { className: 'main-content' },
      React.createElement('h1', { className: 'page-title' }, 'Admin Dashboard'),
      React.createElement('div', { className: 'dashboard-cards' },
        React.createElement('div', { className: 'card' }, React.createElement('div', { className: 'card-title' }, 'Students'), React.createElement('div', { className: 'card-value' }, counts.students)),
        React.createElement('div', { className: 'card' }, React.createElement('div', { className: 'card-title' }, 'Workers'), React.createElement('div', { className: 'card-value' }, counts.workers)),
        React.createElement('div', { className: 'card' }, React.createElement('div', { className: 'card-title' }, 'Complaints'), React.createElement('div', { className: 'card-value' }, counts.complaints))
      )
    )
  );
}

