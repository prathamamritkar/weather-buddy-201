import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, Heart } from 'lucide-react';
import { WeatherData } from '@/hooks/useWeather';
import { WeatherCard } from './WeatherCard';
import { AqiBadge } from './AqiBadge';
import { Button } from '@/components/ui/button';

interface WeatherResultsProps {
  data: WeatherData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function WeatherResults({ data, isFavorite, onToggleFavorite }: WeatherResultsProps) {
  const tempUnit = data.units === 'metric' ? '°C' : '°F';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header with city name and favorite */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
            {data.city}
            {data.country && (
              <span className="text-muted-foreground font-normal">, {data.country}</span>
            )}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleFavorite}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'
              }`}
            />
          </motion.button>
        </div>
        <p className="text-lg text-muted-foreground capitalize">{data.description}</p>
      </motion.div>

      {/* Main weather cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <WeatherCard
          title="Temperature"
          value={data.temperature}
          unit={tempUnit}
          icon={<Thermometer className="w-8 h-8 text-primary" />}
          color="bg-primary/10"
          delay={0.2}
        />
        <WeatherCard
          title="Humidity"
          value={data.humidity}
          unit="%"
          icon={<Droplets className="w-8 h-8 text-accent" />}
          color="bg-accent/10"
          delay={0.3}
        />
        <WeatherCard
          title="Air Quality"
          value={data.aqi}
          icon={<Wind className="w-8 h-8 text-aqi-good" />}
          color="bg-green-100"
          delay={0.4}
        />
      </div>

      {/* AQI Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center mb-6"
      >
        <AqiBadge aqi={data.aqi} label={data.aqiLabel} />
      </motion.div>

      {/* Additional details (collapsible) */}
      <motion.details
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-4 max-w-lg mx-auto"
      >
        <summary className="cursor-pointer font-semibold text-foreground hover:text-primary transition-colors">
          More Details
        </summary>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Feels Like:</span>
            <span className="ml-2 font-medium">{data.feelsLike}{tempUnit}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Wind:</span>
            <span className="ml-2 font-medium">{data.wind.speed} {data.units === 'metric' ? 'm/s' : 'mph'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Pressure:</span>
            <span className="ml-2 font-medium">{data.pressure} hPa</span>
          </div>
          <div>
            <span className="text-muted-foreground">Visibility:</span>
            <span className="ml-2 font-medium">{(data.visibility / 1000).toFixed(1)} km</span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">Coordinates:</span>
            <span className="ml-2 font-medium">{data.lat.toFixed(2)}, {data.lon.toFixed(2)}</span>
          </div>
        </div>
      </motion.details>
    </motion.div>
  );
}
