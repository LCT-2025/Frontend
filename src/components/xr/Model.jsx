import { useAnimations, useGLTF } from '@react-three/drei';
import React, { useEffect, useRef } from 'react';
import { useModelAnimations } from '../contexts/ModelAnimations';

export default function Model({ url = '', scale = [1, 1, 1], position = [0, 0, 0]}) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, group);

  // нужно настроить использование этого хука
  const {setAnimations, animationIndex} = useModelAnimations();
  
  //остальное должно работать, когда хук возвращает свои значения
  useEffect(() => {
    setAnimations(names);
  }, [])

  useEffect(() => {
        actions[names[animationIndex]].reset().fadeIn(0.5).play();
  
        return ()=>{
          actions[names[animationIndex]]?.fadeOut();
        }
      }, [animationIndex])

  useEffect(() => {
    if (url) {
      useGLTF.preload(url);
    }
  }, [url]);

  return (
    <group ref={group} scale={scale} position={position}>
      <primitive object={scene}/>
    </group>
  );
}