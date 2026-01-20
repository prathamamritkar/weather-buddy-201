import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WeatherData {
  city: string;
  country: string;
  units: 'metric' | 'imperial';
  temperature: number;
  feelsLike: number;
  humidity: number;
  aqi: 1 | 2 | 3 | 4 | 5;
  aqiLabel: string;
  condition: string;
  description: string;
  icon: string;
  lat: number;
  lon: number;
  wind: { speed: number; deg: number };
  pressure: number;
  visibility: number;
  fetchedAt: string;
}

interface CacheEntry {
  data: WeatherData;
  timestamp: number;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const cache = new Map<string, CacheEntry>();

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (city: string, units: 'metric' | 'imperial' = 'metric', retryCount = 0) => {
    const cacheKey = `${city.toLowerCase()}_${units}`;
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data);
      setError(null);
      return cached.data;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: responseData, error: invokeError } = await supabase.functions.invoke('weather', {
        body: null,
        method: 'GET',
        headers: {},
      });

      // Actually we need to use query params, so let's use fetch directly
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/weather?city=${encodeURIComponent(city)}&units=${units}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch weather data');
      }

      const weatherData = result as WeatherData;
      
      // Update cache
      cache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
      
      setData(weatherData);
      setError(null);
      return weatherData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      
      // Retry logic (max 2 retries)
      if (retryCount < 2 && !errorMessage.includes('not found')) {
        console.log(`Retrying... attempt ${retryCount + 2}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return fetchWeather(city, units, retryCount + 1);
      }
      
      setError(errorMessage);
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { data, isLoading, error, fetchWeather, clearError };
}
