import React from 'react'
import {Canvas} from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Cube from "./Cube"


const CubeContainer = () => {


  return (
    <Canvas>
      <OrbitControls />
      <ambientLight />
      <Cube />
    </Canvas>
  )
}

export default CubeContainer