import React, { Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import Model, { Loader } from './Model';
import { ModelAnimationsProvider } from '../contexts/ModelAnimations';
import { API_ENDPOINTS } from '../../config/api.js';

const modelUrl = API_ENDPOINTS.MODEL_FILE('citrus');
// в url нужно передать путь до эндпоинта с именем модели
const Cheba = () => {

  // как уровень в юнити сохраняет размещенные ассеты и их положение

    return (
        <ModelAnimationsProvider>
            <ambientLight />
            <Suspense fallback={<Loader />}>
                <Model url={modelUrl} scale={[0.2, 0.2, 0.2]}/>
            </Suspense>
        </ModelAnimationsProvider>
    )
}

export default Cheba
