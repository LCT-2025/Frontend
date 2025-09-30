import React, { Suspense } from 'react'
import { OrbitControls, useProgress, Html } from '@react-three/drei'
import Model from './Model';
import { ModelAnimationsProvider } from '../contexts/ModelAnimations';

function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress.toFixed(1)} % loaded</Html>
}

const Scene = ({ modelName = 'default' }) => {
    // Get model URL based on model name
    const getModelUrl = (name) => {
        // In a real implementation, you would fetch this from the API
        // For now, we'll use a simple mapping
        const modelUrls = {
            'larisa': '/larisa.glb',
            'arbak': '/arbak.glb',
            'default': '/larisa.glb'
        };
        return modelUrls[name] || modelUrls['default'];
    };

    const modelUrl = getModelUrl(modelName);

    return (
        <ModelAnimationsProvider>
            <ambientLight />
            <Suspense fallback={<Loader />}>
                <Model url={modelUrl} />
            </Suspense>
        </ModelAnimationsProvider>
    )
}

export default Scene