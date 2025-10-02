import React from 'react';
import { Routes, Route } from 'react-router-dom';

import XrModelContainer from './components/xr/XrModelContainer.jsx';
import ModelContainer from './components/xr/ModelContainer.jsx';
import AdminApp from './AdminApp.jsx';
import Landing from './components/Landing.jsx';
import { useMetrics } from './hooks/useMetrics.js';

export default function App() {
  useMetrics(); // Отслеживание метрик

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/ar" element={<XrModelContainer />} />
      
      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  );
}
