export const takeScreenshot = () => {
  const video = document.querySelector('video');
  const canvas = document.querySelector('#root canvas');

  if (!video || !canvas) {
    console.error("Не удалось найти видео или canvas для создания скриншота.");
    return;
  }

  const tempCanvas = document.createElement('canvas');
  const context = tempCanvas.getContext('2d');

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  context.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
  context.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

  const dataUrl = tempCanvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'ar-screenshot.png';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
