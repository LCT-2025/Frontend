import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/ar');
  };

  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'sans-serif'
      }}
    >
      <div>
        <h1 style={{ marginBottom: '40px', fontWeight: '300' }}>Добро пожаловать!</h1>
        <button 
          onClick={handleStartClick}
          style={{
            padding: '20px 40px',
            fontSize: '22px',
            fontWeight: 'bold',
            color: 'white',
            background: 'linear-gradient(135deg, #8998e8 0%, #8a5fb0 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
            transition: 'all 0.3s ease',
          }}
        >
          Начать AR
        </button>
      </div>
    </div>
  );
}
