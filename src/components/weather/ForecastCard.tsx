import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';
import { ForecastDay } from '@/hooks/useWeather';

interface ForecastCardProps {
  forecast: ForecastDay[];
  units: 'metric' | 'imperial';
}

const conditionIcons: Record<string, React.ReactNode> = {
  Clear: <Sun className="w-8 h-8 text-primary" />,
  Clouds: <Cloud className="w-8 h-8 text-muted-foreground" />,
  Rain: <CloudRain className="w-8 h-8 text-accent" />,
  Drizzle: <CloudRain className="w-8 h-8 text-accent/80" />,
  Thunderstorm: <CloudLightning className="w-8 h-8 text-primary" />,
  Snow: <CloudSnow className="w-8 h-8 text-accent" />,
  Mist: <CloudFog className="w-8 h-8 text-muted-foreground" />,
  Fog: <CloudFog className="w-8 h-8 text-muted-foreground" />,
  Haze: <CloudFog className="w-8 h-8 text-primary/70" />,
};

export function ForecastCard({ forecast, units }: ForecastCardProps) {
  const tempUnit = units === 'metric' ? '°C' : '°F';

  if (!forecast || forecast.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mt-8"
    >
      <h3 className="text-xl font-semibold font-display text-foreground text-center mb-4">
        5-Day Forecast
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {forecast.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
            className="weather-card p-4 text-center"
          >
            <p className="font-semibold text-foreground text-lg mb-1">
              {day.dayName}
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            
            <motion.div
              className="flex justify-center mb-3"
              animate={{ 
                y: [0, -3, 0],
                rotate: day.condition === 'Clear' ? [0, 5, -5, 0] : 0
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                repeatType: 'reverse' 
              }}
            >
              {conditionIcons[day.condition] || <Cloud className="w-8 h-8 text-muted-foreground" />}
            </motion.div>
            
            <div className="flex justify-center items-center gap-2">
              <span className="text-lg font-bold text-foreground">
                {day.tempMax}{tempUnit}
              </span>
              <span className="text-sm text-muted-foreground">
                {day.tempMin}{tempUnit}
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground capitalize mt-2 truncate">
              {day.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
