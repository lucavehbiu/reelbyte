import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Briefcase, MessageCircle, User } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  activePatterns: string[];
}

const navItems: NavItem[] = [
  {
    icon: Home,
    label: 'Home',
    path: '/',
    activePatterns: ['/'],
  },
  {
    icon: Search,
    label: 'Browse',
    path: '/browse',
    activePatterns: ['/browse', '/gigs'],
  },
  {
    icon: Briefcase,
    label: 'Projects',
    path: '/browse-projects',
    activePatterns: ['/browse-projects', '/projects'],
  },
  {
    icon: MessageCircle,
    label: 'Messages',
    path: '/messages',
    activePatterns: ['/messages', '/conversations'],
  },
  {
    icon: User,
    label: 'Profile',
    path: '/dashboard',
    activePatterns: ['/dashboard', '/profile', '/settings'],
  },
];

export function BottomNav() {
  const location = useLocation();
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // Track scroll direction
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      // Scrolling down
      setHidden(true);
    } else {
      // Scrolling up
      setHidden(false);
    }
  });

  const isActive = (patterns: string[]) => {
    return patterns.some((pattern) => {
      if (pattern === '/') {
        return location.pathname === '/';
      }
      return location.pathname.startsWith(pattern);
    });
  };

  // Haptic feedback function
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden"
      animate={{ y: hidden ? '100%' : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Bottom safe area for iOS */}
      <div className="pb-safe">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.activePatterns);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={triggerHaptic}
                className="flex flex-col items-center justify-center flex-1 h-full relative"
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-brand-navy rounded-b-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 transition-colors',
                    active ? 'text-brand-navy' : 'text-gray-500'
                  )}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Icon
                    className={cn('w-6 h-6', active && 'stroke-[2.5px]')}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span
                    className={cn(
                      'text-xs font-medium',
                      active ? 'font-semibold' : 'font-normal'
                    )}
                  >
                    {item.label}
                  </span>
                </motion.div>

                {/* Badge for notifications (optional - can be added later) */}
                {item.label === 'Messages' && (
                  <span className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
