import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ModelAnimationsProvider } from '../contexts/ModelAnimations';
import Interface from './Interface';
import { Arbak } from './Arbak';

const ModelContainer = () => {
  return (
    <ModelAnimationsProvider>
      <div 
        className="model-container" 
        style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}
      >
        {/* Обертка с классом animation-container для заданного z-index */}
        <div className="animation-container" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 30,
          pointerEvents: 'none' // чтобы не блокировать клики, если нужно
        }}>
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 75 }}
            onContextLost={e => {
              e.preventDefault();
              console.warn('WebGL context lost, try to restore');
            }}
          >
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <Arbak scale={[0.1, 0.1, 0.1]} position={[0, 0, 0]} />
          </Canvas>
        </div>

        <Interface />
      </div>
    </ModelAnimationsProvider>
  );
};

export default ModelContainer;
