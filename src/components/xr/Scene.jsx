import React, { Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import Model, { Loader } from './Model';
import { ModelAnimationsProvider } from '../contexts/ModelAnimations';
import { API_ENDPOINTS } from 'd:/_Projects/_ar_lct/Frontend/src/config/api.js';

// как уровень в юнити сохраняет размещенные модели и их положение
// шаблон для собственных сцен, которые соотносятся с маркерами
// у компоненты модели есть пропс scale and position

// формат пути до каждой загруженной модели
//const modelUrl = API_ENDPOINTS.MODEL_FILE('larisa');

const Scene = () => {


    return (
        <ModelAnimationsProvider>
            <ambientLight />
            <Suspense fallback={<Loader />}>
                <Model url={'larisa.glb'} scale={[0.5, 0.5, 0.5]} />
            </Suspense>
        </ModelAnimationsProvider>
    )
}

export default Scene