import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminLogin from './components/admin/AdminLogin.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import AdminUpload from './components/admin/AdminUpload.jsx';
import AdminStats from './components/admin/AdminStats.jsx';
import AdminModels from './components/admin/AdminModels.jsx';
import { AdminProvider } from './components/admin/AdminContext.jsx';

export default function AdminApp() {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="upload" element={<AdminUpload />} />
          <Route path="stats" element={<AdminStats />} />
          <Route path="models" element={<AdminModels />} />
        </Route>
      </Routes>
    </AdminProvider>
  );
}
