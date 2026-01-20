import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeatherData } from '@/hooks/useWeather';

interface ShareButtonProps {
  data: WeatherData;
}

export function ShareButton({ data }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const tempUnit = data.units === 'metric' ? '°C' : '°F';
    const summary = `Weather in ${data.city}, ${data.country}:
🌡️ ${data.temperature}${tempUnit} (feels like ${data.feelsLike}${tempUnit})
💧 Humidity: ${data.humidity}%
🌬️ Air Quality: ${data.aqiLabel}
${data.description}`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard');
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={handleShare}
        variant="outline"
        size="sm"
        className="gap-2"
        aria-label="Copy weather summary to clipboard"
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check className="w-4 h-4 text-aqi-good" />
            </motion.span>
          ) : (
            <motion.span
              key="share"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Share2 className="w-4 h-4" />
            </motion.span>
          )}
        </AnimatePresence>
        {copied ? 'Copied!' : 'Share'}
      </Button>
    </motion.div>
  );
}
