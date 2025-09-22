import { useGLTF } from '@react-three/drei';
import React from 'react';


const Model = ({ url = '', scale = [1, 1, 1], position = [0, 0, 0] }) => {
  const { scene } = useGLTF(url);

  return <primitive object={scene} scale={scale} position={position} />;
}

export default Model;