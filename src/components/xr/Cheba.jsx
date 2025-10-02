import React, { Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import Model, { Loader } from './Model';
import { ModelAnimationsProvider } from '../contexts/ModelAnimations';
import { API_ENDPOINTS } from 'd:/_Projects/_ar_lct/Frontend/src/config/api.js';

// в url нужно передать путь до эндпоинта с именем модели
const Cheba = () => {

  // как уровень в юнити сохраняет размещенные ассеты и их положение

    return (
        <ModelAnimationsProvider>
            <ambientLight />
            <Suspense fallback={<Loader />}>

            </Suspense>
        </ModelAnimationsProvider>
    )
}

export default Cheba