import { useState } from "react";
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
  const [shlapaVisible, setShlapaVisible] = useState(false);
  const [chebaVisible, setChebaVisible] = useState(false);
  const [genaVisible, setGenaVisible] = useState(false);
  const [volkVisible, setVolkVisible] = useState(false);

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
      <Overlay>
        {'Теперь вы можете скачать вашу фотографию! А если хотите увидеть больше, то заходите к нам в павильон!\n\n'}
        {'Здесь можно приобрести билет на экскурсию : '}
        <a href="https://vdnh.ru/places/pavilon-7-souzmultpark/" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
          https://vdnh.ru/places/pavilon-7-souzmultpark/
        </a>
        {'/n/n(для закрытия окна нажмите в любое место)'}
      </Overlay>

      <ambientLight />
      <ARAnchor 
        target={0}
        onAnchorFound={() => {
          console.log(' Маркер 0 найден!');
          setShlapaVisible(true);
        }}
        onAnchorLost={() => {
          console.log(' Маркер 0 потерян!');
          setShlapaVisible(false);
        }}
      >
        {shlapaVisible && <Shlapa/>}
      </ARAnchor>

      <ARAnchor 
        target={1}
        onAnchorFound={() => {
          console.log(' Маркер 1 найден!');
          setChebaVisible(true);
        }}
        onAnchorLost={() => {
          console.log(' Маркер 1 потерян!');
          setChebaVisible(false);
        }}
      >
        {chebaVisible && <Cheba/>}
      </ARAnchor>

      <ARAnchor 
        target={2}
        onAnchorFound={() => {
          console.log(' Маркер 2 найден!');
          setGenaVisible(true);
        }}
        onAnchorLost={() => {
          console.log(' Маркер 2 потерян!');
          setGenaVisible(false);
        }}
      >
        {genaVisible && <Gena/>}
      </ARAnchor>

      <ARAnchor 
        target={3}
        onAnchorFound={() => {
          console.log(' Маркер 3 найден!');
          setVolkVisible(true);
        }}
        onAnchorLost={() => {
          console.log(' Маркер 3 потерян!');
          setVolkVisible(false);
        }}
      >
        {volkVisible && <Volk/>}
      </ARAnchor>
    </ARView>
  ); 
}

export default XrModelContainer;
