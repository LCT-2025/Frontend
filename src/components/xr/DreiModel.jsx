import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useModelAnimations } from '../contexts/ModelAnimations'

export function DreiModel(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/larisa.glb')
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
        <group name="Armature" rotation={[0, 0, Math.PI / 2]}>
          <group name="Cube">
            <skinnedMesh
              name="Cube001"
              geometry={nodes.Cube001.geometry}
              material={materials.Velour}
              skeleton={nodes.Cube001.skeleton}
            />
            <skinnedMesh
              name="Cube001_1"
              geometry={nodes.Cube001_1.geometry}
              material={materials['Material.001']}
              skeleton={nodes.Cube001_1.skeleton}
            />
            <skinnedMesh
              name="Cube001_2"
              geometry={nodes.Cube001_2.geometry}
              material={materials['Material.002']}
              skeleton={nodes.Cube001_2.skeleton}
            />
            <skinnedMesh
              name="Cube001_3"
              geometry={nodes.Cube001_3.geometry}
              material={materials['Velour.001']}
              skeleton={nodes.Cube001_3.skeleton}
            />
            <mesh
              name="Plane"
              castShadow
              receiveShadow
              geometry={nodes.Plane.geometry}
              material={materials['Material.003']}
              position={[0.634, 1.321, -0.245]}
              rotation={[2.685, -1.335, 1.125]}
              scale={0.169}
            />
          </group>
          <primitive object={nodes.Bone} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/larisa.glb')

