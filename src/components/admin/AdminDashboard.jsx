import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext.jsx';
import CompilationPanel from '../compilation/CompilationPanel.jsx';
import { API_ENDPOINTS } from '../../config/api.js';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authFetch } = useAdmin();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await authFetch(API_ENDPOINTS.ADMIN_DASHBOARD);
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.dashboard);
      } else {
        setError('Ошибка загрузки данных панели');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0с';
    if (seconds < 60) return `${Math.round(seconds)}с`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}м`;
    return `${Math.round(seconds / 3600)}ч`;
  };

  // РЕАЛЬНЫЕ РАСЧЕТЫ НА ОСНОВЕ ДАННЫХ БЭКЕНДА
  const getConversionRate = () => {
    if (!dashboardData?.visits || !dashboardData?.total_downloads) return '0.0';
    return ((dashboardData.total_downloads / dashboardData.visits) * 100).toFixed(1);
  };

  const getTotalModels = () => {
    return dashboardData?.top_models?.length || 0;
  };

  const getAverageDownloadsPerModel = () => {
    if (!dashboardData?.top_models?.length || !dashboardData?.total_downloads) return '0.0';
    return (dashboardData.total_downloads / dashboardData.top_models.length).toFixed(1);
  };

  const getEngagementScore = () => {
    if (!dashboardData?.visits || !dashboardData?.avg_duration_s) return '0.0';
    // Простая формула вовлеченности: (средняя длительность в минутах * конверсия) / 10
    const avgMinutes = dashboardData.avg_duration_s / 60;
    const conversion = parseFloat(getConversionRate());
    return ((avgMinutes * conversion) / 10).toFixed(1);
  };

  if (loading) {
    return (
      <div className="admin-page loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page error">
        <div className="error-message">
          {error}
          <button onClick={fetchDashboardData} className="retry-button" style={{marginLeft: '10px'}}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page dashboard">
      <div className="page-header">
        <div className="header-content">
          <h1>Панель управления</h1>
          <p>Обзор системы и ключевые метрики</p>
        </div>
        <button onClick={fetchDashboardData} className="refresh-button">
          🔄 Обновить
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">👥</span>
            <h3>Посещения</h3>
          </div>
          <div className="metric-value">{dashboardData?.visits || 0}</div>
          <div className="metric-description">Всего сессий</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">⏱️</span>
            <h3>Средняя сессия</h3>
          </div>
          <div className="metric-value">
            {formatDuration(dashboardData?.avg_duration_s)}
          </div>
          <div className="metric-description">Время использования</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">📥</span>
            <h3>Скачивания</h3>
          </div>
          <div className="metric-value">{dashboardData?.total_downloads || 0}</div>
          <div className="metric-description">Загружено моделей</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">📊</span>
            <h3>Конверсия</h3>
          </div>
          <div className="metric-value">{getConversionRate()}%</div>
          <div className="metric-description">Скачиваний на визит</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">🎯</span>
            <h3>Активные модели</h3>
          </div>
          <div className="metric-value">{getTotalModels()}</div>
          <div className="metric-description">Моделей со скачиваниями</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">📈</span>
            <h3>Средние скачивания</h3>
          </div>
          <div className="metric-value">{getAverageDownloadsPerModel()}</div>
          <div className="metric-description">На модель</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">⭐</span>
            <h3>Вовлеченность</h3>
          </div>
          <div className="metric-value">{getEngagementScore()}</div>
          <div className="metric-description">Индекс активности</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">🔥</span>
            <h3>Успешность</h3>
          </div>
          <div className="metric-value">
            {dashboardData?.visits > 0 ? 
              Math.round((dashboardData.total_downloads / dashboardData.visits) * 1000) / 10 : 0
            }
          </div>
          <div className="metric-description">Баллов из 100</div>
        </div>
      </div>

      {dashboardData?.top_models?.length > 0 && (
        <div className="dashboard-section">
          <h2>Популярные модели</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {dashboardData.top_models.map((model, index) => (
              <div key={model.model_name} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: 'var(--admin-surface)',
                borderRadius: '12px',
                border: '1px solid var(--admin-border)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--admin-gradient)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '16px'
                }}>
                  #{index + 1}
                </div>
                <div style={{flex: 1}}>
                  <h4 style={{margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600', color: 'var(--admin-text)'}}>{model.model_name}</h4>
                  <p style={{margin: 0, color: 'var(--admin-text-light)', fontSize: '14px'}}>
                    {model.download_count} скачиваний 
                    ({((model.download_count / (dashboardData.total_downloads || 1)) * 100).toFixed(1)}% от общего числа)
                  </p>
                </div>
                <div style={{
                  width: '120px',
                  height: '8px',
                  background: 'var(--admin-surface-2)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    background: 'var(--admin-gradient)',
                    width: `${(model.download_count / (dashboardData.top_models[0]?.download_count || 1)) * 100}%`,
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="summary-card">
          <h3>Быстрые действия</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px'}}>
            <a 
              href="/admin/upload" 
              className="save-button"
              style={{textDecoration: 'none', textAlign: 'center'}}
            >
              📤 Загрузить контент
            </a>
            <a 
              href="/admin/stats" 
              className="cancel-button"
              style={{textDecoration: 'none', textAlign: 'center'}}
            >
              📈 Детальная статистика
            </a>
            <a 
              href="/admin/models" 
              className="cancel-button"
              style={{textDecoration: 'none', textAlign: 'center'}}
            >
              🎯 Управление моделями
            </a>
            <a 
              href="/admin/compilation" 
              className="cancel-button"
              style={{textDecoration: 'none', textAlign: 'center'}}
            >
              🔧 MindAR Компиляция
            </a>
          </div>
        </div>

        {dashboardData && (
          <div className="summary-card">
            <h3>Аналитика системы</h3>
            <div style={{marginTop: '16px'}}>
              <div style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '8px',
                padding: '8px 0',
                borderBottom: '1px solid var(--admin-border)'
              }}>
                <span style={{color: 'var(--admin-text-light)'}}>Общая активность:</span>
                <span style={{fontWeight: '600', color: 'var(--admin-text)'}}>
                  {(dashboardData.visits + dashboardData.total_downloads).toLocaleString()} действий
                </span>
              </div>
              <div style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '8px',
                padding: '8px 0',
                borderBottom: '1px solid var(--admin-border)'
              }}>
                <span style={{color: 'var(--admin-text-light)'}}>Эффективность:</span>
                <span style={{fontWeight: '600', color: 'var(--admin-text)'}}>
                  {getConversionRate()}% конверсия
                </span>
              </div>
              <div style={{
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '8px 0'
              }}>
                <span style={{color: 'var(--admin-text-light)'}}>Вовлеченность:</span>
                <span style={{fontWeight: '600', color: 'var(--admin-text)'}}>
                  {formatDuration(dashboardData.avg_duration_s)} средняя сессия
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
