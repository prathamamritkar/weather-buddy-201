import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RainEffectProps {
  count: number;
  intensity?: number;
  windSpeed?: number;
}

export function RainEffect({ count, intensity = 1, windSpeed = 0 }: RainEffectProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Initialize positions and velocities
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    const phases = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;      // x: spread across viewport
      positions[i * 3 + 1] = Math.random() * 15 + 5;       // y: start above viewport
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;   // z: depth layers
      velocities[i] = 0.15 + Math.random() * 0.1;          // fall speed
      phases[i] = Math.random() * Math.PI * 2;             // random phase for variation
    }
    
    return { positions, velocities, phases };
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const windAngle = Math.min(windSpeed * 0.02, 0.3); // Cap wind angle

    for (let i = 0; i < count; i++) {
      let x = particles.positions[i * 3];
      let y = particles.positions[i * 3 + 1];
      const z = particles.positions[i * 3 + 2];
      
      // Move raindrop
      y -= particles.velocities[i] * intensity * 60 * delta;
      x += windAngle * particles.velocities[i] * 30 * delta;
      
      // Reset when below viewport
      if (y < -8) {
        y = 15 + Math.random() * 5;
        x = (Math.random() - 0.5) * 20;
        particles.positions[i * 3] = x;
      }
      
      particles.positions[i * 3 + 1] = y;
      particles.positions[i * 3] = x;
      
      // Update instance matrix
      dummy.position.set(x, y, z);
      dummy.rotation.z = -windAngle - 0.1;
      dummy.scale.set(0.015, 0.15 + Math.sin(particles.phases[i] + time) * 0.02, 0.015);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <capsuleGeometry args={[1, 2, 2, 4]} />
      <meshBasicMaterial 
        color="#6EB5FF" 
        transparent 
        opacity={0.25 * intensity} 
      />
    </instancedMesh>
  );
}
