import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { to: '/', label: 'Model', icon: '🎯' },
    { to: '/xr', label: 'XR Model', icon: '🥽' },
    { to: '/pose', label: 'Pose Detection', icon: '🤸‍♂️' },
    { to: '/admin', label: 'Admin Panel', icon: '⚙️' },
  ];

  return (
    <div className="app-layout">
      {/* Main content always visible */}
      <div className="app-container">
        <Outlet />
      </div>

      {/* Floating navigation menu */}
      <div className={`nav-overlay ${open ? 'open' : ''}`}>
        <button 
          className="nav-toggle"
          onClick={() => setOpen(!open)}
        >
          {open ? '✕' : '☰'}
        </button>

        {open && (
          <nav className="floating-nav">
            <div className="nav-header">
              <h2>AR System</h2>
            </div>
            <div className="nav-items">
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nav-item ${location.pathname === item.to ? 'active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
