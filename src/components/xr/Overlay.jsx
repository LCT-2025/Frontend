import React from 'react';
import { Html } from '@react-three/drei';
import { takeScreenshot } from '../../utils/screenshot';

const Overlay = () => {
  return (
    <Html 
      fullscreen
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        padding: '30px',
        boxSizing: 'border-box'
      }}
    >
      
      <div 
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '600px', 
          height: '200px',
          backgroundColor: 'rgba(255, 0, 0, 0.8)',
          borderRadius: '12px',
          pointerEvents: 'auto',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ flexGrow: 1, margin: '32px', backgroundColor: 'green', borderRadius: '8px' }} />
        <div style={{ flexGrow: 1, margin: '32px', backgroundColor: 'blue', borderRadius: '8px' }} />
      </div>

      
      <div style={{ pointerEvents: 'auto' }}>
        <button
          onClick={takeScreenshot}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            color: 'white',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          Скриншот
        </button>
      </div>
    </Html>
  );
};

export default Overlay;