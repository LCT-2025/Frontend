import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { to: '/', label: 'Model' },
    { to: '/xr', label: 'XR Model' },
    { to: '/pose', label: 'Pose Detection' },
    { to: '/upload', label: 'Upload' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <aside
        style={{
          width: open ? 220 : 68,
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: '#1f2937',
          color: '#f9fafb',
          padding: '1rem 1rem 1rem 0.5rem',
          boxSizing: 'border-box',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: open ? 'flex-start' : 'center',
          position: 'relative',
          userSelect: 'none',
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{
            background: 'none',
            border: 'none',
            color: '#a5b4fc',
            fontSize: 24,
            cursor: 'pointer',
            marginBottom: '1.5rem',
            alignSelf: open ? 'flex-end' : 'center',
            padding: '0 0.5rem',
            transition: 'color 0.3s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#6366f1')}
          onMouseLeave={e => (e.currentTarget.style.color = '#a5b4fc')}
        >
          {open ? '←' : '→'}
        </button>

        {menuItems.map(({ to, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.6rem 1rem',
                marginBottom: '0.4rem',
                color: active ? '#4338ca' : '#d1d5db',
                backgroundColor: active ? '#e0e7ff' : 'transparent',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: active ? '600' : '500',
                boxShadow: active ? '0 2px 8px rgba(99,102,241,0.5)' : 'none',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap',
                justifyContent: open ? 'flex-start' : 'center',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = active ? '#c7d2fe' : '#374151')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = active ? '#e0e7ff' : 'transparent')}
            >
              {/* Icon placeholder */}
              <span
                style={{
                  display: 'inline-block',
                  width: 24,
                  height: 24,
                  marginRight: open ? 12 : 0,
                  backgroundColor: active ? '#4338ca' : '#9ca3af',
                  borderRadius: 4,
                  transition: 'background-color 0.3s',
                  flexShrink: 0,
                }}
              />
              {open && label}
            </Link>
          );
        })}

        <footer style={{ marginTop: 'auto', padding: '1rem', fontSize: 12, color: '#6b7280', textAlign: open ? 'left' : 'center' }}>
          © 2025 YourApp
        </footer>
      </aside>

      <main style={{ flexGrow: 1, padding: 24, backgroundColor: '#f3f4f6', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
