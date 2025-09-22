import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const Cube = ({ scale = [1, 1, 1], position = [0, 0, 0] }) => {
    const cubeRef = useRef(null);

    useFrame((state, delta) => {
    // This function runs at the native refresh rate inside of a shared render-loop
    cubeRef.current.rotation.y += delta;
  });

  return (
    <mesh ref={cubeRef} scale={scale} position={position}>
          <boxGeometry />
          <meshStandardMaterial color={"pink"}/>
    </mesh>
  )
}

export default Cube