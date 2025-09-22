import React from 'react'
import {Canvas} from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Cube from "./Cube"
import Model from './Model'


const CubeContainer = () => {


  return (
    <Canvas>
      <OrbitControls />
      <ambientLight />
      <Cube/>
    </Canvas>
  )
}

export default CubeContainer