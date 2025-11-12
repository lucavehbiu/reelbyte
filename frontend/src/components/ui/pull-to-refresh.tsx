import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshIndicatorProps {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  threshold: number;
}

export function PullToRefreshIndicator({
  isPulling,
  isRefreshing,
  pullDistance,
  threshold,
}: PullToRefreshIndicatorProps) {
  const progress = Math.min(pullDistance / threshold, 1);
  const shouldTrigger = pullDistance >= threshold;

  return (
    <AnimatePresence>
      {(isPulling || isRefreshing) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
          style={{
            transform: `translateY(${Math.min(pullDistance, 100)}px)`,
          }}
        >
          <div className="mt-4 bg-white/90 backdrop-blur-md rounded-full p-3 shadow-lg border border-gray-200">
            {isRefreshing ? (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="h-6 w-6 text-primary" />
              </motion.div>
            ) : (
              <motion.div
                animate={{
                  rotate: shouldTrigger ? 180 : 0,
                  scale: shouldTrigger ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <ArrowDown
                  className={cn(
                    'h-6 w-6 transition-colors',
                    shouldTrigger ? 'text-primary' : 'text-gray-400'
                  )}
                  style={{
                    opacity: progress,
                  }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
