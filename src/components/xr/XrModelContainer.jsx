import { ARAnchor, ARView } from "react-three-mind";
import { useState, useEffect } from 'react';
import Scene from './Scene.jsx';
import Overlay from "./Overlay.jsx";

const XrModelContainer = () => {
  const [mindFileUrl, setMindFileUrl] = useState('/targets.mind');
  const [compilationMappings, setCompilationMappings] = useState([]);
  const [currentModel, setCurrentModel] = useState('default');

  useEffect(() => {
    // Fetch the latest compilation data
    fetchCompilationData();
  }, []);

  const fetchCompilationData = async () => {
    try {
      // Get the latest .mind file
      const mindResponse = await fetch('http://localhost:8080/api/compilation/mind-file');
      if (mindResponse.ok) {
        const mindBlob = await mindResponse.blob();
        const mindUrl = URL.createObjectURL(mindBlob);
        setMindFileUrl(mindUrl);
      }

      // Get compilation mappings
      const mappingsResponse = await fetch('http://localhost:8080/api/compilation/mappings');
      if (mappingsResponse.ok) {
        const mappings = await mappingsResponse.json();
        setCompilationMappings(mappings);
      }
    } catch (error) {
      console.error('Error fetching compilation data:', error);
    }
  };

  const handleTargetFound = (targetIndex) => {
    console.log(`Target ${targetIndex} found!`);
    
    // Find the mapping for this target index
    const mapping = compilationMappings.find(m => m.index === targetIndex);
    if (mapping) {
      console.log(`Loading model: ${mapping.model_name}`);
      setCurrentModel(mapping.model_name);
    }
  };

  const handleTargetLost = (targetIndex) => {
    console.log(`Target ${targetIndex} lost!`);
  };

  return (
    <ARView
      imageTargets={mindFileUrl}
      filterMinCF={0.001}
      filterBeta={1000}
      missTolerance={5}
      warmupTolerance={5}
      flipUserCamera={false}
      gl={{ preserveDrawingBuffer: true, alpha: true }}
    >
      <Overlay />

      <ambientLight />
      
      {/* Render anchors for each target */}
      {compilationMappings.map((mapping, index) => (
        <ARAnchor 
          key={mapping.id}
          target={mapping.index}
          onAnchorFound={() => handleTargetFound(mapping.index)}
          onAnchorLost={() => handleTargetLost(mapping.index)}
        >
          <Scene modelName={mapping.model_name} />
        </ARAnchor>
      ))}
    </ARView>
  ); 
}

export default XrModelContainer;
