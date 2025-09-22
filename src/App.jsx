import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PoseDetectionPage from './components/pose_capture/PoseDetectionPage.jsx';
import XrModelContainer from './components/xr/XrModelContainer.jsx';
import ModelContainer from './components/xr/ModelContainer.jsx';



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ModelContainer />} />
      <Route path="/xr" element={<XrModelContainer />} />
      <Route path="/pose" element={<PoseDetectionPage />} />
    </Routes>
  );
}