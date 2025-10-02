import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../admin/AdminContext';
import { API_ENDPOINTS } from '../../config/api.js';

// *** ИЗМЕНЕНИЕ: УДАЛЕН ПРОБЛЕМНЫЙ ИМПОРТ ***
// import { Compiler } from 'mind-ar/src/image-target/compiler.js'; 

// Получаем Compiler из глобального объекта window.MINDAR.IMAGE
const GlobalMindAR = window.MINDAR;

const CompilationPanel = () => {
    const { authFetch } = useAdmin();
    const [images, setImages] = useState([]);
    const [models, setModels] = useState([]);
    const [imageModelMappings, setImageModelMappings] = useState([]);
    const [compilationStatus, setCompilationStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null); 

    // Используем useCallback для функций, чтобы избежать повторного создания
    const revokeUrl = useCallback(() => {
        if (downloadUrl) {
            URL.revokeObjectURL(downloadUrl);
            setDownloadUrl(null); // Очищаем состояние после отзыва
        }
    }, [downloadUrl]);

    // Cleanup effect
    useEffect(() => {
        fetchData();
        return () => {
            revokeUrl();
        };
    }, [/* fetchData, */ revokeUrl]); // fetchData обычно не меняется, но его можно добавить, если он обернут в useCallback

    const fetchData = async () => {
        // ... (Ваша функция fetchData остается без изменений)
        try {
            const imagesResponse = await authFetch(API_ENDPOINTS.COMPILATION_IMAGES);
            if (imagesResponse.ok) {
                const imagesData = await imagesResponse.json();
                setImages(imagesData);
                
                const initialMappings = imagesData.map((image, index) => ({
                    imageId: image.id,
                    imageName: image.name,
                    modelName: 'default',
                    index: index
                }));
                setImageModelMappings(initialMappings);
            }

            const modelsResponse = await authFetch(API_ENDPOINTS.MODELS);
            if (modelsResponse.ok) {
                const modelsData = await modelsResponse.json();
                setModels(modelsData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleModelChange = (imageId, newModelName) => {
        // ... (Ваша функция handleModelChange остается без изменений)
        setImageModelMappings(prev => 
            prev.map(mapping => 
                mapping.imageId === imageId 
                    ? { ...mapping, modelName: newModelName }
                    : mapping
            )
        );
    };

    const compileWithMindAR = async () => {
        // *** ПРОВЕРКА ГЛОБАЛЬНОГО ДОСТУПА К COMPILER ***
        if (!GlobalMindAR || !GlobalMindAR.IMAGE || !GlobalMindAR.IMAGE.Compiler) {
            setCompilationStatus('Ошибка: MindAR Compiler не найден. Проверьте подключение скрипта MindAR в index.html.');
            return;
        }

        if (imageModelMappings.length === 0) {
            setCompilationStatus('No images to compile');
            return;
        }

        setLoading(true);
        setCompilationStatus('1/3: Загрузка изображений...');
        revokeUrl(); // Отзываем предыдущий URL перед началом новой компиляции

        try {
            const imageFilesForCompilation = [];
            const loadingPromises = [];

            for (const image of images) {
                const img = new Image();
                img.crossOrigin = 'anonymous'; 
                // Предотвращаем кэширование, добавив timestamp (иногда помогает при CORS/загрузке)
                img.src = `${API_ENDPOINTS.IMAGE_FILE(image.name)}?t=${Date.now()}`;
                
                loadingPromises.push(new Promise((resolve, reject) => {
                    img.onload = () => {
                        imageFilesForCompilation.push(img);
                        resolve();
                    };
                    img.onerror = () => reject(new Error(`Failed to load image: ${image.name}`));
                }));
            }

            await Promise.all(loadingPromises);
            
            setCompilationStatus('2/3: Идет компиляция MindAR...');

            // *** ИЗМЕНЕНИЕ: Используем глобальный Compiler ***
            // Обращение к классу через window.MINDAR.IMAGE
            const CompilerClass = GlobalMindAR.IMAGE.Compiler;
            const compiler = new CompilerClass(); 
            // Компиляция должна работать асинхронно
            const compiledData = await compiler.compileImageTargets(imageFilesForCompilation, (progress) => {
                // Вы можете использовать progress для обновления UI
                setCompilationStatus(`2/3: Идет компиляция MindAR... (${Math.round(progress)}%)`);
            }); 
            // В MindAR 1.2.5 compileImageTargets возвращает null, если используется exportData
            // Мы сразу экспортируем данные:
            const exportedBuffer = await compiler.exportData();

            const mindFileBlob = new Blob([exportedBuffer], { type: 'application/octet-stream' });
            const newDownloadUrl = URL.createObjectURL(mindFileBlob);
            setDownloadUrl(newDownloadUrl);
            
            setCompilationStatus('3/3: Отправка данных на сервер...');

            const mappings = imageModelMappings.map(mapping => ({
                image_id: mapping.imageId,
                model_name: mapping.modelName,
                index: mapping.index
            }));

            const formData = new FormData();
            formData.append('mind_file', mindFileBlob, 'targets.mind');
            formData.append('mappings', JSON.stringify(mappings));

            const response = await authFetch(API_ENDPOINTS.COMPILATION_SAVE, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                setCompilationStatus('Compilation successful! The .mind file has been saved on the server.');
            } else {
                const errorData = await response.json();
                setCompilationStatus(`Compilation failed: ${errorData.error}`);
            }
        } catch (error) {
            console.error("MindAR Compilation Error:", error);
            setCompilationStatus(`Compilation error: ${error.message}. Проверьте консоль браузера.`);
        } finally {
            setLoading(false);
        }
    };

    // ... (Остальной рендер JSX остается без изменений)
    return (
        <div style={{ maxWidth: 1200, margin: 'auto', padding: '20px' }}>
            {/* ... JSX для таблицы ... */}
            <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    backgroundColor: 'white'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#3a3a3a' }}>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #444', color: '#ffffff' }}>Index</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #444', color: '#ffffff' }}>Image</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #444', color: '#ffffff' }}>Image ID</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #444', color: '#ffffff' }}>Image Name</th>
                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #444', color: '#ffffff' }}>Model</th>
                            </tr>
                        </thead>
                        <tbody>
                            {imageModelMappings.map((mapping, index) => (
                                <tr key={mapping.imageId} style={{ borderBottom: '1px solid #444', backgroundColor: '#333333' }}>
                                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#ffffff' }}>{mapping.index}</td>
                                    <td style={{ padding: '12px' }}>
                                        <img 
                                            src={API_ENDPOINTS.IMAGE_FILE(mapping.imageName)} 
                                            alt={mapping.imageName}
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td style={{ padding: '12px', fontFamily: 'monospace', color: '#cccccc' }}>{mapping.imageId}</td>
                                    <td style={{ padding: '12px', color: '#ffffff' }}>{mapping.imageName}</td>
                                    <td style={{ padding: '12px' }}>
                                        <select 
                                            value={mapping.modelName} 
                                            onChange={(e) => handleModelChange(mapping.imageId, e.target.value)}
                                            style={{ 
                                                padding: '6px 8px', 
                                                border: '1px solid #555', 
                                                borderRadius: '4px',
                                                minWidth: '150px',
                                                backgroundColor: '#3a3a3a',
                                                color: '#ffffff'
                                            }}
                                        >
                                            {models.map(model => (
                                                <option key={model.id} value={model.name} style={{ backgroundColor: '#3a3a3a', color: '#ffffff' }}>
                                                    {model.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <button 
                    onClick={compileWithMindAR}
                    disabled={loading || imageModelMappings.length === 0}
                    style={{ 
                        padding: '12px 24px', 
                        backgroundColor: loading ? '#555' : '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? 'Compiling...' : 'Compile with MindAR'}
                </button>
                
                {downloadUrl && (
                    <a
                        href={downloadUrl}
                        download="targets.mind"
                        style={{ 
                            padding: '12px 24px', 
                            backgroundColor: '#1e4d2b', 
                            color: 'white', 
                            textDecoration: 'none',
                            border: 'none', 
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Скачать targets.mind
                    </a>
                )}
            </div>

            {compilationStatus && (
                <div style={{ 
                    marginTop: '20px', 
                    padding: '12px', 
                    backgroundColor: compilationStatus.includes('successful') ? '#1e4d2b' : '#4d1e1e',
                    border: `1px solid ${compilationStatus.includes('successful') ? '#2d5a3d' : '#5a2d2d'}`,
                    borderRadius: '6px',
                    color: compilationStatus.includes('successful') ? '#90ee90' : '#ffcccb'
                }}>
                    {compilationStatus}
                </div>
            )}
        </div>
    );
};

export default CompilationPanel;