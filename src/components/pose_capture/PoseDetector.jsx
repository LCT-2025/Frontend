import React, { useRef, useEffect } from 'react';

function drawKeypoints(ctx, keypoints) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = 'red';
  keypoints.forEach(({ x, y, score }) => {
    if (score > 0.5) {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
}

export default function PoseDetector({ pose, width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (pose && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      drawKeypoints(ctx, pose.keypoints);
    }
  }, [pose]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }} />;
}
