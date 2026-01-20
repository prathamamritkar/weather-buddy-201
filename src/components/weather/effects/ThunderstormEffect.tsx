import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RainEffect } from './RainEffect';

interface ThunderstormEffectProps {
  count: number;
  intensity?: number;
}

function Lightning({ active }: { active: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!lightRef.current) return;
    lightRef.current.intensity = active ? 3 : 0;
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 8, 2]}
      color="#e0e0ff"
      intensity={0}
      distance={30}
      decay={2}
    />
  );
}

export function ThunderstormEffect({ count, intensity = 1 }: ThunderstormEffectProps) {
  const [lightningActive, setLightningActive] = useState(false);

  useEffect(() => {
    const triggerLightning = () => {
      setLightningActive(true);
      
      // Brief flash
      setTimeout(() => setLightningActive(false), 80);
      
      // Occasionally double flash
      if (Math.random() > 0.6) {
        setTimeout(() => {
          setLightningActive(true);
          setTimeout(() => setLightningActive(false), 50);
        }, 150);
      }
    };

    // Random lightning interval (3-8 seconds)
    const scheduleNext = () => {
      const delay = 3000 + Math.random() * 5000;
      return setTimeout(() => {
        triggerLightning();
        timerId = scheduleNext();
      }, delay);
    };

    let timerId = scheduleNext();

    return () => clearTimeout(timerId);
  }, []);

  return (
    <group>
      <RainEffect count={count} intensity={intensity * 1.3} windSpeed={5} />
      <Lightning active={lightningActive} />
      
      {/* Ambient darkening */}
      <ambientLight intensity={0.3} color="#4a4a6a" />
    </group>
  );
}
