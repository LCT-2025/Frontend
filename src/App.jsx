import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PoseDetectionPage from './components/pose_capture/PoseDetectionPage.jsx';
import XrModelContainer from './components/xr/XrModelContainer.jsx';


// <Route path="/pose" element={<PoseDetectionPage />} />

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<XrModelContainer />} />
    </Routes>
  );
}