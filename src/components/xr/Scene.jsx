import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useProgress, Html } from '@react-three/drei'
import Prefab from './Prefab';
import AnimationController from './AnimationController';

function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress.toFixed(1)} % loaded</Html>
}

export default function Scene() {

    return (
        <Canvas>
            <OrbitControls />
            <ambientLight />
            <Suspense fallback={<Loader />}>
                <AnimationController url='/larisa.glb' />
            </Suspense>
        </Canvas>
    )
}