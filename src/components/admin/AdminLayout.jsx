import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from './AdminContext.jsx';
import AdminSidebar from './AdminSidebar.jsx';

export default function AdminLayout() {
  const { isAuthenticated, loading } = useAdmin();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
