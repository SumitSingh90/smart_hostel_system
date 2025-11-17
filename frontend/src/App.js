// App.js - Full-feature frontend for Smart Hostel System

import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Admin } from "./admin";
import { Student } from "./studentDashboard";
import { Worker } from "./workerDashboard";
import "./App.css"; // <-- NEW CSS FILE

const API = "http://localhost:5000";

function Login({ setToken, setUser }) {
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch(`${API}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });

    const data = await res.json();
    if (data.error) return alert(data.error);

    setToken(data.token);
    setUser(data.user);

    if (data.user.role === "admin") navigate("/admin");
    if (data.user.role === "student") navigate("/student");
    if (data.user.role === "worker") navigate("/worker");
  }

  return (
    <div className="page">
      <div className="login-card">
        <h2 className="title">HostelCare Login</h2>

        <form onSubmit={handleLogin} className="form">
          <input name="email" placeholder="Email" required className="input" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="input"
          />

          <button className="btn">Login</button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  return (
    <Routes>
      <Route
        path="/"
        element={<Login setToken={setToken} setUser={setUser} />}
      />

      <Route
        path="/student"
        element={
          token && user?.role === "student" ? (
            <Student token={token} user={user} />
          ) : (
            <Login setToken={setToken} setUser={setUser} />
          )
        }
      />

      <Route
        path="/admin"
        element={
          token && user?.role === "admin" ? (
            <Admin token={token} />
          ) : (
            <Login setToken={setToken} setUser={setUser} />
          )
        }
      />

      <Route
        path="/worker"
        element={
          token && user?.role === "worker" ? (
            <Worker token={token} />
          ) : (
            <Login setToken={setToken} setUser={setUser} />
          )
        }
      />
    </Routes>
  );
}

export default App;
