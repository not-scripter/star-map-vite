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

const planetScaleFactor = 0.00000000000000001;
const marsPosition = vsop.getMars(jd); // Planetary position in AU
const earthPosition = vsop.getEarth(jd); // Earth's position in AU

const marsGeocentric = [
  (marsPosition[0] - earthPosition[0]) * planetScaleFactor,
  (marsPosition[1] - earthPosition[1]) * planetScaleFactor,
  (marsPosition[2] - earthPosition[2]) * planetScaleFactor,
];

const planetPosition = new THREE.Vector3(
  marsGeocentric[0],
  marsGeocentric[1],
  marsGeocentric[2]
);
const planetSize = 10;
const planetScale = planetScaleFactor * planetSize;

alert(planetPosition.x);

export default function StarMap({ stars }: StarMapProps) {
  const raDecToXYZ = (star: Star) => {
    const raRad = (star.RA / 24) * Math.PI * 2; // Convert RA from hours to radians
    const decRad = (star.DE / 180) * Math.PI; // Convert DE from degrees to radians

    const baseDistance = 100; // Base distance in your 3D scene units
    const distance = Math.max(1, baseDistance + (star.AM - 0.4) * 10);

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
        backgroundColor: "black",
        width: window.innerWidth,
        height: window.innerHeight,
      }}
    >
      <Canvas>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />

        {/* <Environment preset="sunset" background /> */}

        <mesh geometry={geometry} position={planetPosition} scale={0.5}>
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
          fov={50}
          near={0.1}
          far={20000}
          aspect={window.innerWidth / window.innerHeight}
          position={[0, 0, 0]}
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
