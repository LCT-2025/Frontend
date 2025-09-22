import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const Cube = () => {
    const cubeRef = useRef(null);

    useFrame((state, delta) => {
    // This function runs at the native refresh rate inside of a shared render-loop
    cubeRef.current.rotation.y += delta;
  });

  return (
    <mesh ref={cubeRef}>
          <boxGeometry args={[0.02, 0.02, 0.02]}/>
          <meshStandardMaterial color={"pink"}/>
    </mesh>
  )
}

export default Cube