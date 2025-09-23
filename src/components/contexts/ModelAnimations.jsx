import { createContext, useContext, useState } from "react";

const ModelAnimationsContext = createContext(null);

export const ModelAnimationsProvider = ({ children }) => {
  const [animations, setAnimations] = useState([]);
  const [animationIndex, setAnimationIndex] = useState(0);

  return (
    <ModelAnimationsContext.Provider
      value={{
        animations,
        setAnimations,
        animationIndex,
        setAnimationIndex,
      }}
    >
      {children}
    </ModelAnimationsContext.Provider>
  );
};

export const useModelAnimations = () => {
  const context = useContext(ModelAnimationsContext);
  if (!context) {
    throw new Error(
      "useModelAnimations must be used within a ModelAnimationsProvider"
    );
  }
  return context;
};
