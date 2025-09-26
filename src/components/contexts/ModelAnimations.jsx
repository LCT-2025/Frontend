import { createContext, useContext, useState } from "react";

const ModelAnimationsContext = createContext({});

export const ModelAnimationsProvider = (props) => {
  const [animations, setAnimations] = useState([]);
  const [animationIndex, setAnimationIndex] = useState(0);

  return (
    <>
      <ModelAnimationsContext.Provider
        value={{
          animations,
          setAnimations,
          animationIndex,
          setAnimationIndex,
        }}
      >
        {props.children}
      </ModelAnimationsContext.Provider>
    </>
  );
};

export const useModelAnimations = () => {
  return useContext(ModelAnimationsContext);
};