import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CloudsEffectProps {
  count: number;
  intensity?: number;
}

function CloudPlane({ 
  position, 
  scale, 
  speed, 
  opacity 
}: { 
  position: [number, number, number]; 
  scale: number; 
  speed: number; 
  opacity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialX = position[0];

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    meshRef.current.position.x = initialX + Math.sin(time * speed) * 0.5;
    meshRef.current.position.y = position[1] + Math.cos(time * speed * 0.7) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[scale * 4, scale * 2]} />
      <meshBasicMaterial 
        color="#e8e8e8" 
        transparent 
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export function CloudsEffect({ count, intensity = 1 }: CloudsEffectProps) {
  const clouds = [];
  
  for (let i = 0; i < Math.min(count, 8); i++) {
    const layer = Math.floor(i / 3);
    clouds.push(
      <CloudPlane
        key={i}
        position={[
          (Math.random() - 0.5) * 16,
          4 + layer * 2 + Math.random(),
          -2 - layer * 2
        ]}
        scale={1.5 + Math.random()}
        speed={0.08 + Math.random() * 0.05}
        opacity={0.15 * intensity * (1 - layer * 0.2)}
      />
    );
  }

  return <group>{clouds}</group>;
}
