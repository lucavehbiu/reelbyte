import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, Clock, Star, Briefcase, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, getInitials } from '@/lib/utils';
import type { ProjectWithClient } from '@/lib/api/projects';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface ProjectCardProps {
  project: ProjectWithClient;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const budgetDisplay = project.budgetType === 'fixed'
    ? formatCurrency(project.budgetFixed!)
    : `${formatCurrency(project.budgetMin)} - ${formatCurrency(project.budgetMax!)}`;

  const isVerified = project.client.isVerified;
  const deadlineText = project.deadlineDate
    ? formatDistanceToNow(new Date(project.deadlineDate), { addSuffix: true })
    : 'Flexible';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -12, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn('group relative', className)}
    >
      {/* Magical Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold via-brand-copper to-brand-navy rounded-2xl opacity-0 group-hover:opacity-75 blur-lg transition-all duration-500 group-hover:duration-300" />

      <Card className="relative overflow-hidden border-0 rounded-2xl bg-white shadow-xl transition-all duration-300 group-hover:shadow-2xl h-full flex flex-col">
        {/* Header Section with Enhanced Gradient */}
        <div className="p-5 border-b-2 border-brand-cream bg-gradient-to-br from-brand-gold/10 via-brand-copper/5 to-brand-navy/10 relative overflow-hidden">
          {/* Sparkle Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            className="absolute top-2 right-2"
          >
            <Sparkles className="h-5 w-5 text-brand-gold animate-pulse" />
          </motion.div>

          {/* Client Info with Enhanced Styling */}
          <Link
            to={`/clients/${project.client.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-3 group/client mb-4"
          >
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-brand-gold/40 transition-all group-hover/client:border-brand-gold group-hover/client:scale-110 shadow-lg">
                <AvatarImage src={project.client.websiteUrl || undefined} alt={project.client.companyName} />
                <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-brand-gold via-brand-copper to-brand-navy text-white">
                  {getInitials(project.client.companyName)}
                </AvatarFallback>
              </Avatar>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white flex items-center justify-center shadow-md">
                  <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold truncate text-brand-charcoal group-hover/client:text-brand-navy transition-colors">
                {project.client.companyName}
              </p>
              <p className="text-xs text-brand-charcoal/60 font-medium">
                {project.client.industry}
              </p>
            </div>
          </Link>

          {/* Category & Video Type Badges */}
          <div className="flex gap-2 flex-wrap">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Badge className="bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white backdrop-blur-md shadow-md border border-white/20 px-3 py-1 font-semibold">
                {project.category}
              </Badge>
            </motion.div>
            {project.videoType && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge className="bg-white border-2 border-brand-gold/40 text-brand-navy font-semibold px-3 py-1">
                  {project.videoType}
                </Badge>
              </motion.div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4 flex-1 flex flex-col bg-white">
          {/* Title with Gradient Hover */}
          <Link to={`/projects/${project.id}`}>
            <h3 className="font-bold text-lg line-clamp-2 leading-tight text-brand-charcoal group-hover:bg-gradient-to-r group-hover:from-brand-navy group-hover:to-brand-gold group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              {project.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-sm text-brand-charcoal/70 line-clamp-3 flex-1 leading-relaxed">
            {project.description}
          </p>

          {/* Project Stats - Enhanced Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Budget - Highlighted */}
            <div className="col-span-2 flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-2.5 rounded-xl border border-brand-gold/20">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-brand-gold to-brand-copper shadow-sm">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-brand-charcoal/60 font-medium">Budget</p>
                <p className="font-black text-base bg-gradient-to-r from-brand-gold to-brand-copper bg-clip-text text-transparent truncate">
                  {budgetDisplay}
                </p>
              </div>
            </div>

            {/* Deadline */}
            <div className="flex items-start gap-2 bg-brand-cream/50 px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-brand-navy mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-brand-charcoal/60 font-medium">Deadline</p>
                <p className="text-xs font-semibold text-brand-charcoal truncate">{deadlineText}</p>
              </div>
            </div>

            {/* Experience Level */}
            <div className="flex items-start gap-2 bg-brand-cream/50 px-3 py-2 rounded-lg">
              <Briefcase className="h-4 w-4 text-brand-navy mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-brand-charcoal/60 font-medium">Level</p>
                <p className="text-xs font-semibold text-brand-charcoal truncate capitalize">{project.experienceLevel}</p>
              </div>
            </div>

            {/* Proposals Count */}
            <div className="col-span-2 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-navy/5 to-brand-navy/10 px-3 py-2 rounded-lg border border-brand-navy/10">
              <Users className="h-4 w-4 text-brand-navy" />
              <span className="text-sm font-bold text-brand-navy">
                {project.proposalCount} {project.proposalCount === 1 ? 'proposal' : 'proposals'}
              </span>
            </div>
          </div>

          {/* Action Button - Enhanced */}
          <div className="pt-4 mt-auto">
            <Link to={`/projects/${project.id}`} className="block">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button className="w-full bg-gradient-to-r from-brand-gold via-brand-copper to-brand-navy text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 h-11">
                  View & Apply
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Status Badge - Top Right */}
        {project.status !== 'open' && (
          <div className="absolute top-4 right-4">
            <Badge
              className={cn(
                'capitalize font-semibold shadow-lg',
                project.status === 'in_progress' && 'bg-blue-500 text-white',
                project.status === 'completed' && 'bg-green-500 text-white',
                project.status === 'cancelled' && 'bg-red-500 text-white'
              )}
            >
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
        )}

        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
        </div>
      </Card>
    </motion.div>
  );
}

/**
 * Skeleton loader for ProjectCard
 */
export function ProjectCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 bg-white shadow-lg rounded-2xl h-full">
      <div className="p-5 border-b-2 border-brand-cream bg-gradient-to-br from-brand-gold/10 via-brand-copper/5 to-brand-navy/10 space-y-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-brand-cream" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-brand-cream rounded" />
            <div className="h-3 w-24 bg-brand-cream/70 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-24 bg-brand-cream rounded-full" />
          <div className="h-6 w-28 bg-brand-cream/70 rounded-full" />
        </div>
      </div>
      <div className="p-5 space-y-4 animate-pulse">
        <div className="h-6 w-full bg-brand-cream rounded" />
        <div className="h-4 w-full bg-brand-cream/70 rounded" />
        <div className="h-4 w-3/4 bg-brand-cream/50 rounded" />
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="col-span-2 h-16 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl" />
          <div className="h-12 bg-brand-cream/50 rounded-lg" />
          <div className="h-12 bg-brand-cream/50 rounded-lg" />
          <div className="col-span-2 h-10 bg-brand-cream/30 rounded-lg" />
        </div>
        <div className="h-11 w-full bg-gradient-to-r from-brand-cream to-brand-beige rounded-lg mt-4" />
      </div>
    </Card>
  );
}
