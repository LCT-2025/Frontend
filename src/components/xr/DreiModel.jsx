import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useModelAnimations } from '../contexts/ModelAnimations';

export function DreiModel(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('/larisa.glb');
  const { actions, names } = useAnimations(animations, group);

  // Получаем setAnimations и animationIndex из контекста с проверкой
  const { setAnimations, animationIndex } = useModelAnimations() || {};

  useEffect(() => {
    if (typeof setAnimations !== 'function') {
      console.warn('setAnimations is not a function - возможно DreiModel используется вне ModelAnimationsProvider');
      return;
    }
    if (names.length === 0) return;
    setAnimations(names);
  }, [names, setAnimations]);

  useEffect(() => {
    if (!actions || !names.length) return;
    const action = actions[names[animationIndex]];
    if (action) {
      action.reset().fadeIn(0.5).play();
    }

    return () => {
      if (action) {
        action.fadeOut(0.5);
      }
    };
  }, [animationIndex, actions, names]);

  // Сделаем плоскость прозрачной, чтобы не закрывала видео
  if(materials['Material.003']){
    materials['Material.003'].transparent = true;
    materials['Material.003'].opacity = 0;
  }

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
  );
}

useGLTF.preload('/larisa.glb');
