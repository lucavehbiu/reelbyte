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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      className={cn('group', className)}
    >
      <Link to={`/gigs/${gig.id}`}>
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300">
          {/* Thumbnail Section */}
          <div className="relative aspect-video overflow-hidden bg-muted">
            <motion.img
              src={gig.thumbnail}
              alt={gig.title}
              className={cn(
                'h-full w-full object-cover transition-all duration-300 group-hover:scale-110',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-primary/20 to-purple-500/20" />
            )}

            {/* Video Play Overlay */}
            {gig.videos.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/40"
                >
                  <Play className="h-8 w-8 text-white fill-white ml-1" />
                </motion.div>
              </motion.div>
            )}

            {/* Like Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/20 transition-colors hover:bg-black/50"
            >
              <Heart
                className={cn(
                  'h-5 w-5 transition-all',
                  isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                )}
              />
            </motion.button>

            {/* Category Badge */}
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-primary/90 backdrop-blur-sm border-white/20">
                {gig.category}
              </Badge>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 space-y-3">
            {/* Creator Info */}
            <Link
              to={`/creators/${gig.creatorId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 group/creator"
            >
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarImage src={gig.creator.avatar} alt={gig.creator.username} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-purple-600 text-white">
                  {getInitials(gig.creator.username)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover/creator:text-primary transition-colors">
                  {gig.creator.username}
                </p>
                {gig.creator.level !== 'new' && (
                  <p className="text-xs text-muted-foreground capitalize">
                    {gig.creator.level.replace(/(\d)/, ' $1')}
                  </p>
                )}
              </div>
            </Link>

            {/* Title */}
            <h3 className="font-semibold text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {gig.title}
            </h3>

            {/* Rating & Stats */}
            <div className="flex items-center gap-3 text-sm">
              {gig.reviewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{gig.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({gig.reviewCount})</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-sm text-muted-foreground">Starting at</span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
              >
                {formatCurrency(minPrice)}
              </motion.span>
            </div>
          </div>

          {/* Gradient Border Effect */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/50 via-purple-500/50 to-pink-500/50 blur-xl -z-10" />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export function GigCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 bg-card/50">
      <div className="aspect-video bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-3 w-16 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          <div className="h-6 w-16 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </Card>
  );
}
