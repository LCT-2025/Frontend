import React, { Suspense } from 'react';
import { ARAnchor, ARView } from "react-three-mind";
import { Html } from '@react-three/drei';
import { DreiModel } from './DreiModel';
import Cube from './Cube';

const XrModelContainer = () => {
  return (
    <ARView
      imageTargets="/targets.mind"
      filterMinCF={0.001}
      filterBeta={1000}
      missTolerance={5}
      warmupTolerance={5}
      flipUserCamera={false}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <ARAnchor 
        target={0}
        onAnchorFound={() => console.log(' Маркер найден!')}
        onAnchorLost={() => console.log(' Маркер потерян!')}
      >
        <Suspense fallback={<Html center>Loading...</Html>}>
          <DreiModel scale={[0.1, 0.1, 0.1]} position={[0, 0, 0]} />
        </Suspense>
      </ARAnchor>
      <Cube position={[0, 0, -2]} />
    </ARView>
  );
}

export default XrModelContainer;