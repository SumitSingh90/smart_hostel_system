import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// pages
import Login from './pages/Login';
// admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AddStudent from './pages/admin/AddStudent';
import AddWorker from './pages/admin/AddWorker';
import Complaints from './pages/admin/Complaints';
import AssignWorker from './pages/admin/AssignWorker';
import SendMail from './pages/admin/SendMail';

// student pages
import StudentDashboard from './pages/student/StudentDashboard';
import SubmitComplaint from './pages/student/SubmitComplaint';
import MyComplaints from './pages/student/MyComplaints';
import CleaningSchedule from './pages/student/CleaningSchedule';
import ViewMenu from './pages/student/ViewMenu';

// worker pages
import WorkerDashboard from './pages/worker/WorkerDashboard';
import Tasks from './pages/worker/Tasks';
import AddMenu from './pages/worker/AddMenu';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/add-student" element={<ProtectedRoute allowedRoles={['admin']}><AddStudent /></ProtectedRoute>} />
      <Route path="/admin/add-worker" element={<ProtectedRoute allowedRoles={['admin']}><AddWorker /></ProtectedRoute>} />
      <Route path="/admin/complaints" element={<ProtectedRoute allowedRoles={['admin']}><Complaints /></ProtectedRoute>} />
      <Route path="/admin/assign-worker/:id" element={<ProtectedRoute allowedRoles={['admin']}><AssignWorker /></ProtectedRoute>} />
      <Route path="/admin/send-mail" element={<ProtectedRoute allowedRoles={['admin']}><SendMail /></ProtectedRoute>} />

      {/* student */}
      <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/submit-complaint" element={<ProtectedRoute allowedRoles={['student']}><SubmitComplaint /></ProtectedRoute>} />
      <Route path="/student/my-complaints" element={<ProtectedRoute allowedRoles={['student']}><MyComplaints /></ProtectedRoute>} />
      <Route path="/student/cleaning-schedule" element={<ProtectedRoute allowedRoles={['student']}><CleaningSchedule /></ProtectedRoute>} />
      <Route path="/student/menu" element={<ProtectedRoute allowedRoles={['student']}><ViewMenu /></ProtectedRoute>} />

      {/* worker */}
      <Route path="/worker" element={<ProtectedRoute allowedRoles={['worker']}><WorkerDashboard /></ProtectedRoute>} />
      <Route path="/worker/tasks" element={<ProtectedRoute allowedRoles={['worker']}><Tasks /></ProtectedRoute>} />
      <Route path="/worker/add-menu" element={<ProtectedRoute allowedRoles={['worker']}><AddMenu /></ProtectedRoute>} />

      {/* fallback */}
      <Route path="*" element={<div style={{ padding: 40 }}>Page not found</div>} />
    </Routes>
  );
}
