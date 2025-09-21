// src/hooks/usePoseDetection.js
import { useState, useEffect } from 'react';
import { initDetector, estimatePose } from '../services/poseService';

export function usePoseDetection(videoRef) {
  const [pose, setPose] = useState(null);

  useEffect(() => {
    let animationId;
    let active = true;

    async function runDetection() {
      await initDetector();

      async function detect() {
        if (!active || !videoRef.current) return;
        const detectedPose = await estimatePose(videoRef.current);
        setPose(detectedPose);
        animationId = requestAnimationFrame(detect);
      }
      detect();
    }

    runDetection();

    return () => {
      active = false;
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [videoRef]);

  return pose;
}
