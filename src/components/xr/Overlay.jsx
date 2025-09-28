import React from 'react';
import { Html } from '@react-three/drei';

const Overlay = () => {
  return (
    // Оборачиваем UI в <Html> для рендеринга поверх WebGL. 
    // Свойства renderOrder, depthTest и position-z больше не нужны.
    <Html 
      fullscreen // Занимает всю область просмотра Canvas
      // Стили позиционирования для контейнера <Html>
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center', // Центрируем содержимое по горизонтали
        alignItems: 'flex-start', // Выравниваем по верху
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Позволяет кликам проходить сквозь, пока не наведёте на UI элемент
        padding: '30px',
        boxSizing: 'border-box'
      }}
    >
      {/* Главный контейнер UI (аналог <Root>). 
        Мы используем чистый DOM (div) для стилизации. 
      */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'row',
          // Соответствует ширине 8x4 в UI Kit, но в процентах для DOM
          width: '600px', 
          height: '200px',
          backgroundColor: 'rgba(255, 0, 0, 0.8)', // Красный фон Root
          borderRadius: '12px',
          pointerEvents: 'auto', // Включаем клики для самого UI
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Container 1: flexGrow={1}, margin={32}, backgroundColor="green" */}
        <div 
          style={{
            flexGrow: 1,
            margin: '32px', // Аналог margin={32}
            backgroundColor: 'green',
            borderRadius: '8px',
          }}
        />
        {/* Container 2: flexGrow={1}, margin={32}, backgroundColor="blue" */}
        <div 
          style={{
            flexGrow: 1,
            margin: '32px', // Аналог margin={32}
            backgroundColor: 'blue',
            borderRadius: '8px',
          }}
        />
      </div>
    </Html>
  );
};

export default Overlay;