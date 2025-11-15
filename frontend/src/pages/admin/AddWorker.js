import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

export default function AddWorker() {
  const [form, setForm] = useState({ name: '', workerId: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/admin/add-worker', form);

      alert('Worker added successfully');

      setForm({ name: '', workerId: '', email: '', password: '' });
    } catch (err) {
      alert(err?.body?.message || 'Error adding worker');
    } finally {
      setLoading(false);
    }
  }

  return React.createElement(
    React.Fragment,
    null,

    React.createElement(Navbar, null),
    React.createElement(Sidebar, null),

    React.createElement(
      'main',
      { className: 'main-content' },

      React.createElement('h1', { className: 'page-title' }, 'Add Worker'),

      React.createElement(
        'form',
        { className: 'card form', onSubmit: submit },

        React.createElement('input', {
          placeholder: 'Full Name',
          value: form.name,
          onChange: (e) => setForm({ ...form, name: e.target.value }),
          required: true
        }),

        React.createElement('input', {
          placeholder: 'Worker ID (W101)',
          value: form.workerId,
          onChange: (e) => setForm({ ...form, workerId: e.target.value }),
          required: true
        }),

        React.createElement('input', {
          placeholder: 'Email',
          type: 'email',
          value: form.email,
          onChange: (e) => setForm({ ...form, email: e.target.value }),
          required: true
        }),

        React.createElement('input', {
          placeholder: 'Password',
          type: 'password',
          value: form.password,
          onChange: (e) => setForm({ ...form, password: e.target.value }),
          required: true
        }),

        React.createElement(
          'button',
          { className: 'btn', type: 'submit', disabled: loading },
          loading ? 'Adding...' : 'Add Worker'
        )
      )
    )
  );
}
