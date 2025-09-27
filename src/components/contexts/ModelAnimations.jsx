import { createContext, useContext, useState, useCallback } from "react";

const ModelAnimationsContext = createContext({});

export const ModelAnimationsProvider = (props) => {
    const [modelStates, setModelStates] = useState({});

    const createScopedSetters = useCallback((id) => {
        const setAnimations = (newAnimations) => {
            setModelStates(prev => ({
                ...prev,
                [id]: {
                    ...(prev[id] || {}),
                    animations: newAnimations,
                    animationIndex: (prev[id]?.animations === newAnimations) ? (prev[id]?.animationIndex ?? 0) : 0
                }
            }));
        };

        const setAnimationIndex = (newIndex) => {
            setModelStates(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    animationIndex: typeof newIndex === 'function'
                        ? newIndex(prev[id]?.animationIndex ?? 0)
                        : newIndex
                }
            }));
        };

        return { setAnimations, setAnimationIndex };
    }, []);

    const getModelState = useCallback((id) => {
        return modelStates[id] || { animations: [], animationIndex: 0 };
    }, [modelStates]);

    const contextValue = {
        getModelState,
        createScopedSetters
    };

    return (
        <ModelAnimationsContext.Provider value={contextValue}>
            {props.children}
        </ModelAnimationsContext.Provider>
    );
};

export const useModelAnimations = (id) => {
    const context = useContext(ModelAnimationsContext);

    if (!id || typeof id !== 'string') {
        console.error("useModelAnimations requires a valid string ID (url) as an argument.");
        return { animations: [], setAnimations: () => {}, animationIndex: 0, setAnimationIndex: () => {} };
    }

    const { animations, animationIndex } = context.getModelState(id);
    
    const { setAnimations, setAnimationIndex } = context.createScopedSetters(id);

    return {
        animations,
        setAnimations,
        animationIndex,
        setAnimationIndex
    };
};