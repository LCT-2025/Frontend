import React, { useRef, useEffect } from 'react';

function drawKeypoints(ctx, keypoints, scaleX, scaleY) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = 'rgba(0, 150, 255, 0.8)';
  ctx.strokeStyle = 'rgba(0, 150, 255, 0.5)';
  ctx.lineWidth = 2;

  keypoints.forEach(({ x, y, score }) => {
    if (score > 0.4) {
      ctx.beginPath();
      ctx.arc(x * scaleX, y * scaleY, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  });
}

export default function PoseCanvas({ pose, videoWidth, videoHeight, displayWidth, displayHeight }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (pose && pose.keypoints && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      // Масштабируем координаты позы под отображаемый размер видео
      const scaleX = displayWidth / videoWidth;
      const scaleY = displayHeight / videoHeight;

      drawKeypoints(ctx, pose.keypoints, scaleX, scaleY);
    } else if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, displayWidth, displayHeight);
    }
  }, [pose, videoWidth, videoHeight, displayWidth, displayHeight]);

  return (
    <canvas
      ref={canvasRef}
      width={displayWidth}
      height={displayHeight}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    />
  );
}
