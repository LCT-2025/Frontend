import React, { useState } from "react";
import { useAdmin } from "./AdminContext.jsx";

export default function AdminUpload() {
  const [activeTab, setActiveTab] = useState("model");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState("");
  const { authFetch } = useAdmin();

  // Модель
  const [modelData, setModelData] = useState({
    file: null,
    name: "",
    description: "",
    category: "",
    tags: "",
    author: "",
    version: "1.0",
  });

  // Изображение
  const [imageData, setImageData] = useState({
    file: null,
    name: "",
    description: "",
    category: "",
    tags: "",
    resolution: "",
    format: "",
  });

  // .mind
  const [mindData, setMindData] = useState({
    file: null,
    name: "",
  });

  // === handlers: files ===
  const handleModelFileChange = (e) => {
    const file = e.target.files[0];
    setModelData((prev) => ({
      ...prev,
      file,
      name: prev.name || (file ? file.name.replace(/\.(glb|gltf)$/i, "") : ""),
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    setImageData((prev) => ({
      ...prev,
      file,
      name: prev.name || (file ? file.name.replace(/\.(jpe?g|png|gif)$/i, "") : ""),
    }));
  };

  const handleMindFileChange = (e) => {
    const file = e.target.files[0];
    setMindData((prev) => ({
      ...prev,
      file,
      name: prev.name || (file ? file.name.replace(/\.mind$/i, "") : ""),
    }));
  };

  // === uploads ===
  const uploadModel = async () => {
    if (!modelData.file) {
      setError("Выберите файл модели");
      return;
    }
    try {
      setUploading(true);
      setError("");

      const params = {
        category: modelData.category,
        tags: modelData.tags.split(",").map((tag) => tag.trim()).filter((t) => t),
        author: modelData.author,
        version: modelData.version,
        uploadedAt: new Date().toISOString(),
      };

      const formData = new FormData();
      formData.append("file", modelData.file);
      if (modelData.name) formData.append("name", modelData.name);
      if (modelData.description) formData.append("description", modelData.description);
      formData.append("params", JSON.stringify(params));

      const response = await authFetch("http://localhost:8080/admin/models", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadResult({ type: "model", data: result });
        setModelData({
          file: null,
          name: "",
          description: "",
          category: "",
          tags: "",
          author: "",
          version: "1.0",
        });
        const fileInput = document.getElementById("model-file");
        if (fileInput) fileInput.value = "";
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || "Ошибка загрузки модели");
      }
    } catch (err) {
      setError(err?.message || "Ошибка сети");
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = async () => {
    if (!imageData.file) {
      setError("Выберите изображение");
      return;
    }
    try {
      setUploading(true);
      setError("");

      const metadata = {
        category: imageData.category,
        tags: imageData.tags.split(",").map((tag) => tag.trim()).filter((t) => t),
        resolution: imageData.resolution,
        format: imageData.format,
        uploadedAt: new Date().toISOString(),
      };

      const formData = new FormData();
      formData.append("file", imageData.file);
      if (imageData.name) formData.append("name", imageData.name);
      if (imageData.description) formData.append("description", imageData.description);
      formData.append("metadata", JSON.stringify(metadata));

      const response = await authFetch("http://localhost:8080/admin/images", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadResult({ type: "image", data: result });
        setImageData({
          file: null,
          name: "",
          description: "",
          category: "",
          tags: "",
          resolution: "",
          format: "",
        });
        const fileInput = document.getElementById("image-file");
        if (fileInput) fileInput.value = "";
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || "Ошибка загрузки изображения");
      }
    } catch (err) {
      setError(err?.message || "Ошибка сети");
    } finally {
      setUploading(false);
    }
  };

  // НОВОЕ: загрузка .mind на публичный эндпоинт
  const uploadMind = async () => {
    if (!mindData.file) {
      setError("Выберите .mind файл");
      return;
    }
    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", mindData.file);
      if (mindData.name) formData.append("name", mindData.name);

      // Публичный эндпоинт .mind
      const response = await fetch("http://localhost:8080/api/mind", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadResult({ type: "mind", data: result });
        setMindData({ file: null, name: "" });
        const fileInput = document.getElementById("mind-file");
        if (fileInput) fileInput.value = "";
      } else {
        const errData = await response.json().catch(() => ({}));
        setError(errData.error || "Ошибка загрузки .mind");
      }
    } catch (err) {
      setError(err?.message || "Ошибка сети");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-page upload">
      <div className="page-header">
        <div className="header-content">
          <h1>Загрузка ассетов</h1>
          <p>Загружайте 3D модели, изображения и .mind файлы для AR</p>
        </div>
      </div>

      <div className="upload-container">
        <div className="upload-tabs">
          <button
            className={`tab-button ${activeTab === "model" ? "active" : ""}`}
            onClick={() => setActiveTab("model")}
          >
            Модели
          </button>
          <button
            className={`tab-button ${activeTab === "image" ? "active" : ""}`}
            onClick={() => setActiveTab("image")}
          >
            Изображения
          </button>
          <button
            className={`tab-button ${activeTab === "mind" ? "active" : ""}`}
            onClick={() => setActiveTab("mind")}
          >
            .mind
          </button>
        </div>

        {activeTab === "model" && (
          <div style={{ padding: 24 }}>
            <div className="file-input-group">
              <label htmlFor="model-file" className="file-label">
                <span className="file-icon">📦</span>
                <span className="file-text">
                  {modelData.file ? modelData.file.name : ".glb, .gltf"}
                </span>
              </label>
              <input
                id="model-file"
                type="file"
                onChange={handleModelFileChange}
                accept=".glb,.gltf"
                className="file-input"
              />
            </div>

            <div className="fancy-field">
              <label>Название</label>
              <input
                type="text"
                value={modelData.name}
                onChange={(e) => setModelData({ ...modelData, name: e.target.value })}
                placeholder="Citrus"
              />
              <small></small>
            </div>

            <div className="fancy-field">
              <label>Описание</label>
              <textarea
                rows={3}
                value={modelData.description}
                onChange={(e) =>
                  setModelData({ ...modelData, description: e.target.value })
                }
                placeholder=""
              />
            </div>

            <div className="fancy-field">
              <label>Категория</label>
              <select
                value={modelData.category}
                onChange={(e) =>
                  setModelData({ ...modelData, category: e.target.value })
                }
              >
                <option value=""></option>
                <option value="characters">characters</option>
                <option value="objects">objects</option>
                <option value="environments">environments</option>
                <option value="effects">effects</option>
                <option value="ui">UI</option>
              </select>
            </div>

            <div className="fancy-field">
              <label>Теги</label>
              <input
                type="text"
                value={modelData.tags}
                onChange={(e) => setModelData({ ...modelData, tags: e.target.value })}
                placeholder="3D, AR, ..."
              />
              <small></small>
            </div>

            <div className="fancy-field">
              <label>Автор</label>
              <input
                type="text"
                value={modelData.author}
                onChange={(e) => setModelData({ ...modelData, author: e.target.value })}
                placeholder=""
              />
            </div>

            <div className="fancy-field">
              <label>Версия</label>
              <input
                type="text"
                value={modelData.version}
                onChange={(e) => setModelData({ ...modelData, version: e.target.value })}
                placeholder="1.0"
              />
              <small></small>
            </div>

            <button
              onClick={uploadModel}
              disabled={uploading || !modelData.file}
              className="upload-button"
              style={{ width: "100%", marginTop: 16 }}
            >
              {uploading ? "Загрузка..." : "Загрузить модель"}
            </button>
          </div>
        )}

        {activeTab === "image" && (
          <div style={{ padding: 24 }}>
            <div className="file-input-group">
              <label htmlFor="image-file" className="file-label">
                <span className="file-icon">🖼️</span>
                <span className="file-text">
                  {imageData.file ? imageData.file.name : ".jpg, .png, .gif"}
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
              <div style={{ marginBottom: 16, textAlign: "center" }}>
                <img
                  src={URL.createObjectURL(imageData.file)}
                  alt="Preview"
                  onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: 12,
                    border: "1px solid var(--admin-border)",
                  }}
                />
              </div>
            )}

            <div className="fancy-field">
              <label>Название</label>
              <input
                type="text"
                value={imageData.name}
                onChange={(e) => setImageData({ ...imageData, name: e.target.value })}
                placeholder="Citrus"
              />
              <small></small>
            </div>

            <div className="fancy-field">
              <label>Описание</label>
              <textarea
                rows={3}
                value={imageData.description}
                onChange={(e) =>
                  setImageData({ ...imageData, description: e.target.value })
                }
                placeholder=""
              />
            </div>

            <div className="fancy-field">
              <label>Категория</label>
              <select
                value={imageData.category}
                onChange={(e) =>
                  setImageData({ ...imageData, category: e.target.value })
                }
              >
                <option value=""></option>
                <option value="textures">textures</option>
                <option value="markers">markers</option>
                <option value="backgrounds">backgrounds</option>
                <option value="icons">icons</option>
                <option value="previews">previews</option>
              </select>
            </div>

            <div className="fancy-field">
              <label>Теги</label>
              <input
                type="text"
                value={imageData.tags}
                onChange={(e) => setImageData({ ...imageData, tags: e.target.value })}
                placeholder="AR , ..."
              />
              <small></small>
            </div>

            <div className="fancy-field">
              <label>Разрешение</label>
              <select
                value={imageData.resolution}
                onChange={(e) =>
                  setImageData({ ...imageData, resolution: e.target.value })
                }
              >
                <option value=""></option>
                <option value="512x512">512×512</option>
                <option value="1024x1024">1024×1024</option>
                <option value="2048x2048">2048×2048</option>
                <option value="1920x1080">1920×1080</option>
                <option value="custom">custom</option>
              </select>
            </div>

            <div className="fancy-field">
              <label>Тип</label>
              <select
                value={imageData.format}
                onChange={(e) =>
                  setImageData({ ...imageData, format: e.target.value })
                }
              >
                <option value=""></option>
                <option value="armarker">AR</option>
                <option value="texture">texture</option>
                <option value="preview">preview</option>
                <option value="background">background</option>
                <option value="ui">UI</option>
              </select>
            </div>

            <button
              onClick={uploadImage}
              disabled={uploading || !imageData.file}
              className="upload-button"
              style={{ width: "100%", marginTop: 16 }}
            >
              {uploading ? "Загрузка..." : "Загрузить изображение"}
            </button>
          </div>
        )}

        {activeTab === "mind" && (
          <div style={{ padding: 24 }}>
            <div className="file-input-group">
              <label htmlFor="mind-file" className="file-label">
                <span className="file-icon">🧠</span>
                <span className="file-text">
                  {mindData.file ? mindData.file.name : ".mind"}
                </span>
              </label>
              <input
                id="mind-file"
                type="file"
                onChange={handleMindFileChange}
                accept=".mind"
                className="file-input"
              />
            </div>

            <div className="fancy-field">
              <label>Название</label>
              <input
                type="text"
                value={mindData.name}
                onChange={(e) => setMindData({ ...mindData, name: e.target.value })}
                placeholder="targets"
              />
              <small></small>
            </div>

            <button
              onClick={uploadMind}
              disabled={uploading || !mindData.file}
              className="upload-button"
              style={{ width: "100%", marginTop: 16 }}
            >
              {uploading ? "Загрузка..." : "Загрузить .mind"}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message" style={{ margin: 16 }}>
          {error}
        </div>
      )}

      {uploadResult && (
        <div
          className="summary-card"
          style={{ margin: 16, borderColor: "var(--admin-success)", color: "var(--admin-success)" }}
        >
          <strong>{uploadResult.type === "model" ? "Модель" : uploadResult.type === "image" ? "Изображение" : ".mind"}</strong>{" "}
          загружено!<br />
          {uploadResult.data?.name && (
            <>
              Название: <strong>{uploadResult.data.name}</strong>
              <br />
            </>
          )}
          {uploadResult.data?.id && (
            <>
              ID: <strong>{uploadResult.data.id}</strong>
            </>
          )}
          <button
            onClick={() => setUploadResult(null)}
            style={{ float: "right", background: "none", border: "none", color: "inherit", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
