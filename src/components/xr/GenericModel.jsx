import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export function GenericModel({ modelPath, position, scale, animationName, ...props }) {
  const group = useRef()
  const { scene, animations } = useGLTF(modelPath)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (actions && animationName && actions[animationName]) {
      const action = actions[animationName];
      action.reset().play();

      return () => {
        action.stop();
      }
    }
  }, [actions, animationName])

  return (
    <group ref={group} position={position} scale={scale} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}
