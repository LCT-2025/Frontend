import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import PoseDetectionPage from './components/pose_capture/PoseDetectionPage.jsx';
import XrModelContainer from './components/xr/XrModelContainer.jsx';
import ModelContainer from './components/xr/ModelContainer.jsx';
import AdminApp from './AdminApp.jsx';
import { useMetrics } from './hooks/useMetrics.js';

export default function App() {
  useMetrics(); // Отслеживание метрик

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<ModelContainer />} />
        <Route path="xr" element={<XrModelContainer />} />
        <Route path="pose" element={<PoseDetectionPage />} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  );
}
