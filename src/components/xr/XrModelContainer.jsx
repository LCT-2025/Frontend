import { ARAnchor, ARView } from "react-three-mind";
import Scene from './Scene.jsx';
import Overlay from "./Overlay.jsx";
import { API_ENDPOINTS } from '../../config/api.js';

const mindFile = API_ENDPOINTS.COMPILATION_MIND_FILE;

const XrModelContainer = () => {
  return (
    <ARView
      autoplay
      imageTargets={'/targets.mind'}
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
