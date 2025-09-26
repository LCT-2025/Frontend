import React from 'react'
import {Canvas} from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Scene from './Scene.jsx';


const ModelContainer = () => {

  // сцена не нужна тк все собираем вручную
    // но возможно будет неплохо использовать список моделей
    // с их кордами и обернуть все в анимейтед компонент через .map()

    return (
        <Canvas>
            <OrbitControls />
            <ambientLight />
            <Scene />
        </Canvas>
    )
}

export default ModelContainer