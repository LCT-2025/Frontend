import React, { useState } from 'react';
import { useAdmin } from './AdminContext.jsx';

export default function AdminUpload() {
  const [activeTab, setActiveTab] = useState('model');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');
  const { authFetch } = useAdmin();

  const [modelData, setModelData] = useState({
    file: null,
    name: '',
    description: '',
    category: '',
    tags: '',
    author: '',
    version: '1.0'
  });

  const [imageData, setImageData] = useState({
    file: null,
    name: '',
    description: '',
    category: '',
    tags: '',
    resolution: '',
    format: ''
  });

  const handleModelFileChange = (e) => {
    const file = e.target.files[0];
    setModelData({
      ...modelData,
      file,
      name: modelData.name || (file ? file.name.replace(/\.[^/.]+$/, '') : '')
    });
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    setImageData({
      ...imageData,
      file,
      name: imageData.name || (file ? file.name.replace(/\.[^/.]+$/, '') : '')
    });
  };

  const uploadModel = async () => {
    if (!modelData.file) {
      setError('Выберите файл модели');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Создаем JSON параметры из понятных полей
      const params = {
        category: modelData.category,
        tags: modelData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        author: modelData.author,
        version: modelData.version,
        uploadedAt: new Date().toISOString()
      };

      const formData = new FormData();
      formData.append('file', modelData.file);
      if (modelData.name) formData.append('name', modelData.name);
      if (modelData.description) formData.append('description', modelData.description);
      formData.append('params', JSON.stringify(params));

      const response = await authFetch('https://api.xn--b1agjiduva.xn--p1ai/admin/models', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setUploadResult({ type: 'model', data: result });
        setModelData({ 
          file: null, name: '', description: '', category: '', 
          tags: '', author: '', version: '1.0' 
        });
        // Reset file input
        const fileInput = document.getElementById('model-file');
        if (fileInput) fileInput.value = '';
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка загрузки модели');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = async () => {
    if (!imageData.file) {
      setError('Выберите файл изображения');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Создаем JSON метаданные из понятных полей
      const metadata = {
        category: imageData.category,
        tags: imageData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        resolution: imageData.resolution,
        format: imageData.format,
        uploadedAt: new Date().toISOString()
      };

      const formData = new FormData();
      formData.append('file', imageData.file);
      if (imageData.name) formData.append('name', imageData.name);
      if (imageData.description) formData.append('description', imageData.description);
      formData.append('metadata', JSON.stringify(metadata));

      const response = await authFetch('https://api.xn--b1agjiduva.xn--p1ai/admin/images', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setUploadResult({ type: 'image', data: result });
        setImageData({ 
          file: null, name: '', description: '', category: '', 
          tags: '', resolution: '', format: '' 
        });
        // Reset file input
        const fileInput = document.getElementById('image-file');
        if (fileInput) fileInput.value = '';
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка загрузки изображения');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-page upload">
      <div className="page-header">
        <div className="header-content">
          <h1>Загрузка контента</h1>
          <p>Загрузите модели и изображения в систему</p>
        </div>
      </div>

      <div className="upload-container">
        <div className="upload-tabs">
          <button 
            className={`tab-button ${activeTab === 'model' ? 'active' : ''}`}
            onClick={() => setActiveTab('model')}
          >
            🎯 Модели
          </button>
          <button 
            className={`tab-button ${activeTab === 'image' ? 'active' : ''}`}
            onClick={() => setActiveTab('image')}
          >
            🖼️ Изображения
          </button>
        </div>

        {activeTab === 'model' && (
          <div style={{padding: '24px'}}>
            <div className="file-input-group">
              <label htmlFor="model-file" className="file-label">
                <span className="file-icon">📁</span>
                <span className="file-text">
                  {modelData.file ? modelData.file.name : 'Выберите файл модели (.mind, .glb, .gltf)'}
                </span>
              </label>
              <input
                id="model-file"
                type="file"
                onChange={handleModelFileChange}
                accept=".mind,.glb,.gltf"
                className="file-input"
              />
            </div>

            <div className="fancy-field">
              <label>Название модели</label>
              <input
                type="text"
                value={modelData.name}
                onChange={(e) => setModelData({...modelData, name: e.target.value})}
                placeholder="Например: Citrus"
              />
              <small>Если не указано, будет использовано имя файла без расширения</small>
            </div>

            <div className="fancy-field">
              <label>Описание</label>
              <textarea
                value={modelData.description}
                onChange={(e) => setModelData({...modelData, description: e.target.value})}
                placeholder="Краткое описание модели и её особенностей"
                rows="3"
              />
            </div>

            <div className="fancy-field">
              <label>Категория</label>
              <select
                value={modelData.category}
                onChange={(e) => setModelData({...modelData, category: e.target.value})}
              >
                <option value="">Выберите категорию</option>
                <option value="characters">Персонажи</option>
                <option value="objects">Объекты</option>
                <option value="environments">Окружение</option>
                <option value="effects">Эффекты</option>
                <option value="ui">UI элементы</option>
              </select>
            </div>

            <div className="fancy-field">
              <label>Теги</label>
              <input
                type="text"
                value={modelData.tags}
                onChange={(e) => setModelData({...modelData, tags: e.target.value})}
                placeholder="3D, AR, анимация, low-poly (через запятую)"
              />
              <small>Введите теги через запятую для лучшего поиска</small>
            </div>

            <div className="fancy-field">
              <label>Автор</label>
              <input
                type="text"
                value={modelData.author}
                onChange={(e) => setModelData({...modelData, author: e.target.value})}
                placeholder="Имя автора или студии"
              />
            </div>

            <div className="fancy-field">
              <label>Версия</label>
              <input
                type="text"
                value={modelData.version}
                onChange={(e) => setModelData({...modelData, version: e.target.value})}
                placeholder="1.0"
              />
              <small>Версия модели для отслеживания изменений</small>
            </div>

            <button 
              onClick={uploadModel}
              disabled={uploading || !modelData.file}
              className="upload-button"
              style={{width: '100%', marginTop: '16px'}}
            >
              {uploading ? 'Загрузка...' : '📤 Загрузить модель'}
            </button>
          </div>
        )}

        {activeTab === 'image' && (
          <div style={{padding: '24px'}}>
            <div className="file-input-group">
              <label htmlFor="image-file" className="file-label">
                <span className="file-icon">🖼️</span>
                <span className="file-text">
                  {imageData.file ? imageData.file.name : 'Выберите изображение (.jpg, .png, .gif)'}
                </span>
              </label>
              <input
                id="image-file"
                type="file"
                onChange={handleImageFileChange}
                accept=".jpg,.jpeg,.png,.gif"
                className="file-input"
              />
            </div>

            {imageData.file && (
              <div style={{
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                <img 
                  src={URL.createObjectURL(imageData.file)} 
                  alt="Preview"
                  onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '12px',
                    border: '1px solid var(--admin-border)'
                  }}
                />
              </div>
            )}

            <div className="fancy-field">
              <label>Название изображения</label>
              <input
                type="text"
                value={imageData.name}
                onChange={(e) => setImageData({...imageData, name: e.target.value})}
                placeholder="Например: Citrus"
              />
              <small>Если не указано, будет использовано имя файла без расширения</small>
            </div>

            <div className="fancy-field">
              <label>Описание</label>
              <textarea
                value={imageData.description}
                onChange={(e) => setImageData({...imageData, description: e.target.value})}
                placeholder="Описание изображения и его назначение"
                rows="3"
              />
            </div>

            <div className="fancy-field">
              <label>Категория</label>
              <select
                value={imageData.category}
                onChange={(e) => setImageData({...imageData, category: e.target.value})}
              >
                <option value="">Выберите категорию</option>
                <option value="textures">Текстуры</option>
                <option value="markers">Маркеры</option>
                <option value="backgrounds">Фоны</option>
                <option value="icons">Иконки</option>
                <option value="previews">Превью</option>
              </select>
            </div>

            <div className="fancy-field">
              <label>Теги</label>
              <input
                type="text"
                value={imageData.tags}
                onChange={(e) => setImageData({...imageData, tags: e.target.value})}
                placeholder="AR маркер, высокое качество, цветной (через запятую)"
              />
              <small>Введите теги через запятую для лучшего поиска</small>
            </div>

            <div className="fancy-field">
              <label>Разрешение</label>
              <select
                value={imageData.resolution}
                onChange={(e) => setImageData({...imageData, resolution: e.target.value})}
              >
                <option value="">Выберите разрешение</option>
                <option value="512x512">512×512</option>
                <option value="1024x1024">1024×1024</option>
                <option value="2048x2048">2048×2048</option>
                <option value="1920x1080">1920×1080</option>
                <option value="custom">Другое</option>
              </select>
            </div>

            <div className="fancy-field">
              <label>Назначение</label>
              <select
                value={imageData.format}
                onChange={(e) => setImageData({...imageData, format: e.target.value})}
              >
                <option value="">Выберите назначение</option>
                <option value="ar_marker">AR маркер</option>
                <option value="texture">Текстура</option>
                <option value="preview">Превью модели</option>
                <option value="background">Фоновое изображение</option>
                <option value="ui">UI элемент</option>
              </select>
            </div>

            <button 
              onClick={uploadImage}
              disabled={uploading || !imageData.file}
              className="upload-button"
              style={{width: '100%', marginTop: '16px'}}
            >
              {uploading ? 'Загрузка...' : '📤 Загрузить изображение'}
            </button>
          </div>
        )}

        {error && (
          <div className="error-message" style={{margin: '16px'}}>
            {error}
          </div>
        )}

        {uploadResult && (
          <div className="summary-card" style={{
            margin: '16px',
            borderColor: 'var(--admin-success)',
            color: 'var(--admin-success)'
          }}>
            ✅ <strong>{uploadResult.type === 'model' ? 'Модель' : 'Изображение'}</strong> успешно загружено!
            <br />
            Название: <strong>{uploadResult.data.name}</strong>
            <br />
            ID: <strong>{uploadResult.data.id}</strong>
            <button 
              onClick={() => setUploadResult(null)}
              style={{
                float: 'right',
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
