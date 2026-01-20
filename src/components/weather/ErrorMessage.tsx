import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-md mx-auto glass-card p-6 text-center"
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center"
      >
        <AlertCircle className="w-8 h-8 text-destructive" />
      </motion.div>
      
      <h3 className="text-lg font-semibold font-display text-foreground mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      
      {onRetry && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onRetry}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
