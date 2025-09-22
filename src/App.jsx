import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PoseDetectionPage from './components/pose_capture/PoseDetectionPage.jsx';
import XrModelContainer from './components/xr/XrModelContainer.jsx';
import CubeContainer from './components/xr/CubeContainer.jsx';



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CubeContainer />} />
      <Route path="/xr" element={<XrModelContainer />} />
      <Route path="/pose" element={<PoseDetectionPage />} />
    </Routes>
  );
}