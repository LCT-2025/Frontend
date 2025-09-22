import React from 'react';
import { useCamera } from '../../hooks/useCamera';

export default function CameraStream({ onVideoReady }) {
  const { videoRef, error } = useCamera();

  React.useEffect(() => {
    if (videoRef.current && onVideoReady) {
      // Событие срабатывает, когда метаданные видео (в том числе размеры) загружены
      videoRef.current.onloadedmetadata = () => {
        onVideoReady(videoRef.current);
      };
    }
  }, [videoRef, onVideoReady]);

  if (error) {
    return (
      <div style={{ color: 'red', padding: 16 }}>
        Ошибка доступа к камере: {error.message}
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      style={{
        width: '100%',
        maxHeight: '80vh',
        borderRadius: 8,
        backgroundColor: '#000',
        objectFit: 'cover', // чтобы видео аккуратно масштабировалось без искажений
      }}
      playsInline
      muted
      autoPlay
    />
  );
}
