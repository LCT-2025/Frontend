import React, { useState, useRef, useEffect } from 'react';
import CameraStream from './CameraStream';
import PoseCanvas from './PoseCanvas';
import { usePoseDetection } from '../hooks/usePoseDetection';

export default function App() {
  const [videoSize, setVideoSize] = useState({ width: 640, height: 480 });
  const [displaySize, setDisplaySize] = useState({ width: 640, height: 480 });
  const [photo, setPhoto] = useState(null);
  const videoRef = useRef(null);

  const pose = usePoseDetection(videoRef);

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

  function capturePhoto() {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL('image/png');
    setPhoto(imageDataURL);
  }

  function downloadPhoto() {
    if (!photo) return;

    const a = document.createElement('a');
    a.href = photo;
    a.download = 'snapshot.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Pose Detection Demo</h1>

      <div style={styles.videoContainer}>
        <CameraStream onVideoReady={handleVideoReady} />
        <PoseCanvas
          pose={pose}
          videoWidth={videoSize.width}
          videoHeight={videoSize.height}
          displayWidth={displaySize.width}
          displayHeight={displaySize.height}
        />
      </div>

      <div style={styles.controls}>
        <button style={styles.button} onClick={capturePhoto}>
          Сделать снимок
        </button>
        {photo && (
          <button style={{ ...styles.button, marginLeft: 12 }} onClick={downloadPhoto}>
            Скачать
          </button>
        )}
      </div>

      {photo && (
        <div style={styles.photoContainer}>
          <h2 style={styles.photoTitle}>Сделанное фото:</h2>
          <img src={photo} alt="Captured" style={styles.photo} />
        </div>
      )}

      <p style={styles.footerText}>
        Смотрите на камеру, и модель будет отображать ключевые точки на видео.
      </p>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 700,
    margin: '20px auto',
    padding: 16,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#eee',
    backgroundColor: '#121212',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: '2.5rem',
    textAlign: 'center',
    color: '#f0f0f0',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: 700,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.15)',
    backgroundColor: '#000',
  },
  controls: {
    marginTop: 20,
    textAlign: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#646cff',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '12px 24px',
    fontSize: 18,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(100, 110, 255, 0.6)',
    transition: 'background-color 0.3s ease',
  },
  photoContainer: {
    marginTop: 24,
    textAlign: 'center',
    width: '100%',
  },
  photoTitle: {
    marginBottom: 12,
    color: '#eee',
  },
  photo: {
    maxWidth: '100%',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(100, 110, 255, 0.7)',
  },
  footerText: {
    marginTop: 32,
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 600,
  },
};
