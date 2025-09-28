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
      style={{ position: "absolute", inset: "0", touchAction: "none" }} 
      gl={{ localClippingEnabled: true }}
    >
      {/* UI теперь здесь, снаружи якоря */}
      <Overlay />

      <ambientLight />
      <ARAnchor 
        target={0}
        onAnchorFound={() => console.log(' Маркер 0 найден!')}
        onAnchorLost={() => console.log(' Маркер 0 потерян!')}
      >
        {/* Внутри якоря осталась только 3D-сцена, привязанная к маркеру */}
        <Scene/>
      </ARAnchor>
    </ARView>
  ); 
}

export default XrModelContainer;
