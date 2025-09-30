import React from 'react';
import { useAdmin } from './AdminContext.jsx';
import CompilationPanel from '../compilation/CompilationPanel.jsx';

export default function AdminCompilation() {
  const { user } = useAdmin();

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>MindAR Компиляция</h1>
        <p>Управление компиляцией изображений и моделей для AR</p>
      </div>

      <div className="admin-content">
        <CompilationPanel />
      </div>
    </div>
  );
}
