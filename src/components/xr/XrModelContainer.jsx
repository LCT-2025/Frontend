import React from 'react'
import { ARAnchor, ARView } from "react-three-mind";
import Model from './Model';

const XrModelContainer = () => {
  return (<ARView
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
        onAnchorLost={() => console.log(' Маркер потерян!')}>
        <Model scale={[0.1, 0.1, 0.1]} position={[0, 0, 0]}/>
        <mesh scale={[0.001, 0.001, 0.001]} position={[0, 0.1, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </ARAnchor>
    </ARView>
  );
}

export default XrModelContainer