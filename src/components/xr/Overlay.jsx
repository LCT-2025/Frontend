import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { takeScreenshot } from '../../utils/screenshot';

const Overlay = ({ children }) => {
  const [isTextVisible, setIsTextVisible] = useState(false);

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    takeScreenshot();
  };

  const handleShutterClick = (e) => {
    e.stopPropagation();
    setIsTextVisible(true);
  };

  const handleClose = () => {
    setIsTextVisible(false);
  }

  return (
    <Html fullscreen>
      <div 
        style={{ 
          width: '100vw', 
          height: '100vh', 
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: isTextVisible ? 'auto' : 'none' 
        }} 
        onClick={handleClose}
      >

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
          onClick={(e) => e.stopPropagation()}
        />

        {/* Text Panel (conditionally rendered) */}
        {isTextVisible && (
          <div 
            style={{
              position: 'fixed',
              top: '-50vh',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '450px', 
              minHeight: '240px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              pointerEvents: 'auto',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
              padding: '20px',
              boxSizing: 'border-box',
              color: 'white',
              fontSize: '24px',
              textAlign: 'justify',
            }}
            
          >
            <div style={{ whiteSpace: 'pre-line' }} onClick={(e) => e.stopPropagation()}>{children}</div>
            <button 
              onClick={handleDownloadClick}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#764ba2',
                background: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease',
              }}
            >
              Скачать
            </button>
          </div>
        )}

        {/* Bottom Button */}
        <div style={{
          position: 'fixed',
          top: '30vh',
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
          <img
            src="/button.png"
            alt="Screenshot"
            onClick={handleShutterClick}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(102, 126, 234, 0.35), 0 8px 32px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.2s ease',
              pointerEvents: 'auto',
            }}
          />
        </div>
      </div>
    </Html>
  );
};

export default Overlay;