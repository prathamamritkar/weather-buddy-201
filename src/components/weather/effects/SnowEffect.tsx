import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SnowEffectProps {
  count: number;
  intensity?: number;
}

export function SnowEffect({ count, intensity = 1 }: SnowEffectProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, sizes, velocities, drifts } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count);
    const drifts = new Float32Array(count * 2);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 20 - 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sizes[i] = 0.03 + Math.random() * 0.05;
      velocities[i] = 0.01 + Math.random() * 0.02;
      drifts[i * 2] = Math.random() * 2 - 1;     // drift x amplitude
      drifts[i * 2 + 1] = Math.random() * Math.PI * 2; // drift phase
    }
    
    return { positions, sizes, velocities, drifts };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, sizes]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const posAttr = pointsRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      let y = posAttr.getY(i);
      let x = posAttr.getX(i);
      
      // Gentle fall
      y -= velocities[i] * intensity * 60 * delta;
      
      // Horizontal drift
      x += Math.sin(time * 0.5 + drifts[i * 2 + 1]) * drifts[i * 2] * 0.002 * intensity;
      
      // Reset when below viewport
      if (y < -8) {
        y = 15 + Math.random() * 3;
        x = (Math.random() - 0.5) * 20;
      }
      
      posAttr.setY(i, y);
      posAttr.setX(i, x);
    }
    
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = Math.sin(time * 0.1) * 0.02;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial 
        color="#ffffff"
        size={0.08}
        transparent
        opacity={0.8 * intensity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
