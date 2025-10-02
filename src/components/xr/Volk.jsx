import React, { Suspense } from 'react'
import { OrbitControls, useProgress, Html } from '@react-three/drei'
import Model from './Model';
import { ModelAnimationsProvider } from '../contexts/ModelAnimations';
import { API_ENDPOINTS } from '../../config/api.js';

function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress.toFixed(1)} % loaded</Html>
}

// в url нужно передать путь до эндпоинта с именем модели
const Volk = () => {

  // как уровень в юнити сохраняет размещенные ассеты и их положение

    return (
        <ModelAnimationsProvider>
            <ambientLight />
            <Suspense fallback={<Loader />}>

            </Suspense>
        </ModelAnimationsProvider>
    )
}

export default Volk
