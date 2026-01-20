import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ClearSkyEffectProps {
  isNight?: boolean;
  intensity?: number;
}

function SunGlow({ intensity }: { intensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    meshRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.05);
    meshRef.current.rotation.z = time * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[6, 6, -5]}>
      <circleGeometry args={[1.5, 32]} />
      <meshBasicMaterial 
        color="#FFD93D" 
        transparent 
        opacity={0.4 * intensity}
      />
    </mesh>
  );
}

function StarField({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = Math.random() * 15;
    positions[i * 3 + 2] = -5 - Math.random() * 5;
  }

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = 0.5 + Math.sin(time * 2) * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positions} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#ffffff"
        size={0.03}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export function ClearSkyEffect({ isNight = false, intensity = 1 }: ClearSkyEffectProps) {
  if (isNight) {
    return (
      <group>
        <StarField count={100} />
        <ambientLight intensity={0.15} color="#1a1a2e" />
      </group>
    );
  }

  return (
    <group>
      <SunGlow intensity={intensity} />
      <ambientLight intensity={0.8} color="#fff9e6" />
    </group>
  );
}
