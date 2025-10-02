import { useAnimations, useGLTF, useProgress, Html } from '@react-three/drei';
import React, { useEffect, useMemo, useRef } from 'react';
import { SkeletonUtils } from 'three-stdlib';
import { useModelAnimations } from '../contexts/ModelAnimations';


export function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress.toFixed(1)} % loaded</Html>
}

export default function Model({ url = '', scale = [1, 1, 1], position = [0, 0, 0]}) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);

  // нужно настроить использование этого хука
  const {setAnimations, animationIndex, setAnimationIndex} = useModelAnimations(url);
  
  //остальное должно работать, когда хук возвращает свои значения
  useEffect(() => {
    // TODO: если длина списка names=0, то берем из пропсов спринговские names + actions
    setAnimations(names);
  }, [])

  const handleAnimationChange = () => {
    // логика смены индекса анимации
    let index = (animationIndex + 1) % names.length;
    console.log(`model was clicked with anim ${names[index]}`)
    setAnimationIndex(index);
  };

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
      <primitive object={clonedScene} onClick={handleAnimationChange}/>
    </group>
  );
}