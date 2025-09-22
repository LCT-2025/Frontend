import React from 'react'
import { ARAnchor, ARView } from "react-three-mind";
import Model from './Model';
import Cube from './Cube';


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
        <Model url='/larisa.glb' scale={[0.1, 0.1, 0.1]} position={[0, 0, 0]}/>
      </ARAnchor>
      <Cube position={[0,0,-2]}/>
    </ARView>
  );
}

export default XrModelContainer