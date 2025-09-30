import React, { Suspense } from 'react'
import { OrbitControls, useProgress, Html } from '@react-three/drei'
import Model from './Model';
import { ModelAnimationsProvider } from '../contexts/ModelAnimations';

function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress.toFixed(1)} % loaded</Html>
}

const Scene = () => {

  // как уровень в юнити сохраняет размещенные ассеты и их положение

    return (
        <ModelAnimationsProvider>
            <ambientLight />
            <Suspense fallback={<Loader />}>
                <Model url='/larisa.glb' />
                <Model url='/larisa.glb' position={[2,2,0]}/>
            </Suspense>
        </ModelAnimationsProvider>
    )
}

export default Scene