"use client";

import { Suspense, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Float, PerformanceMonitor, Preload, Sparkles, Stars, Text } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

type SceneCanvasProps = {
  progressRef: MutableRefObject<number>;
};

type Pose = {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  camera: [number, number, number];
  lookAt: [number, number, number];
};

const POSES: Pose[] = [
  {
    position: [1.55, -0.05, 0],
    scale: 0.94,
    rotation: [0.05, -0.18, 0],
    camera: [0, 0.2, 7.4],
    lookAt: [0, 0, 0]
  },
  {
    position: [1.45, -0.05, 0.15],
    scale: 0.9,
    rotation: [0.32, 0.85, -0.12],
    camera: [0.55, 0.2, 7.0],
    lookAt: [0.4, 0, 0]
  },
  {
    position: [-1.4, 0.18, -0.05],
    scale: 0.95,
    rotation: [0.95, 1.85, 0.18],
    camera: [-0.7, 0.32, 6.6],
    lookAt: [-0.2, 0.05, 0]
  },
  {
    position: [1.18, 0.1, 0.2],
    scale: 1.15,
    rotation: [1.2, 2.95, -0.3],
    camera: [0.85, 0.05, 6.3],
    lookAt: [0.3, 0, 0]
  },
  {
    position: [-0.2, -0.18, 0],
    scale: 1.05,
    rotation: [1.85, 4.05, 0.12],
    camera: [0, 0.55, 7.4],
    lookAt: [0, 0, 0]
  }
];

function mix(a: number, b: number, t: number) {
  return THREE.MathUtils.lerp(a, b, t);
}

function samplePose(progress: number, mobile: boolean): Pose {
  const clamped = THREE.MathUtils.clamp(progress, 0, 0.999);
  const segment = Math.min(Math.floor(clamped * (POSES.length - 1)), POSES.length - 2);
  const local = clamped * (POSES.length - 1) - segment;
  const eased = THREE.MathUtils.smoothstep(local, 0, 1);
  const from = POSES[segment];
  const to = POSES[segment + 1];
  const heroBias = mobile ? Math.max(0, 1 - progress * 5) : 0;
  const xFactor = mobile ? 0.36 : 1;
  const yOffset = mobile ? -1.25 - heroBias * 1.05 : 0;
  const scaleFactor = mobile ? 0.62 - heroBias * 0.06 : 1;

  return {
    position: [
      mix(from.position[0], to.position[0], eased) * xFactor,
      mix(from.position[1], to.position[1], eased) + yOffset,
      mix(from.position[2], to.position[2], eased)
    ],
    scale: mix(from.scale, to.scale, eased) * scaleFactor,
    rotation: [
      mix(from.rotation[0], to.rotation[0], eased),
      mix(from.rotation[1], to.rotation[1], eased),
      mix(from.rotation[2], to.rotation[2], eased)
    ],
    camera: [
      mix(from.camera[0], to.camera[0], eased) * (mobile ? 0.55 : 1),
      mix(from.camera[1], to.camera[1], eased) + (mobile ? 0.2 : 0),
      mix(from.camera[2], to.camera[2], eased) + (mobile ? 1.0 : 0)
    ],
    lookAt: [
      mix(from.lookAt[0], to.lookAt[0], eased) * (mobile ? 0.5 : 1),
      mix(from.lookAt[1], to.lookAt[1], eased),
      mix(from.lookAt[2], to.lookAt[2], eased)
    ]
  };
}

function buildAShape() {
  const outer = new THREE.Shape();
  outer.moveTo(-0.95, -0.9);
  outer.lineTo(0.95, -0.9);
  outer.lineTo(0.22, 1.18);
  outer.lineTo(-0.22, 1.18);
  outer.closePath();

  const hole = new THREE.Path();
  hole.moveTo(-0.5, -0.78);
  hole.lineTo(0.5, -0.78);
  hole.lineTo(0.115, 0.45);
  hole.lineTo(-0.115, 0.45);
  hole.closePath();

  outer.holes.push(hole);

  const crossbar = new THREE.Shape();
  crossbar.moveTo(-0.4, 0.45);
  crossbar.lineTo(0.4, 0.45);
  crossbar.lineTo(0.36, 0.6);
  crossbar.lineTo(-0.36, 0.6);
  crossbar.closePath();

  return { outer, crossbar };
}

function seededPoint(index: number) {
  const angle = index * 1.61803398875;
  const radius = 2.4 + (index % 5) * 0.36;
  const y = ((index % 9) - 4) * 0.32;
  return [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as const;
}

function LogoMark({ progressRef }: SceneCanvasProps) {
  const group = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const aMeshRef = useRef<THREE.Mesh>(null);
  const currentProgress = useRef(0);
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const targetScale = useMemo(() => new THREE.Vector3(), []);
  const targetCamera = useMemo(() => new THREE.Vector3(), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(), []);
  const smoothLookAt = useMemo(() => new THREE.Vector3(), []);
  const nodes = useMemo(() => Array.from({ length: 16 }, (_, index) => seededPoint(index)), []);

  const { outer: aShape, crossbar: crossbarShape } = useMemo(() => buildAShape(), []);

  const extrudeOpts = useMemo(
    () => ({
      depth: 0.42,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.04,
      bevelThickness: 0.04,
      curveSegments: 8
    }),
    []
  );

  const labels = useMemo(
    () => [
      { text: "P&L", position: [-0.95, 0.95, 0.5] as [number, number, number], color: "#f3e4c8" },
      { text: "VAT", position: [1.65, 0.7, 0.25] as [number, number, number], color: "#f4efe6" },
      { text: "TAX", position: [-1.7, -0.85, 0.25] as [number, number, number], color: "#ff6938" },
      { text: "CASH", position: [1.4, -1.1, 0.55] as [number, number, number], color: "#f3e4c8" },
      { text: "TB", position: [0.15, 1.7, -0.18] as [number, number, number], color: "#f4efe6" },
      { text: "2026", position: [0.18, -1.65, -0.1] as [number, number, number], color: "#ff6938" }
    ],
    []
  );

  useFrame((state, delta) => {
    const mobile = state.size.width < 720;
    currentProgress.current = THREE.MathUtils.damp(
      currentProgress.current,
      progressRef.current,
      6.2,
      delta
    );
    const pose = samplePose(currentProgress.current, mobile);
    const pulse = Math.sin(state.clock.elapsedTime * 1.6) * 0.025;
    const lerpFactor = 1 - Math.exp(-delta * 7.2);

    targetPosition.set(...pose.position);
    targetScale.setScalar(pose.scale + pulse);
    targetCamera.set(...pose.camera);
    targetLookAt.set(...pose.lookAt);

    if (group.current) {
      group.current.position.lerp(targetPosition, lerpFactor);
      group.current.scale.lerp(targetScale, lerpFactor);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pose.rotation[0], 4, delta);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pose.rotation[1], 4, delta);
      group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, pose.rotation[2], 4, delta);
    }

    if (aMeshRef.current) {
      const mat = aMeshRef.current.material as THREE.MeshPhysicalMaterial;
      const t = state.clock.elapsedTime;
      mat.emissiveIntensity = 0.65 + Math.sin(t * 1.4) * 0.12;
    }

    if (ringA.current) ringA.current.rotation.z += delta * 0.22;
    if (ringB.current) ringB.current.rotation.x -= delta * 0.16;
    if (ringC.current) ringC.current.rotation.y += delta * 0.28;

    state.camera.position.lerp(targetCamera, lerpFactor * 0.7);
    smoothLookAt.lerp(targetLookAt, lerpFactor);
    state.camera.lookAt(smoothLookAt);
  });

  return (
    <group>
      <Float floatIntensity={0.18} rotationIntensity={0.16} speed={1.0}>
        <group ref={group}>
          {/* Extruded A mark — the brand letter */}
          <mesh ref={aMeshRef} castShadow receiveShadow>
            <extrudeGeometry args={[aShape, extrudeOpts]} />
            <meshPhysicalMaterial
              color="#f0441a"
              emissive="#7d1a06"
              emissiveIntensity={0.7}
              metalness={0.78}
              roughness={0.22}
              clearcoat={1}
              clearcoatRoughness={0.18}
              reflectivity={0.85}
            />
          </mesh>

          {/* Crossbar of the A — slightly raised */}
          <mesh position={[0, 0, 0.005]}>
            <extrudeGeometry args={[crossbarShape, { ...extrudeOpts, depth: 0.45 }]} />
            <meshPhysicalMaterial
              color="#ff5a26"
              emissive="#9a1f08"
              emissiveIntensity={0.85}
              metalness={0.85}
              roughness={0.18}
              clearcoat={1}
              clearcoatRoughness={0.15}
            />
          </mesh>

          {/* Horizontal bar extending right — echoes the AllFinanz logo's top bar */}
          <mesh position={[1.85, 1.0, 0.21]}>
            <boxGeometry args={[3.2, 0.16, 0.32]} />
            <meshPhysicalMaterial
              color="#f0441a"
              emissive="#5e1304"
              emissiveIntensity={0.55}
              metalness={0.82}
              roughness={0.24}
              clearcoat={0.85}
            />
          </mesh>

          {/* Wireframe overlay for technical feel */}
          <mesh scale={1.012} position={[0, 0, 0.001]}>
            <extrudeGeometry args={[aShape, { ...extrudeOpts, depth: 0.43 }]} />
            <meshBasicMaterial color="#f3e4c8" wireframe transparent opacity={0.12} />
          </mesh>

          {/* Orbital rings */}
          <mesh ref={ringA} rotation={[Math.PI / 2.4, 0.2, 0]}>
            <torusGeometry args={[2.0, 0.012, 10, 128]} />
            <meshStandardMaterial color="#ff6938" emissive="#5e1304" emissiveIntensity={1.4} />
          </mesh>
          <mesh ref={ringB} rotation={[0.1, Math.PI / 2.6, 0.4]}>
            <torusGeometry args={[2.42, 0.01, 10, 128]} />
            <meshStandardMaterial color="#f3e4c8" emissive="#3a2f1c" emissiveIntensity={0.5} />
          </mesh>
          <mesh ref={ringC} rotation={[0.7, 0.4, Math.PI / 2.2]}>
            <torusGeometry args={[2.82, 0.008, 10, 128]} />
            <meshStandardMaterial color="#f0441a" emissive="#481001" emissiveIntensity={1.0} />
          </mesh>

          {/* Floating data plate (left) */}
          <group position={[-1.25, -0.15, 0.85]} rotation={[0.18, -0.42, 0.08]} scale={0.78}>
            <mesh>
              <boxGeometry args={[1.34, 0.035, 0.92]} />
              <meshStandardMaterial color="#f3e4c8" emissive="#2c2417" transparent opacity={0.22} />
            </mesh>
            {Array.from({ length: 5 }).map((_, index) => (
              <mesh key={index} position={[0, 0.035, -0.32 + index * 0.16]}>
                <boxGeometry args={[1.05, 0.014, 0.018]} />
                <meshStandardMaterial color={index % 2 === 0 ? "#ff6938" : "#f0441a"} emissive="#4a1003" emissiveIntensity={0.85} />
              </mesh>
            ))}
            {Array.from({ length: 3 }).map((_, index) => (
              <mesh key={index} position={[-0.34 + index * 0.34, 0.038, 0]}>
                <boxGeometry args={[0.016, 0.014, 0.74]} />
                <meshStandardMaterial color="#f4efe6" transparent opacity={0.34} />
              </mesh>
            ))}
          </group>

          {/* Floating data plate (right) */}
          <group position={[1.25, 0.18, -0.7]} rotation={[-0.12, 0.42, -0.04]} scale={0.82}>
            <mesh>
              <boxGeometry args={[0.88, 0.05, 1.08]} />
              <meshStandardMaterial color="#0e1014" emissive="#101418" transparent opacity={0.78} />
            </mesh>
            {Array.from({ length: 4 }).map((_, row) =>
              Array.from({ length: 3 }).map((__, col) => (
                <mesh key={`${row}-${col}`} position={[-0.27 + col * 0.27, 0.048, -0.34 + row * 0.22]}>
                  <boxGeometry args={[0.16, 0.022, 0.09]} />
                  <meshStandardMaterial color={row === 0 ? "#f0441a" : "#ff6938"} emissive="#3a0c01" emissiveIntensity={0.6} />
                </mesh>
              ))
            )}
          </group>

          {labels.map((label) => (
            <Text
              key={label.text}
              position={label.position}
              fontSize={label.text.length > 3 ? 0.22 : 0.3}
              anchorX="center"
              anchorY="middle"
              color={label.color}
              outlineWidth={0.008}
              outlineColor="#070809"
            >
              {label.text}
            </Text>
          ))}

          {nodes.map((position, index) => (
            <mesh key={index} position={position} scale={index % 3 === 0 ? 0.06 : 0.04}>
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial
                color={index % 2 === 0 ? "#ff6938" : "#f3e4c8"}
                emissive={index % 2 === 0 ? "#4a1003" : "#5a4b2f"}
                emissiveIntensity={1.1}
              />
            </mesh>
          ))}
        </group>
      </Float>
    </group>
  );
}

function PostFx({ enabled }: { enabled: boolean }) {
  if (!enabled) {
    return null;
  }
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.7}
        luminanceThreshold={0.42}
        luminanceSmoothing={0.22}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.22} darkness={0.7} />
    </EffectComposer>
  );
}

function SceneInner({ progressRef }: SceneCanvasProps) {
  const { size } = useThree();
  const compact = size.width < 860;
  const [quality, setQuality] = useState<"high" | "low">("low");
  const highQuality = quality === "high" && !compact;

  return (
    <>
      <PerformanceMonitor
        onDecline={() => setQuality("low")}
        onIncline={() => setQuality("high")}
        flipflops={2}
      />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} color="#fff2de" />
      <pointLight position={[-3, 2, 4]} intensity={18} color="#f0441a" />
      <pointLight position={[3, -1, 3]} intensity={11} color="#ff6938" />
      <fog attach="fog" args={["#070809", 9, 19]} />
      <Stars radius={36} depth={18} count={highQuality ? 220 : compact ? 80 : 120} factor={4} saturation={0} fade speed={0.25} />
      <Sparkles count={highQuality ? 24 : compact ? 8 : 14} scale={[8.2, 5.4, 8.2]} size={2.0} speed={0.25} color="#f3e4c8" opacity={0.34} />
      <LogoMark progressRef={progressRef} />
      <PostFx enabled={highQuality} />
    </>
  );
}

export default function SceneCanvas({ progressRef }: SceneCanvasProps) {
  return (
    <div className="scene-layer" aria-hidden="true">
      <Canvas
        id="three-canvas"
        camera={{ position: [0, 0.2, 7.4], fov: 42, near: 0.1, far: 80 }}
        dpr={[0.75, 1.1]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        shadows={false}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <SceneInner progressRef={progressRef} />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
