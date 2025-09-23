import React, { useEffect } from 'react';
import { useModelAnimations } from '../contexts/ModelAnimations';

const Interface = () => {
  const { animations, animationIndex, setAnimationIndex } = useModelAnimations();

  useEffect(() => {
    console.log('Current animation index:', animationIndex);
  }, [animationIndex]);

  return (
    <div id="overlay-content" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 40, pointerEvents: 'auto' }}>
      <div className='dom-container'>
        <div className='button-container'>
          {animations.map((animation, index) => (
            <button 
              key={animation} 
              className={`button ${index === animationIndex ? 'active' : ''}`}
              onClick={() => setAnimationIndex(index)}
            >
              {animation}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Interface;
