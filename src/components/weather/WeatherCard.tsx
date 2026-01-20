import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  color: string;
  delay?: number;
}

export function WeatherCard({ title, value, unit, icon, color, delay = 0 }: WeatherCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      whileHover={{
        y: -8,
        rotateX: 5,
        rotateY: -5,
        transition: { duration: 0.2 },
      }}
      className="weather-card perspective-1000 preserve-3d cursor-default"
    >
      <div className="flex flex-col items-center text-center gap-4">
        <motion.div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color}`}
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className="text-4xl font-bold font-display text-foreground">
            {value}
            {unit && <span className="text-2xl ml-1 text-muted-foreground">{unit}</span>}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
