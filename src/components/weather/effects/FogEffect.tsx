import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FogEffectProps {
  intensity?: number;
}

function FogLayer({ 
  yPos, 
  speed, 
  opacity 
}: { 
  yPos: number; 
  speed: number; 
  opacity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const time = state.clock.elapsedTime;
    meshRef.current.position.x = Math.sin(time * speed) * 2;
    materialRef.current.opacity = opacity * (0.8 + Math.sin(time * speed * 2) * 0.2);
  });

  return (
    <mesh ref={meshRef} position={[0, yPos, 0]} rotation={[-Math.PI / 6, 0, 0]}>
      <planeGeometry args={[30, 8]} />
      <meshBasicMaterial 
        ref={materialRef}
        color="#d4d4d4" 
        transparent 
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export function FogEffect({ intensity = 1 }: FogEffectProps) {
  return (
    <group>
      <FogLayer yPos={-2} speed={0.1} opacity={0.15 * intensity} />
      <FogLayer yPos={0} speed={0.08} opacity={0.12 * intensity} />
      <FogLayer yPos={2} speed={0.12} opacity={0.1 * intensity} />
      <ambientLight intensity={0.5} color="#e0e0e0" />
    </group>
  );
}
