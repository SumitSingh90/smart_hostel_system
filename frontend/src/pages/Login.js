import React, { useState } from 'react';
import api from '../services/api';
import './Login.css';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      // backend expected shape: { success:true, message:'', data: { token, user }}
      const data = res && res.data ? res.data.data || res.data : res;
      const token = data.token;
      const user = data.user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      // redirect based on role
      const role = user.role || 'student';
      window.location.href = '/' + role;
    } catch (err) {
      alert(err?.body?.message || err?.message || 'Login failed');
    }
  }

  return React.createElement('div', { className: 'center-screen' },
    React.createElement('form', { className: 'card auth-card', onSubmit: submit },
      React.createElement('h2', null, 'Sign in'),
      React.createElement('div', { className: 'input-field' },
        React.createElement('label', null, 'Email'),
        React.createElement('input', { type: 'email', value: email, onChange: (e) => setEmail(e.target.value), required: true })
      ),
      React.createElement('div', { className: 'input-field' },
        React.createElement('label', null, 'Password'),
        React.createElement('input', { type: 'password', value: password, onChange: (e) => setPassword(e.target.value), required: true })
      ),
      React.createElement('button', { type: 'submit', className: 'btn' }, 'Sign in')
    )
  );
}
