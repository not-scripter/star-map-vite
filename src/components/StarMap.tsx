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
import JulianDate from "../data/julian-date";
import vsop from "../data/vsop87a_xsmall";

interface StarMapProps {
  stars: Star[];
}

const geometry = new THREE.SphereGeometry(1, 16, 16);

const date = new Date();
const jd = JulianDate.gregorianDateToJulianDate(
  date.getFullYear(),
  date.getMonth() + 1,
  date.getDate(),
  date.getHours(),
  date.getMinutes(),
  date.getSeconds()
);

const planetScale = 1000;
const PLANET_DISTANCE_SCALE = 1;

// Retrieve positions from VSOP87 (assumed to be in AU)
const marsPosition = vsop.getMars(jd);
const earthPosition = vsop.getEarth(jd);

// Correct the geocentric position calculation by scaling after subtraction
const marsGeocentric = [
  (marsPosition[0] - earthPosition[0]) * planetScale,
  (marsPosition[1] - earthPosition[1]) * planetScale,
  (marsPosition[2] - earthPosition[2]) * planetScale,
];

// Use the geocentric coordinates directly, applying the distance scale factor
const planetX = marsGeocentric[0] * PLANET_DISTANCE_SCALE;
const planetY = marsGeocentric[1] * PLANET_DISTANCE_SCALE;
const planetZ = marsGeocentric[2] * PLANET_DISTANCE_SCALE;

// Directly create the Vector3 position without redundant recalculations
const planetPosition = new THREE.Vector3(planetX, planetY, planetZ);

alert(planetPosition.x);

export default function StarMap({ stars }: StarMapProps) {
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

    // const maxOpacity = 1;
    // const minOpacity = 0.1;
    // const opacity = maxOpacity - star.AM * minOpacity;
    const minOpacity = 0.2;
    const maxOpacity = 1.0;
    const opacityPow = maxOpacity * Math.pow(0.8, star.AM);
    const opacity = Math.max(minOpacity, Math.min(maxOpacity, opacityPow));

    // const minScale = 0.1;
    // const maxScale = 1;
    // const scale = maxScale - star.AM * minScale;
    const baseScale = 0.2;
    const scaleFactor = 1.5;
    const scale = baseScale * Math.pow(scaleFactor, -star.AM);

    return { position, size, color, scale, opacity };
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

        <mesh geometry={geometry} position={planetPosition} scale={10}>
          <meshBasicMaterial color="#ff0000" transparent opacity={1} />
        </mesh>

        <OrbitControls
          makeDefault
          enableZoom={true}
          zoomSpeed={1}
          minDistance={0.1}
          maxDistance={100}
        />

        <PerspectiveCamera
          makeDefault
          position={[0, 0, 0]}
          fov={100}
          near={0.1}
          far={1000}
        />

        {stars.map((star, index) => {
          const { position, size, color, scale, opacity } = raDecToXYZ(star);

          return (
            <group position={position} key={index}>
              <mesh
                geometry={geometry}
                scale={scale}
                onClick={() => alert(position.x)}
              >
                {/* <sphereGeometry args={[size, 16, 16]} /> */}
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={opacity}
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
