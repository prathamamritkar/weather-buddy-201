import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { RainEffect } from './RainEffect';
import { SnowEffect } from './SnowEffect';
import { CloudsEffect } from './CloudsEffect';
import { ThunderstormEffect } from './ThunderstormEffect';
import { ClearSkyEffect } from './ClearSkyEffect';
import { FogEffect } from './FogEffect';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

interface WeatherSceneProps {
  condition?: string;
  icon?: string;
  windSpeed?: number;
}

function WeatherEffects({ 
  condition, 
  icon, 
  windSpeed, 
  particleCount 
}: WeatherSceneProps & { particleCount: number }) {
  const isNight = icon?.includes('n') ?? false;
  
  const effectContent = useMemo(() => {
    switch (condition) {
      case 'Rain':
        return <RainEffect count={particleCount} intensity={1} windSpeed={windSpeed} />;
      case 'Drizzle':
        return <RainEffect count={Math.floor(particleCount * 0.5)} intensity={0.6} windSpeed={windSpeed} />;
      case 'Thunderstorm':
        return <ThunderstormEffect count={particleCount} intensity={1} />;
      case 'Snow':
        return <SnowEffect count={particleCount} intensity={1} />;
      case 'Clouds':
        return <CloudsEffect count={Math.floor(particleCount * 0.05)} intensity={1} />;
      case 'Mist':
      case 'Fog':
      case 'Haze':
        return <FogEffect intensity={0.8} />;
      case 'Clear':
      default:
        return <ClearSkyEffect isNight={isNight} intensity={1} />;
    }
  }, [condition, icon, particleCount, windSpeed, isNight]);

  return effectContent;
}

export function WeatherScene({ condition, icon, windSpeed }: WeatherSceneProps) {
  const { prefersReducedMotion, supportsWebGL, particleCount, qualityLevel } = useDeviceCapabilities();

  // Fallback for reduced motion or no WebGL
  if (prefersReducedMotion || !supportsWebGL) {
    return null; // CSS gradient fallback will show through
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: qualityLevel === 'low' ? 0.6 : 0.85 }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={qualityLevel === 'high' ? [1, 2] : [1, 1]}
        gl={{ 
          antialias: qualityLevel === 'high',
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <WeatherEffects 
            condition={condition} 
            icon={icon} 
            windSpeed={windSpeed} 
            particleCount={particleCount}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
