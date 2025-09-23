import React, { useState } from 'react';

export default function UploadPanel() {
  const [mindFile, setMindFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleMindFileChange = (e) => setMindFile(e.target.files[0]);
  const handleModelFileChange = (e) => setModelFile(e.target.files[0]);
  const handlePhotoFilesChange = (e) => setPhotoFiles(Array.from(e.target.files));

  const handleUpload = async () => {
    if (!mindFile || !modelFile || photoFiles.length === 0) {
      setUploadStatus('Пожалуйста, выберите все файлы для загрузки');
      return;
    }
    const formData = new FormData();
    formData.append('mind', mindFile);
    formData.append('model', modelFile);
    photoFiles.forEach((file, i) => formData.append(`photo_${i}`, file));

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) setUploadStatus('Загрузка успешна!');
      else setUploadStatus(`Ошибка загрузки: ${response.statusText}`);
    } catch (error) {
      setUploadStatus(`Ошибка загрузки: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Загрузка модели и .mind файла</h2>

      <label style={{ display: 'block', marginBottom: 12 }}>
        .mind файл:
        <input type="file" accept=".mind" onChange={handleMindFileChange} />
      </label>

      <label style={{ display: 'block', marginBottom: 12 }}>
        3D модель (.glb, .gltf):
        <input type="file" accept=".glb,.gltf" onChange={handleModelFileChange} />
      </label>

      <label style={{ display: 'block', marginBottom: 12 }}>
        Фото статуи (несколько):
        <input type="file" accept="image/*" multiple onChange={handlePhotoFilesChange} />
      </label>

      <button
        onClick={handleUpload}
        style={{
          padding: '10px 20px',
          fontSize: 16,
          cursor: 'pointer',
          backgroundColor: '#646cff',
          color: 'white',
          border: 'none',
          borderRadius: 6,
        }}
      >
        Загрузить
      </button>

      {uploadStatus && <p style={{ marginTop: 10 }}>{uploadStatus}</p>}
    </div>
  );
}
