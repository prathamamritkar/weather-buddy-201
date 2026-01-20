import { motion } from 'framer-motion';

interface UnitToggleProps {
  units: 'metric' | 'imperial';
  onToggle: () => void;
}

export function UnitToggle({ units, onToggle }: UnitToggleProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className="flex items-center gap-1 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-cartoon transition-colors hover:bg-card"
      aria-label={`Switch to ${units === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
    >
      <span
        className={`text-sm font-semibold transition-colors ${
          units === 'metric' ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        °C
      </span>
      <span className="text-muted-foreground">/</span>
      <span
        className={`text-sm font-semibold transition-colors ${
          units === 'imperial' ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        °F
      </span>
    </motion.button>
  );
}
