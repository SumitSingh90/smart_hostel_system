import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

export default function AddStudent() {
  const [form, setForm] = useState({ name: '', studentId: '', email: '', password: '', roomNo: '' });
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/add-student', form);
      alert('Student added');
      setForm({ name: '', studentId: '', email: '', password: '', roomNo: '' });
    } catch (err) {
      alert(err?.body?.message || 'Error');
    } finally { setLoading(false); }
  }

  return React.createElement(React.Fragment, null,
    React.createElement(Navbar, null),
    React.createElement(Sidebar, null),
    React.createElement('main', { className: 'main-content' },
      React.createElement('h1', { className: 'page-title' }, 'Add Student'),
      React.createElement('form', { className: 'card form', onSubmit: submit },
        React.createElement('input', { placeholder: 'Full name', value: form.name, onChange: e => setForm({ ...form, name: e.target.value }), required: true }),
        React.createElement('input', { placeholder: 'Student ID (S101)', value: form.studentId, onChange: e => setForm({ ...form, studentId: e.target.value }), required: true }),
        React.createElement('input', { placeholder: 'Email', type: 'email', value: form.email, onChange: e => setForm({ ...form, email: e.target.value }), required: true }),
        React.createElement('input', { placeholder: 'Password', type: 'password', value: form.password, onChange: e => setForm({ ...form, password: e.target.value }), required: true }),
        React.createElement('input', { placeholder: 'Room No', value: form.roomNo, onChange: e => setForm({ ...form, roomNo: e.target.value }) }),
        React.createElement('button', { className: 'btn', type: 'submit', disabled: loading }, loading ? 'Adding...' : 'Add Student')
      )
    )
  );
}
