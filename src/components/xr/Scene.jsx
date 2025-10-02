import React, { Suspense } from 'react'
import { OrbitControls, useProgress, Html } from '@react-three/drei'
import Model from './Model';
import { ModelAnimationsProvider } from '../contexts/ModelAnimations';
import { API_ENDPOINTS } from '../../config/api.js';

function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress.toFixed(1)} % loaded</Html>
}

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
            </Suspense>
        </ModelAnimationsProvider>
    )
}

export default Scene
