import {
  Billboard,
  OrbitControls,
  PerspectiveCamera,
  Text,
  Environment,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import React, { useState } from "react";
import * as THREE from "three";
import { Star, T } from "../data/testStars";

interface StarMapProps {
  stars: Star[];
}

const geometry = new THREE.SphereGeometry(1, 16, 16);

export default function StarMap({ stars }: StarMapProps) {
  const [scale, setscale] = useState<number>(1);

  const raDecToXYZ = (star: Star) => {
    const raRad = (star.RA / 180) * Math.PI;
    const decRad = (star.DE / 180) * Math.PI;

    const distance = Math.max(1, 30 + (star.AM - 0.4) * 10);

    const x = distance * Math.cos(decRad) * Math.cos(raRad);
    const y = distance * Math.cos(decRad) * Math.sin(raRad);
    const z = distance * Math.sin(decRad);

    const position = new THREE.Vector3(x, y, z);

    const minSize = 0.05;
    const maxSize = 0.5;
    const size = maxSize - star.AM * minSize;

    const t = star.t;
    const color =
      t === "Oc"
        ? "#ff0000"
        : t === "Ca"
        ? "#ff00ff"
        : t === "Gc"
        ? "#ffff00"
        : t === "Ne"
        ? "#00ffff"
        : t === "Ga"
        ? "#00ff00"
        : t === "P"
        ? "#0000ff"
        : t === "S"
        ? "#0bbbb0"
        : t === "U"
        ? "#eee0e0"
        : "#ffffff";

    const maxOpacity = 1;
    const minOpacity = 0.1;
    const opasity = maxOpacity - star.AM * minOpacity;

    const minScale = 0.1;
    const maxScale = 2.0;
    const scale = maxScale - star.AM * minScale;

    return { position, size, color, scale, opasity };
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "gray",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Canvas>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />

        {/* <Environment preset="sunset" background /> */}

        <OrbitControls
          makeDefault
          enableZoom={true}
          zoomSpeed={1}
          minDistance={1}
          maxDistance={200}
        />

        <PerspectiveCamera
          makeDefault
          position={[0, 0, 50]}
          fov={75}
          near={0.1}
          far={1000}
        />

        {stars.map((star, index) => {
          const { position, size, color, scale, opasity } = raDecToXYZ(star);

          return (
            <group position={position} key={index}>
              <mesh
                geometry={geometry}
                scale={scale}
                onClick={() => alert(size)}
              >
                {/* <sphereGeometry args={[size, 16, 16]} /> */}
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={opasity}
                />
              </mesh>
              <Billboard>
                <Text anchorY={0.5}>{star.name}</Text>
              </Billboard>
            </group>
          );
        })}
      </Canvas>
    </div>
  );
}
