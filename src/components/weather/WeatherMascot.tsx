import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshWobbleMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface MascotProps {
  condition?: string;
}

function CloudMascot({ condition = 'Clear' }: MascotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);

  // Animation based on weather condition
  const animationConfig = useMemo(() => {
    switch (condition) {
      case 'Clear':
        return { wobbleSpeed: 2, wobbleFactor: 0.1, floatSpeed: 1.5, color: '#FFD93D' };
      case 'Clouds':
        return { wobbleSpeed: 1, wobbleFactor: 0.05, floatSpeed: 1, color: '#A8D8EA' };
      case 'Rain':
      case 'Drizzle':
        return { wobbleSpeed: 3, wobbleFactor: 0.15, floatSpeed: 2, color: '#6EB5FF' };
      case 'Thunderstorm':
        return { wobbleSpeed: 5, wobbleFactor: 0.2, floatSpeed: 3, color: '#9B59B6' };
      case 'Snow':
        return { wobbleSpeed: 0.5, wobbleFactor: 0.03, floatSpeed: 0.8, color: '#E8F4F8' };
      default:
        return { wobbleSpeed: 1.5, wobbleFactor: 0.08, floatSpeed: 1.2, color: '#87CEEB' };
    }
  }, [condition]);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle breathing animation
      const t = state.clock.elapsedTime;
      groupRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.02);
      
      // Eye tracking (follows a circular pattern)
      if (eyeLeftRef.current && eyeRightRef.current) {
        const eyeX = Math.sin(t * 0.5) * 0.03;
        const eyeY = Math.cos(t * 0.5) * 0.02;
        eyeLeftRef.current.position.x = -0.15 + eyeX;
        eyeLeftRef.current.position.y = 0.1 + eyeY;
        eyeRightRef.current.position.x = 0.15 + eyeX;
        eyeRightRef.current.position.y = 0.1 + eyeY;
      }
    }
  });

  return (
    <Float speed={animationConfig.floatSpeed} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Main cloud body */}
        <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
          <MeshWobbleMaterial
            color={animationConfig.color}
            factor={animationConfig.wobbleFactor}
            speed={animationConfig.wobbleSpeed}
            roughness={0.4}
            metalness={0.1}
          />
        </Sphere>

        {/* Cloud bumps */}
        <Sphere args={[0.35, 32, 32]} position={[-0.4, 0.1, 0.1]}>
          <MeshWobbleMaterial
            color={animationConfig.color}
            factor={animationConfig.wobbleFactor * 0.8}
            speed={animationConfig.wobbleSpeed}
            roughness={0.4}
            metalness={0.1}
          />
        </Sphere>
        <Sphere args={[0.3, 32, 32]} position={[0.4, 0.15, 0.1]}>
          <MeshWobbleMaterial
            color={animationConfig.color}
            factor={animationConfig.wobbleFactor * 0.8}
            speed={animationConfig.wobbleSpeed}
            roughness={0.4}
            metalness={0.1}
          />
        </Sphere>
        <Sphere args={[0.25, 32, 32]} position={[0, 0.35, 0.1]}>
          <MeshWobbleMaterial
            color={animationConfig.color}
            factor={animationConfig.wobbleFactor * 0.8}
            speed={animationConfig.wobbleSpeed}
            roughness={0.4}
            metalness={0.1}
          />
        </Sphere>

        {/* Eyes */}
        <Sphere ref={eyeLeftRef} args={[0.08, 16, 16]} position={[-0.15, 0.1, 0.45]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Sphere>
        <Sphere ref={eyeRightRef} args={[0.08, 16, 16]} position={[0.15, 0.1, 0.45]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Sphere>

        {/* Eye highlights */}
        <Sphere args={[0.025, 8, 8]} position={[-0.13, 0.13, 0.52]}>
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
        </Sphere>
        <Sphere args={[0.025, 8, 8]} position={[0.17, 0.13, 0.52]}>
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
        </Sphere>

        {/* Cheeks (blush) */}
        <Sphere args={[0.06, 16, 16]} position={[-0.28, -0.02, 0.4]}>
          <meshStandardMaterial color="#FFB6C1" transparent opacity={0.6} />
        </Sphere>
        <Sphere args={[0.06, 16, 16]} position={[0.28, -0.02, 0.4]}>
          <meshStandardMaterial color="#FFB6C1" transparent opacity={0.6} />
        </Sphere>

        {/* Smile */}
        <mesh position={[0, -0.1, 0.48]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.1, 0.02, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    </Float>
  );
}

interface WeatherMascotProps {
  condition?: string;
}

export function WeatherMascot({ condition }: WeatherMascotProps) {
  return (
    <div className="w-40 h-40 mx-auto">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, 5, -5]} intensity={0.4} color="#FFE4B5" />
        <CloudMascot condition={condition} />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
