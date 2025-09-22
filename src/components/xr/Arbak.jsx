import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useModelAnimations } from '../contexts/ModelAnimations'

export function Arbak(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/arbak.glb')
  const { actions, names } = useAnimations(animations, group)

const {setAnimations, animationIndex} = useModelAnimations();

  useEffect(() => {
      setAnimations(names);
    }, [])
  
    useEffect(() => {
      actions[names[animationIndex]].reset().fadeIn(0.5).play();

      return ()=>{
        actions[names[animationIndex]]?.fadeOut();
      }
    }, [animationIndex])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" position={[0, 4.651, 0]} rotation={[0, 0, Math.PI]} scale={1.524}>
          <group name="Armature001">
            <skinnedMesh
              name="Sphere001"
              geometry={nodes.Sphere001.geometry}
              material={materials['Material.001']}
              skeleton={nodes.Sphere001.skeleton}
            />
            <primitive object={nodes.Bone027} />
            <primitive object={nodes.Bone028} />
            <primitive object={nodes.Bone029} />
            <primitive object={nodes.Bone030} />
            <primitive object={nodes.neutral_bone} />
          </group>
          <primitive object={nodes.Bone} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/arbak.glb')

