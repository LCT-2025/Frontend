import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext.jsx';

export default function AdminModels() {
  const [models, setModels] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('models');
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { authFetch } = useAdmin();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [modelsResponse, imagesResponse] = await Promise.all([
        fetch('http://localhost:8080/api/models'),
        fetch('http://localhost:8080/api/images')
      ]);

      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json();
        setModels(modelsData);
      }

      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        setImages(imagesData);
      }
    } catch (err) {
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const deleteModel = async (id) => {
    try {
      const response = await authFetch(`http://localhost:8080/admin/models/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setModels(models.filter(model => model.id !== id));
        setShowDeleteConfirm(null);
      } else {
        setError('Ошибка удаления модели');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    }
  };

  const deleteImage = async (id) => {
    try {
      const response = await authFetch(`http://localhost:8080/admin/images/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setImages(images.filter(image => image.id !== id));
        setShowDeleteConfirm(null);
      } else {
        setError('Ошибка удаления изображения');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    }
  };

  const updateModel = async (id, data) => {
    try {
      const response = await authFetch(`http://localhost:8080/admin/models/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const updatedModel = await response.json();
        setModels(models.map(model => model.id === id ? updatedModel : model));
        setEditingItem(null);
      } else {
        setError('Ошибка обновления модели');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    }
  };

  const updateImage = async (id, data) => {
    try {
      const response = await authFetch(`http://localhost:8080/admin/images/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const updatedImage = await response.json();
        setImages(images.map(image => image.id === id ? updatedImage : image));
        setEditingItem(null);
      } else {
        setError('Ошибка обновления изображения');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    }
  };

  const updateImageForModel = async (modelName, newImageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', newImageFile);
      formData.append('name', modelName);
      formData.append('description', `Image for model ${modelName}`);

      const response = await authFetch('http://localhost:8080/admin/images', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        fetchData();
        setSelectedImage(null);
      } else {
        setError('Ошибка обновления изображения');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    }
  };

  // Компонент для редактирования
  const EditForm = ({ item, type, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      description: item.description || '',
      params: item.params || '',
      metadata: item.metadata || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(item.id, formData);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Редактировать {type === 'model' ? 'модель' : 'изображение'}</h3>
            <button onClick={onCancel} className="close-button">×</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="fancy-field">
                <label>Название</label>
                <input 
                  type="text" 
                  value={item.name} 
                  disabled 
                  style={{opacity: 0.7}}
                />
                <small>Название нельзя изменить</small>
              </div>

              <div className="fancy-field">
                <label>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
              </div>

              {type === 'model' && (
                <div className="fancy-field">
                  <label>Параметры</label>
                  <textarea
                    value={formData.params}
                    onChange={(e) => setFormData({...formData, params: e.target.value})}
                    rows="4"
                    placeholder="JSON параметры"
                  />
                </div>
              )}

              {type === 'image' && (
                <div className="fancy-field">
                  <label>Метаданные</label>
                  <textarea
                    value={formData.metadata}
                    onChange={(e) => setFormData({...formData, metadata: e.target.value})}
                    rows="4"
                    placeholder="JSON метаданные"
                  />
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onCancel} className="cancel-button">
                Отмена
              </button>
              <button type="submit" className="save-button">
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Компонент обновления изображения
  const ImageUpdateModal = ({ model, onClose, onUpdate }) => {
    const [newImageFile, setNewImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
      setNewImageFile(e.target.files[0]);
    };

    const handleUpdate = async () => {
      if (!newImageFile) return;
      
      setUploading(true);
      await onUpdate(model.name, newImageFile);
      setUploading(false);
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Обновить изображение для модели "{model.name}"</h3>
            <button onClick={onClose} className="close-button">×</button>
          </div>
          
          <div className="modal-body">
            <div className="file-input-group">
              <label htmlFor="new-image-file" className="file-label">
                <span className="file-icon">🖼️</span>
                <span className="file-text">
                  {newImageFile ? newImageFile.name : 'Выберите новое изображение'}
                </span>
              </label>
              <input
                id="new-image-file"
                type="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.gif"
                className="file-input"
              />
            </div>

            {newImageFile && (
              <div className="image-preview" style={{marginTop: '16px', textAlign: 'center'}}>
                <img 
                  src={URL.createObjectURL(newImageFile)} 
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
          </div>

          <div className="modal-actions">
            <button onClick={onClose} className="cancel-button">
              Отмена
            </button>
            <button 
              onClick={handleUpdate} 
              disabled={!newImageFile || uploading}
              className="save-button"
            >
              {uploading ? 'Обновление...' : 'Обновить изображение'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="admin-page loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page models">
      <div className="page-header">
        <div className="header-content">
          <h1>Управление контентом</h1>
          <p>CRUD операции над моделями и изображениями</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} style={{float: 'right', background: 'none', border: 'none', color: 'inherit'}}>×</button>
        </div>
      )}

      <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
        <button 
          className={`tab-button ${activeTab === 'models' ? 'active' : ''}`}
          onClick={() => setActiveTab('models')}
          style={{padding: '12px 16px', borderRadius: '8px'}}
        >
          🎯 Модели ({models.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
          style={{padding: '12px 16px', borderRadius: '8px'}}
        >
          🖼️ Изображения ({images.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'relationships' ? 'active' : ''}`}
          onClick={() => setActiveTab('relationships')}
          style={{padding: '12px 16px', borderRadius: '8px'}}
        >
          🔗 Связи моделей
        </button>
      </div>

      {activeTab === 'models' && (
        <div className="models-grid">
          {models.map(model => (
            <div key={model.id} className="content-card">
              <div className="card-header">
                <h3>{model.name}</h3>
                <div className="card-actions">
                  <button 
                    onClick={() => setSelectedImage(model)}
                    className="action-button"
                    style={{background: 'var(--admin-warning)'}}
                    title="Обновить изображение"
                  >
                    🖼️
                  </button>
                  <button 
                    onClick={() => setEditingItem(model)}
                    className="action-button"
                    style={{background: 'var(--admin-primary)'}}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(model)}
                    className="action-button"
                    style={{background: 'var(--admin-error)'}}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="card-content">
                <div className="relationship-item">
                  <label>ID:</label>
                  <span>{model.id}</span>
                </div>
                <div className="relationship-item">
                  <label>Файл:</label>
                  <span>{model.file_path}</span>
                </div>
                <div className="relationship-item">
                  <label>Описание:</label>
                  <span>{model.description || 'Не указано'}</span>
                </div>
                <div className="relationship-item">
                  <label>Создан:</label>
                  <span>{new Date(model.created_at).toLocaleString('ru')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'images' && (
        <div className="models-grid">
          {images.map(image => (
            <div key={image.id} className="content-card">
              <div className="card-header">
                <h3>{image.name}</h3>
                <div className="card-actions">
                  <button 
                    onClick={() => setEditingItem(image)}
                    className="action-button"
                    style={{background: 'var(--admin-primary)'}}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(image)}
                    className="action-button"
                    style={{background: 'var(--admin-error)'}}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="card-content">
                <div style={{
                  height: '160px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--admin-border)',
                  marginBottom: '12px'
                }}>
                  <img 
                    src={`http://localhost:8080/files/image/${image.name}`}
                    alt={image.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div className="relationship-item">
                  <label>ID:</label>
                  <span>{image.id}</span>
                </div>
                <div className="relationship-item">
                  <label>Файл:</label>
                  <span>{image.file_path}</span>
                </div>
                <div className="relationship-item">
                  <label>Описание:</label>
                  <span>{image.description || 'Не указано'}</span>
                </div>
                <div className="relationship-item">
                  <label>Создан:</label>
                  <span>{new Date(image.created_at).toLocaleString('ru')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'relationships' && (
        <div className="relationships-section">
          <div className="section-header">
            <h2>Связи моделей и изображений</h2>
            <p>Модели и изображения связываются автоматически по совпадению названия</p>
          </div>
          
          <div className="relationships-grid">
            {models.map(model => {
              const relatedImage = images.find(img => img.name === model.name);
              return (
                <div key={model.id} className="relationship-card">
                  <div className="relationship-header">
                    <h4>{model.name}</h4>
                    <span className={`status ${relatedImage ? 'linked' : 'unlinked'}`}>
                      {relatedImage ? '🔗 Связано' : '❌ Нет связи'}
                    </span>
                  </div>
                  
                  <div className="relationship-content">
                    <div className="relationship-item">
                      <label>Модель:</label>
                      <span>{model.name} (ID: {model.id})</span>
                    </div>
                    <div className="relationship-item">
                      <label>Изображение:</label>
                      <span>
                        {relatedImage ? 
                          `${relatedImage.name} (ID: ${relatedImage.id})` : 
                          'Не найдено'
                        }
                      </span>
                    </div>
                  </div>
                  
                  {!relatedImage && (
                    <button 
                      onClick={() => setSelectedImage(model)}
                      className="create-image-button"
                    >
                      📤 Создать изображение
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Модалы */}
      {editingItem && (
        <EditForm
          item={editingItem}
          type={editingItem.file_path?.includes('uploads/models') ? 'model' : 'image'}
          onSave={editingItem.file_path?.includes('uploads/models') ? updateModel : updateImage}
          onCancel={() => setEditingItem(null)}
        />
      )}

      {selectedImage && (
        <ImageUpdateModal
          model={selectedImage}
          onClose={() => setSelectedImage(null)}
          onUpdate={updateImageForModel}
        />
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Подтверждение удаления</h3>
            </div>
            <div className="modal-body">
              <p>
                Вы уверены, что хотите удалить 
                <strong> "{showDeleteConfirm.name}"</strong>?
              </p>
              <p style={{color: 'var(--admin-error)', fontWeight: '600'}}>
                Это действие нельзя отменить!
              </p>
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="cancel-button"
              >
                Отмена
              </button>
              <button 
                onClick={() => {
                  if (showDeleteConfirm.file_path?.includes('uploads/models')) {
                    deleteModel(showDeleteConfirm.id);
                  } else {
                    deleteImage(showDeleteConfirm.id);
                  }
                }}
                className="save-button"
                style={{background: 'var(--admin-error)'}}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
