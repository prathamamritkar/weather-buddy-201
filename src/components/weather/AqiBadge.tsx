import { motion } from 'framer-motion';

interface AqiBadgeProps {
  aqi: 1 | 2 | 3 | 4 | 5;
  label: string;
}

const aqiStyles: Record<number, string> = {
  1: 'aqi-badge-good',
  2: 'aqi-badge-fair',
  3: 'aqi-badge-moderate',
  4: 'aqi-badge-poor',
  5: 'aqi-badge-very-poor',
};

export function AqiBadge({ aqi, label }: AqiBadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${aqiStyles[aqi]}`}
    >
      <span className="w-2 h-2 rounded-full bg-current opacity-70" />
      {label}
    </motion.span>
  );
}
