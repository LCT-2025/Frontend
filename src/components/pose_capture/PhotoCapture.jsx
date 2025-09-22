import React, { useState, useRef } from 'react';

export default function PhotoCapture({ videoRef }) {
  const [photo, setPhoto] = useState(null);

  function capturePhoto() {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataURL = canvas.toDataURL('image/png');
    setPhoto(imageDataURL);
  }

  return (
    <div style={{ marginTop: 16, textAlign: 'center' }}>
      <button onClick={capturePhoto}>Сделать фото</button>

      {photo && (
        <div style={{ marginTop: 16 }}>
          <h3>Сделанное фото:</h3>
          <img src={photo} alt="Captured" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
}
