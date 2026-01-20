import { motion } from 'framer-motion';

export function WeatherSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header skeleton */}
      <div className="text-center mb-8">
        <div className="h-10 w-48 mx-auto skeleton-shimmer rounded-lg mb-2" />
        <div className="h-6 w-32 mx-auto skeleton-shimmer rounded-lg" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="weather-card"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl skeleton-shimmer" />
              <div>
                <div className="h-4 w-20 mx-auto skeleton-shimmer rounded mb-2" />
                <div className="h-10 w-24 mx-auto skeleton-shimmer rounded" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AQI badge skeleton */}
      <div className="flex justify-center mb-6">
        <div className="h-10 w-32 skeleton-shimmer rounded-full" />
      </div>
    </motion.div>
  );
}
