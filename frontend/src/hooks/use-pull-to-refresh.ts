import { useEffect, useRef, useState } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true,
}: UsePullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    let scrollElement: HTMLElement | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      scrollElement = e.target as HTMLElement;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Only start pull if at the top of the page
      if (scrollTop === 0 && !isRefreshing) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const distance = currentY.current - startY.current;

      if (distance > 0) {
        // Apply resistance to make it feel more natural
        const resistedDistance = distance / resistance;
        setPullDistance(Math.min(resistedDistance, threshold * 1.5));

        // Prevent default scroll behavior when pulling down
        if (distance > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling || isRefreshing) return;

      setIsPulling(false);

      // Trigger refresh if pulled past threshold
      if (pullDistance >= threshold) {
        setIsRefreshing(true);

        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(20);
        }

        try {
          await onRefresh();
        } finally {
          // Small delay for better UX
          setTimeout(() => {
            setIsRefreshing(false);
            setPullDistance(0);
          }, 500);
        }
      } else {
        // Reset if not pulled enough
        setPullDistance(0);
      }
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, isPulling, isRefreshing, onRefresh, pullDistance, threshold, resistance]);

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    threshold,
  };
}
