import { useState, useCallback } from 'react';

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
    if (!city.trim()) {
      setError('Please enter a city name');
      return null;
    }

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
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Configuration error. Please try again later.');
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/weather?city=${encodeURIComponent(city.trim())}&units=${units}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
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
      
      // Retry logic (max 2 retries) - don't retry for user errors
      if (retryCount < 2 && !errorMessage.includes('not found') && !errorMessage.includes('City parameter')) {
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
