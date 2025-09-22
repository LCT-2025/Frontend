import React from 'react'
import {Canvas} from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Cube from "./Cube"
import Model from './Model'
import { DreiModel } from './DreiModel'
import { ModelAnimationsProvider } from '../contexts/ModelAnimations'
import Interface from './Interface'
import { Arbak } from './Arbak';



const ModelContainer = () => {


  return (
    <ModelAnimationsProvider>
    <div className="model-container">
    <Canvas>
      <OrbitControls />
      <ambientLight />
      <Arbak scale={[0.1, 0.1, 0.1]} position={[0, 0, 0]}/>
    </Canvas>
    <Interface/>
    </div>
    </ModelAnimationsProvider>
  )
}

export default ModelContainer