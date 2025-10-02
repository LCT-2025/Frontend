import { ARAnchor, ARView } from "react-three-mind";
import Overlay from "./Overlay.jsx";
import { API_ENDPOINTS } from '../../config/api.js';
import Shlapa from "./Shlapa.jsx";
import Cheba from "./Cheba.jsx";
import Gena from "./Gena.jsx";
import Volk from "./Volk.jsx";

// путь до эндпоинта для получения mind с сервера
const mindFile = API_ENDPOINTS.COMPILATION_MIND_FILE;

const XrModelContainer = () => {
  return (
    <ARView
      autoplay
      imageTargets={mindFile}
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
        <Shlapa/>
      </ARAnchor>

      <ARAnchor 
        target={1}
        onAnchorFound={() => console.log(' Маркер 1 найден!')}
        onAnchorLost={() => console.log(' Маркер 1 потерян!')}
      >
        <Cheba/>
      </ARAnchor>

      <ARAnchor 
        target={2}
        onAnchorFound={() => console.log(' Маркер 2 найден!')}
        onAnchorLost={() => console.log(' Маркер 2 потерян!')}
      >
        <Gena/>
      </ARAnchor>

      <ARAnchor 
        target={3}
        onAnchorFound={() => console.log(' Маркер 3 найден!')}
        onAnchorLost={() => console.log(' Маркер 3 потерян!')}
      >
        <Volk/>
      </ARAnchor>
    </ARView>
  ); 
}

export default XrModelContainer;
