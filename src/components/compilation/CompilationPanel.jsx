import React, { useState, useEffect } from 'react';
import { useAdmin } from '../admin/AdminContext';

const CompilationPanel = () => {
  const { authFetch } = useAdmin();
  const [images, setImages] = useState([]);
  const [models, setModels] = useState([]);
  const [imageModelMappings, setImageModelMappings] = useState([]);
  const [compilationStatus, setCompilationStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch images for compilation
      const imagesResponse = await authFetch('http://localhost:8080/api/compilation/images');
      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        setImages(imagesData);
        
        // Initialize mappings with default model for each image
        const initialMappings = imagesData.map((image, index) => ({
          imageId: image.id,
          imageName: image.name,
          modelName: 'default',
          index: index
        }));
        setImageModelMappings(initialMappings);
      }

      // Fetch models
      const modelsResponse = await authFetch('http://localhost:8080/api/models');
      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json();
        setModels(modelsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleModelChange = (imageId, newModelName) => {
    setImageModelMappings(prev => 
      prev.map(mapping => 
        mapping.imageId === imageId 
          ? { ...mapping, modelName: newModelName }
          : mapping
      )
    );
  };

  const compileWithMindAR = async () => {
    if (imageModelMappings.length === 0) {
      setCompilationStatus('No images to compile');
      return;
    }

    setLoading(true);
    setCompilationStatus('Compiling with MindAR...');

    try {
      // Create image elements for MindAR compilation
      const imageElements = [];
      for (let i = 0; i < images.length; i++) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = `http://localhost:8080/files/image/${images[i].name}`;
        
        imageElements.push({
          element: img,
          index: i,
          imageId: images[i].id
        });
      }

      // Wait for all images to load
      await Promise.all(imageElements.map(item => 
        new Promise(resolve => {
          item.element.onload = resolve;
        })
      ));

      // Create compilation mappings from the table
      const mappings = imageModelMappings.map(mapping => ({
        image_id: mapping.imageId,
        model_name: mapping.modelName,
        index: mapping.index
      }));

      // Simulate MindAR compilation (in real implementation, use MindAR library)
      const mindFileBlob = await simulateMindARCompilation(imageElements);
      
      // Send compiled .mind file and mappings to server
      const formData = new FormData();
      formData.append('mind_file', mindFileBlob, 'targets.mind');
      formData.append('mappings', JSON.stringify(mappings));

      const response = await authFetch('http://localhost:8080/api/compilation/save', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setCompilationStatus('Compilation successful!');
      } else {
        const errorData = await response.json();
        setCompilationStatus(`Compilation failed: ${errorData.error}`);
      }
    } catch (error) {
      setCompilationStatus(`Compilation error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const simulateMindARCompilation = async (imageElements) => {
    // This is a placeholder for actual MindAR compilation
    // In a real implementation, you would use the MindAR library here
    const compilationData = {
      version: '1.0',
      targets: imageElements.map((item, index) => ({
        id: index,
        name: `target_${index}`,
        image: `image_${index}.jpg`
      })),
      compiled_at: new Date().toISOString()
    };

    // Create a blob from the compilation data
    const jsonString = JSON.stringify(compilationData);
    return new Blob([jsonString], { type: 'application/octet-stream' });
  };

  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: '20px' }}>
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
                      src={`http://localhost:8080/files/image/${mapping.imageName}`} 
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

      <div style={{ marginBottom: '20px' }}>
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
