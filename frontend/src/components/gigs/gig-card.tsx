import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Play, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency, getInitials } from '@/lib/utils';
import type { GigWithCreator } from '@/lib/api/gigs';
import { useState } from 'react';

interface GigCardProps {
  gig: GigWithCreator;
  className?: string;
}

export function GigCard({ gig, className }: GigCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const minPrice = Math.min(...gig.packages.map((p) => p.price));

  // Haptic feedback for mobile interactions
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -12, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn('group relative', className)}
    >
      <Link to={`/gigs/${gig.id}`} onClick={triggerHaptic} className="touch-manipulation block">
        {/* Magical Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold via-brand-copper to-brand-navy rounded-2xl opacity-0 group-hover:opacity-75 blur-lg transition-all duration-500 group-hover:duration-300" />

        <Card className="relative overflow-hidden border-0 rounded-2xl bg-white shadow-xl transition-all duration-300 group-hover:shadow-2xl">
          {/* Thumbnail Section with Enhanced Effects */}
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-brand-cream to-brand-beige">
            <motion.img
              src={gig.thumbnail}
              alt={gig.title}
              className={cn(
                'h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-brand-gold/20 via-brand-copper/20 to-brand-navy/20" />
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Video Play Overlay */}
            {gig.videos.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300"
                onClick={triggerHaptic}
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-gold to-brand-copper shadow-2xl border-2 border-white/30 touch-manipulation"
                  role="button"
                  aria-label="Play video preview"
                >
                  <Play className="h-10 w-10 text-white fill-white ml-1 drop-shadow-lg" />
                </motion.div>
              </motion.div>
            )}

            {/* Like Button with Enhanced Style */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
                triggerHaptic();
              }}
              className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-xl shadow-lg transition-all hover:shadow-xl touch-manipulation"
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart
                className={cn(
                  'h-5 w-5 transition-all duration-300',
                  isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-brand-charcoal'
                )}
              />
            </motion.button>

            {/* Category Badge - Enhanced */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="absolute bottom-4 left-4"
            >
              <Badge className="bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white backdrop-blur-md shadow-lg border border-white/20 px-3 py-1.5 font-medium">
                {gig.category}
              </Badge>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="p-5 space-y-4 bg-white">
            {/* Creator Info with Enhanced Hover */}
            <Link
              to={`/creators/${gig.creatorId}`}
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic();
              }}
              className="flex items-center gap-3 group/creator touch-manipulation"
            >
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-brand-gold/30 transition-all group-hover/creator:border-brand-gold group-hover/creator:scale-110">
                  <AvatarImage src={gig.creator.avatar} alt={gig.creator.username} />
                  <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-brand-gold via-brand-copper to-brand-navy text-white">
                    {getInitials(gig.creator.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-brand-charcoal group-hover/creator:text-brand-navy transition-colors">
                  {gig.creator.username}
                </p>
                {gig.creator.level !== 'new' && (
                  <p className="text-xs text-brand-charcoal/60 capitalize">
                    {gig.creator.level.replace(/(\d)/, ' $1')}
                  </p>
                )}
              </div>
            </Link>

            {/* Title with Gradient Hover */}
            <h3 className="font-bold text-lg line-clamp-2 leading-tight text-brand-charcoal group-hover:bg-gradient-to-r group-hover:from-brand-navy group-hover:to-brand-gold group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              {gig.title}
            </h3>

            {/* Rating & Stats */}
            {gig.reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-sm text-brand-charcoal">{gig.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-brand-charcoal/60">({gig.reviewCount} reviews)</span>
              </div>
            )}

            {/* Price Section - Enhanced */}
            <div className="flex items-center justify-between pt-3 border-t-2 border-brand-cream">
              <span className="text-sm font-medium text-brand-charcoal/70">Starting at</span>
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="text-2xl font-black bg-gradient-to-r from-brand-gold via-brand-copper to-brand-navy bg-clip-text text-transparent"
                >
                  {formatCurrency(minPrice)}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Shimmer Effect on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export function GigCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 bg-white shadow-lg rounded-2xl">
      <div className="aspect-video bg-gradient-to-br from-brand-cream to-brand-beige animate-pulse" />
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-brand-cream animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-28 bg-brand-cream animate-pulse rounded" />
            <div className="h-3 w-20 bg-brand-cream/70 animate-pulse rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-5 w-full bg-brand-cream animate-pulse rounded" />
          <div className="h-5 w-3/4 bg-brand-cream/70 animate-pulse rounded" />
        </div>
        <div className="h-6 w-24 bg-brand-cream animate-pulse rounded-full" />
        <div className="flex items-center justify-between pt-3 border-t-2 border-brand-cream">
          <div className="h-4 w-20 bg-brand-cream animate-pulse rounded" />
          <div className="h-7 w-20 bg-gradient-to-r from-brand-cream to-brand-beige animate-pulse rounded" />
        </div>
      </div>
    </Card>
  );
}
