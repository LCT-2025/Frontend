import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from './AdminContext.jsx';

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAdmin();

  const menuItems = [
    {
      to: '/admin/dashboard',
      icon: '📊',
      label: 'Панель управления',
      description: 'Обзор системы и метрики'
    },
    {
      to: '/admin/upload',
      icon: '📤',
      label: 'Загрузка контента',
      description: 'Модели и изображения'
    },
    {
      to: '/admin/models',
      icon: '🎯',
      label: 'Управление контентом',
      description: 'CRUD операции'
    },
    {
      to: '/admin/stats',
      icon: '📈',
      label: 'Статистика',
      description: 'Детальная аналитика'
    },
    {
      to: '/admin/compilation',
      icon: '🔧',
      label: 'MindAR Компиляция',
      description: 'Компиляция изображений'
    }
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '⟶' : '⟵'}
        </button>
        
        {!collapsed && (
          <div className="admin-brand">
            <div className="brand-icon">🏛️</div>
            <div className="brand-text">
              <h2>AR Manager</h2>
              <p>Admin Panel</p>
            </div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && (
                <div className="nav-content">
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <p className="user-email">{user?.email || 'admin@admin.com'}</p>
              <p className="user-role">{user?.role || 'administrator'}</p>
            </div>
          </div>
        )}
        
        <button 
          className="logout-button"
          onClick={logout}
          title={collapsed ? 'Выйти' : undefined}
        >
          <span className="logout-icon">🚪</span>
          {!collapsed && <span>Выйти</span>}
        </button>
      </div>
    </aside>
  );
}
