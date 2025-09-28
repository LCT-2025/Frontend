import { ARAnchor, ARView } from "react-three-mind";
import Scene from './Scene.jsx';
import Overlay from "./Overlay.jsx";

const XrModelContainer = () => {
  return (
    <ARView
      imageTargets="/targets.mind"
      filterMinCF={0.001}
      filterBeta={1000}
      missTolerance={5}
      warmupTolerance={5}
      flipUserCamera={false}
      gl={{ preserveDrawingBuffer: true, alpha: true }}
    >
      <Overlay />

      <ambientLight />
      <ARAnchor 
        target={0}
        onAnchorFound={() => console.log(' Маркер 0 найден!')}
        onAnchorLost={() => console.log(' Маркер 0 потерян!')}
      >
        <Scene/>
      </ARAnchor>
    </ARView>
  ); 
}

export default XrModelContainer;
