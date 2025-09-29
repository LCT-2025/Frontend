import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAdmin } from './AdminContext.jsx';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading, isAuthenticated } = useAdmin();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-form">
          <div className="login-header">
            <div className="logo">
              <div className="logo-icon">🏛️</div>
              <h1>AR Manager</h1>
            </div>
            <p className="subtitle">Административная панель</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@admin.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className={`login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Вход...
                </>
              ) : (
                'Войти в систему'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Система управления AR контентом</p>
          </div>
        </div>
      </div>
    </div>
  );
}
