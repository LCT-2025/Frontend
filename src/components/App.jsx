import React, { useState, useRef, useEffect } from 'react';
import CameraStream from './CameraStream';
import PoseCanvas from './PoseCanvas';
import { usePoseDetection } from '../hooks/usePoseDetection';

export default function App() {
  const [videoSize, setVideoSize] = useState({ width: 640, height: 480 });
  const [displaySize, setDisplaySize] = useState({ width: 640, height: 480 });
  const videoRef = useRef(null);

  // Получаем текущую позу с видео
  const pose = usePoseDetection(videoRef);

  // Обработчик готовности видео — сохраняем размеры для канваса и отображаемый размер видео
  function handleVideoReady(videoElement) {
    videoRef.current = videoElement;
    setVideoSize({
      width: videoElement.videoWidth,
      height: videoElement.videoHeight,
    });
    setDisplaySize({
      width: videoElement.clientWidth,
      height: videoElement.clientHeight,
    });
  }

  // Для обновления отображаемого размера при ресайзе окна
  useEffect(() => {
    function handleResize() {
      if (videoRef.current) {
        setDisplaySize({
          width: videoRef.current.clientWidth,
          height: videoRef.current.clientHeight,
        });
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Pose Detection Demo</h1>

      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <CameraStream onVideoReady={handleVideoReady} />
        <PoseCanvas
          pose={pose}
          videoWidth={videoSize.width}
          videoHeight={videoSize.height}
          displayWidth={displaySize.width}
          displayHeight={displaySize.height}
        />
      </div>

      <p style={{ textAlign: 'center', marginTop: 12 }}>
        Смотрите на камеру, и модель будет отображать ключевые точки на видео.
      </p>
    </div>
  );
}
