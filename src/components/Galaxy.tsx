import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Model(props) {
  const { nodes, materials } = useGLTF("./models/galaxy.glb");
  return (
    <group {...props} dispose={null}>
      <group
        position={[-0.851, 11.243, 0]}
        rotation={[-Math.PI / 2, -0.109, 0]}
      >
        <points
          geometry={nodes.Object_2.geometry}
          material={materials.nuages}
        />
        <points
          geometry={nodes.Object_3.geometry}
          material={materials.nuages}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/galaxy.glb");
