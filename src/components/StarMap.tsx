import {
  Billboard,
  OrbitControls,
  PerspectiveCamera,
  Text,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useState } from "react";
import * as THREE from "three";
import { Star } from "../data/testStars";

interface StarMapProps {
  stars: Star[];
}

export default function StarMap({ stars }: StarMapProps) {
  const [scale, setscale] = useState<number>(1);

  // Convert RA/Dec to XYZ coordinates
  const raDecToXYZ = (star: Star) => {
    const raRad = (star.RA / 180) * Math.PI;
    const decRad = (star.DE / 180) * Math.PI;

    const distance = Math.max(1, 30 + (star.AM - 0.4) * 10);
    // const baseDistance = 50;
    // const distance = baseDistance + star.AM * 10;
    //     // const distance = 50 + Math.log(1 + star.AM) * 20;
    //     const minAM = Math.min(...stars.map(s => s.AM));
    // const maxAM = Math.max(...stars.map(s => s.AM));
    //
    // const normalizedAM = (star.AM - minAM) / (maxAM - minAM);
    // const distance = 30 + normalizedAM * 50;

    const x = distance * Math.cos(decRad) * Math.cos(raRad);
    const y = distance * Math.cos(decRad) * Math.sin(raRad);
    const z = distance * Math.sin(decRad);

    const position = new THREE.Vector3(x, y, z);

    const minSize = 0.05;
    const maxSize = 0.5;
    const size = maxSize - star.AM * 0.1;

    const t = star.t;
    const color =
      t === "Oc"
        ? "#f00"
        : t === "Ca"
          ? "#f0f"
          : t === "Gc"
            ? "#ff0"
            : t === "Ne"
              ? "#0ff"
              : t === "Ga"
                ? "#0f0"
                : t === "P"
                  ? "#00f"
                  : t === "S"
                    ? "#0bbbb0"
                    : t === "U"
                      ? "#eee0e0"
                      : "#ffffff";

    return { position, size, color };
  };

  return (
    <div
      style={{
        backgroundColor: "gray",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Canvas>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />

        <mesh>
          <sphereGeometry args={[10, 32, 32]} />
          <meshBasicMaterial color="#000080" wireframe={true} />
        </mesh>

        <OrbitControls
          makeDefault
          enableZoom={true}
          zoomSpeed={1}
          minDistance={50}
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
          const { position, size, color } = raDecToXYZ(star);

          return (
            <group key={index}>
              <mesh position={position} onClick={() => alert(star.name)}>
                <sphereGeometry args={[size, 16, 16]} />
                <meshBasicMaterial color={color} />
                <Billboard>
                  <Text>{star.name}</Text>
                </Billboard>
              </mesh>
            </group>
          );
        })}
      </Canvas>
    </div>
  );
}
