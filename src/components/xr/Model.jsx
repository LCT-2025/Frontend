import { useGLTF } from '@react-three/drei';
import React, { useEffect } from 'react';


const Model = ({ scale = [1, 1, 1], position = [0, 0, 0] }) => {
  const { scene } = useGLTF('larisa.glb');

  useEffect(() => {
    if (scene) {
      scene.scale.set(scale[0], scale[1], scale[2]);
      scene.position.set(position[0], position[1], position[2]);
    }
  }, [scene, scale, position]);

  return <primitive object={scene} />;
}

export default Model;