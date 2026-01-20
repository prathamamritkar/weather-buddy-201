import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface WeatherMascotProps {
  condition?: string;
}

export function WeatherMascot({ condition = 'Clear' }: WeatherMascotProps) {
  // Animation and color based on weather condition
  const config = useMemo(() => {
    switch (condition) {
      case 'Clear':
        return { color: '#FFD93D', eyeColor: '#1a1a1a', blush: '#FFB6C1', animation: 'bounce' };
      case 'Clouds':
        return { color: '#A8D8EA', eyeColor: '#1a1a1a', blush: '#FFB6C1', animation: 'sway' };
      case 'Rain':
      case 'Drizzle':
        return { color: '#6EB5FF', eyeColor: '#1a1a1a', blush: '#B4D4FF', animation: 'rain' };
      case 'Thunderstorm':
        return { color: '#9B59B6', eyeColor: '#ffffff', blush: '#D4A5FF', animation: 'shake' };
      case 'Snow':
        return { color: '#E8F4F8', eyeColor: '#1a1a1a', blush: '#FFE4EC', animation: 'snow' };
      default:
        return { color: '#87CEEB', eyeColor: '#1a1a1a', blush: '#FFB6C1', animation: 'bounce' };
    }
  }, [condition]);

  const animationVariants = {
    bounce: {
      y: [0, -10, 0],
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
    sway: {
      rotate: [-3, 3, -3],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
    rain: {
      y: [0, 5, 0],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
    shake: {
      x: [-2, 2, -2, 2, 0],
      transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 },
    },
    snow: {
      rotate: [0, 5, -5, 0],
      scale: [1, 1.02, 1],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <div className="w-40 h-40 mx-auto flex items-center justify-center">
      <motion.div
        animate={animationVariants[config.animation as keyof typeof animationVariants]}
        className="relative"
      >
        {/* Main cloud body */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {/* Cloud shape using overlapping circles */}
          <svg width="140" height="100" viewBox="0 0 140 100">
            {/* Shadow */}
            <ellipse cx="70" cy="95" rx="50" ry="5" fill="rgba(0,0,0,0.1)" />
            
            {/* Main cloud body */}
            <circle cx="70" cy="55" r="35" fill={config.color} />
            <circle cx="40" cy="60" r="25" fill={config.color} />
            <circle cx="100" cy="60" r="25" fill={config.color} />
            <circle cx="55" cy="40" r="22" fill={config.color} />
            <circle cx="85" cy="40" r="22" fill={config.color} />
            <circle cx="70" cy="35" r="18" fill={config.color} />
            
            {/* Highlight */}
            <circle cx="50" cy="35" r="8" fill="rgba(255,255,255,0.4)" />
            
            {/* Eyes */}
            <motion.g
              animate={{ y: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <circle cx="55" cy="55" r="6" fill={config.eyeColor} />
              <circle cx="85" cy="55" r="6" fill={config.eyeColor} />
              {/* Eye highlights */}
              <circle cx="53" cy="53" r="2" fill="white" />
              <circle cx="83" cy="53" r="2" fill="white" />
            </motion.g>
            
            {/* Blush cheeks */}
            <circle cx="40" cy="62" r="5" fill={config.blush} opacity="0.6" />
            <circle cx="100" cy="62" r="5" fill={config.blush} opacity="0.6" />
            
            {/* Smile */}
            <path
              d="M 60 68 Q 70 78 80 68"
              stroke={config.eyeColor}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          
          {/* Weather-specific accessories */}
          {condition === 'Clear' && (
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <svg width="30" height="30" viewBox="0 0 30 30">
                <circle cx="15" cy="15" r="8" fill="#FFD700" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <line
                    key={i}
                    x1="15"
                    y1="15"
                    x2={15 + 12 * Math.cos((angle * Math.PI) / 180)}
                    y2={15 + 12 * Math.sin((angle * Math.PI) / 180)}
                    stroke="#FFD700"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ))}
              </svg>
            </motion.div>
          )}
          
          {(condition === 'Rain' || condition === 'Drizzle') && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-4 bg-blue-400 rounded-full"
                  animate={{ y: [0, 10, 0], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          )}
          
          {condition === 'Snow' && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full border border-blue-200"
                  animate={{ y: [0, 15], opacity: [1, 0], rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}
            </div>
          )}
          
          {condition === 'Thunderstorm' && (
            <motion.div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
            >
              <svg width="20" height="30" viewBox="0 0 20 30">
                <path d="M10 0 L15 12 L10 12 L12 30 L5 15 L10 15 Z" fill="#FFD700" />
              </svg>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
