import { useState, useCallback, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
  isSupported: boolean;
}

const STORAGE_KEY = 'weatherbuddy_geolocation_prompted';

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: false,
    isSupported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
  });

  const [hasPrompted, setHasPrompted] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  const getCurrentPosition = useCallback((): Promise<{ lat: number; lon: number } | null> => {
    return new Promise((resolve) => {
      if (!state.isSupported) {
        setState(prev => ({ ...prev, error: 'Geolocation is not supported' }));
        resolve(null);
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setState({
            latitude,
            longitude,
            error: null,
            isLoading: false,
            isSupported: true,
          });
          localStorage.setItem(STORAGE_KEY, 'true');
          setHasPrompted(true);
          resolve({ lat: latitude, lon: longitude });
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          setState(prev => ({
            ...prev,
            error: errorMessage,
            isLoading: false,
          }));
          localStorage.setItem(STORAGE_KEY, 'true');
          setHasPrompted(true);
          resolve(null);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes cache
        }
      );
    });
  }, [state.isSupported]);

  const markAsPrompted = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setHasPrompted(true);
  }, []);

  return {
    ...state,
    hasPrompted,
    getCurrentPosition,
    markAsPrompted,
  };
}
