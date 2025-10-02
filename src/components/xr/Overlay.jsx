import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { takeScreenshot } from '../../utils/screenshot';

const Overlay = ({ text }) => {
  const [isTextVisible, setIsTextVisible] = useState(false);

  const handleScreenshotClick = () => {
    takeScreenshot();
    setIsTextVisible(true);
  };

  return (
    <Html fullscreen style={{ pointerEvents: 'none' }}>

      {/* Top Image */}
      <img 
        src="/souz.png" 
        alt="Souz"
        style={{
          position: 'fixed',
          bottom: '20vh',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '150px',
          pointerEvents: 'auto',
        }}
      />

      {/* Text Panel (conditionally rendered) */}
      {isTextVisible && (
        <div 
          style={{
            position: 'fixed',
            top: '25%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '600px', 
            minHeight: '100px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            pointerEvents: 'auto',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
            padding: '20px',
            boxSizing: 'border-box',
            color: 'white',
            fontSize: '24px',
            textAlign: 'center',
          }}
        >
          {text}
        </div>
      )}

      {/* Bottom Button */}
      <div style={{
        position: 'fixed',
        top: '30vh',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'auto'
      }}>
        <button
          onClick={handleScreenshotClick}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            color: '#e6edf3',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(102, 126, 234, 0.35), 0 8px 32px rgba(0, 0, 0, 0.35)',
            transition: 'all 0.2s ease',
          }}
        >
          Скриншот
        </button>
      </div>
    </Html>
  );
};

export default Overlay;