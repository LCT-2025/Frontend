import { useEffect } from "react";
import { useAnimations } from "@react-three/drei";
import { useModelAnimations } from "../components/contexts/ModelAnimations";

export const useModelAnimation = (modelAnimations, group) => {
    const { actions, names } = useAnimations(modelAnimations, group);
    const { setAnimations, animationIndex } = useModelAnimations();

    useEffect(() => {
        if (names && names.length > 0) {
            setAnimations(names);
        }
    }, [names, setAnimations]);

    useEffect(() => {
        if (names && names.length > animationIndex && actions[names[animationIndex]]) {
            const action = actions[names[animationIndex]];
            action.reset().fadeIn(0.5).play();

            return () => {
                action.fadeOut(0.5);
            };
        }
    }, [animationIndex, actions, names]);
};
