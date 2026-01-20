import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun } from 'lucide-react';
import { SearchBar } from '@/components/weather/SearchBar';
import { WeatherResults } from '@/components/weather/WeatherResults';
import { WeatherMascot } from '@/components/weather/WeatherMascot';
import { WeatherSkeleton } from '@/components/weather/WeatherSkeleton';
import { ErrorMessage } from '@/components/weather/ErrorMessage';
import { SavedCities } from '@/components/weather/SavedCities';
import { UnitToggle } from '@/components/weather/UnitToggle';
import { ShareButton } from '@/components/weather/ShareButton';
import { useWeather } from '@/hooks/useWeather';
import { useFavorites } from '@/hooks/useFavorites';

// Map weather conditions to theme classes
const conditionToTheme: Record<string, string> = {
  Clear: 'weather-clear',
  Clouds: 'weather-clouds',
  Rain: 'weather-rain',
  Drizzle: 'weather-drizzle',
  Thunderstorm: 'weather-thunderstorm',
  Snow: 'weather-snow',
  Mist: 'weather-mist',
  Fog: 'weather-fog',
  Haze: 'weather-haze',
};

const Index = () => {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [lastSearchedCity, setLastSearchedCity] = useState<string>('');
  const { data, isLoading, error, fetchWeather, clearError } = useWeather();
  const { favorites, recentSearches, addToRecent, toggleFavorite, isFavorite, removeFromRecent } = useFavorites();

  // Apply weather theme to body
  useEffect(() => {
    const themeClass = data?.condition ? conditionToTheme[data.condition] : '';
    
    // Remove all weather theme classes
    Object.values(conditionToTheme).forEach((cls) => {
      document.body.classList.remove(cls);
    });
    
    // Add current weather theme
    if (themeClass) {
      document.body.classList.add(themeClass);
    }

    return () => {
      Object.values(conditionToTheme).forEach((cls) => {
        document.body.classList.remove(cls);
      });
    };
  }, [data?.condition]);

  const handleSearch = useCallback(async (city: string) => {
    setLastSearchedCity(city);
    const result = await fetchWeather(city, units);
    if (result) {
      addToRecent(result.city);
    }
  }, [fetchWeather, units, addToRecent]);

  const handleUnitToggle = useCallback(() => {
    const newUnits = units === 'metric' ? 'imperial' : 'metric';
    setUnits(newUnits);
    if (data?.city) {
      fetchWeather(data.city, newUnits);
    }
  }, [units, data?.city, fetchWeather]);

  const handleSelectCity = useCallback((city: string) => {
    handleSearch(city);
  }, [handleSearch]);

  const handleToggleFavorite = useCallback(() => {
    if (data?.city) {
      toggleFavorite(data.city);
    }
  }, [data?.city, toggleFavorite]);

  const handleRetry = useCallback(() => {
    clearError();
    if (lastSearchedCity) {
      handleSearch(lastSearchedCity);
    }
  }, [clearError, lastSearchedCity, handleSearch]);

  return (
    <div className="min-h-screen py-8 px-4 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            >
              <Cloud className="w-10 h-10 text-primary" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground">
              Weather<span className="text-primary">Buddy</span>
            </h1>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sun className="w-10 h-10 text-primary" />
            </motion.div>
          </div>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Get instant weather updates for any city around the world
          </p>
          
          {/* Unit toggle in header */}
          <div className="flex justify-center mt-4">
            <UnitToggle units={units} onToggle={handleUnitToggle} />
          </div>
        </motion.header>

        {/* 3D Mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <WeatherMascot condition={data?.condition} />
        </motion.div>

        {/* Search */}
        <section className="mb-8" aria-label="Search for a city">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          <SavedCities
            favorites={favorites}
            recentSearches={recentSearches}
            onSelectCity={handleSelectCity}
            onRemoveRecent={removeFromRecent}
          />
        </section>

        {/* Results area */}
        <main aria-live="polite">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <WeatherSkeleton />
              </motion.div>
            )}

            {error && !isLoading && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ErrorMessage message={error} onRetry={handleRetry} />
              </motion.div>
            )}

            {data && !isLoading && !error && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex justify-center mb-6">
                  <ShareButton data={data} />
                </div>
                <WeatherResults
                  data={data}
                  isFavorite={isFavorite(data.city)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center text-sm text-muted-foreground"
        >
          <p>
            Data provided by OpenWeather • Built with ❤️
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
