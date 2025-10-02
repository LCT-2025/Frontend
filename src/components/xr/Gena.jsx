import React, { Suspense } from 'react'
import { OrbitControls, useProgress, Html } from '@react-three/drei'
import Model from './Model';
import { ModelAnimationsProvider } from '../contexts/ModelAnimations';
import { API_ENDPOINTS } from 'd:/_Projects/_ar_lct/Frontend/src/config/api.js';



// в url нужно передать путь до эндпоинта с именем модели
const Gena = () => {

  // как уровень в юнити сохраняет размещенные ассеты и их положение

    return (
        <ModelAnimationsProvider>
            <ambientLight />
            <Suspense fallback={<Loader />}>
                
            </Suspense>
        </ModelAnimationsProvider>
    )
}

export default Gena