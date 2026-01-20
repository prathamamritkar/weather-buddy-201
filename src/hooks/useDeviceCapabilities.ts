import { useState, useEffect, useMemo } from 'react';

export type QualityLevel = 'low' | 'medium' | 'high';

interface DeviceCapabilities {
  qualityLevel: QualityLevel;
  prefersReducedMotion: boolean;
  supportsWebGL: boolean;
  isMobile: boolean;
  particleCount: number;
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [supportsWebGL, setSupportsWebGL] = useState(true);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setSupportsWebGL(!!gl);
    } catch {
      setSupportsWebGL(false);
    }

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      || window.innerWidth < 768;
  }, []);

  const qualityLevel = useMemo((): QualityLevel => {
    if (prefersReducedMotion) return 'low';
    if (isMobile) return 'medium';
    
    // Check for low-end device indicators
    const memory = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency;
    
    if (memory && memory < 4) return 'low';
    if (cores && cores < 4) return 'low';
    
    return 'high';
  }, [prefersReducedMotion, isMobile]);

  const particleCount = useMemo(() => {
    switch (qualityLevel) {
      case 'low': return 50;
      case 'medium': return 150;
      case 'high': return 300;
    }
  }, [qualityLevel]);

  return {
    qualityLevel,
    prefersReducedMotion,
    supportsWebGL,
    isMobile,
    particleCount,
  };
}
