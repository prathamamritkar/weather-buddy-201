import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, X } from 'lucide-react';

interface SavedCitiesProps {
  favorites: string[];
  recentSearches: string[];
  onSelectCity: (city: string) => void;
  onRemoveRecent: (city: string) => void;
}

export function SavedCities({ favorites, recentSearches, onSelectCity, onRemoveRecent }: SavedCitiesProps) {
  const hasContent = favorites.length > 0 || recentSearches.length > 0;

  if (!hasContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-md mx-auto mt-6"
    >
      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Star className="w-4 h-4" />
            <span>Favorites</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {favorites.map((city) => (
                <motion.button
                  key={city}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectCity(city)}
                  className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors flex items-center gap-2"
                >
                  <Star className="w-3 h-3 fill-current" />
                  {city}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span>Recent</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {recentSearches
                .filter((city) => !favorites.some((f) => f.toLowerCase() === city.toLowerCase()))
                .map((city) => (
                  <motion.div
                    key={city}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onSelectCity(city)}
                      className="px-4 py-2 rounded-full bg-muted text-foreground font-medium text-sm hover:bg-muted/80 transition-colors"
                    >
                      {city}
                    </motion.button>
                    <button
                      onClick={() => onRemoveRecent(city)}
                      className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      aria-label={`Remove ${city} from recent`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}
