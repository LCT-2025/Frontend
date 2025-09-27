import { useAnimations, useGLTF } from '@react-three/drei';
import React, { useEffect, useMemo, useRef } from 'react';
import { SkeletonUtils } from 'three-stdlib';
import { useModelAnimations } from '../contexts/ModelAnimations';

const  handleClick = () => {
  console.log("model clicked")
}

export default function Model({ url = '', scale = [1, 1, 1], position = [0, 0, 0]}) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);

  // нужно настроить использование этого хука
  const {setAnimations, animationIndex} = useModelAnimations(url);
  
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
      <primitive object={clonedScene} onClick={handleClick}/>
    </group>
  );
}