import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, Clock, Star, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, getInitials } from '@/lib/utils';
import type { ProjectWithClient } from '@/lib/api/projects';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: ProjectWithClient;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const budgetDisplay = project.budgetType === 'fixed'
    ? formatCurrency(project.budgetFixed!)
    : `${formatCurrency(project.budgetMin)} - ${formatCurrency(project.budgetMax!)}`;

  const isVerified = project.client.isVerified;
  const deadlineText = project.deadlineDate
    ? formatDistanceToNow(new Date(project.deadlineDate), { addSuffix: true })
    : 'No deadline';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      className={cn('group', className)}
    >
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 h-full flex flex-col">
        {/* Header Section */}
        <div className="p-4 border-b border-border/50 bg-gradient-to-br from-brand-gold/5 to-brand-navy/5">
          {/* Client Info */}
          <Link
            to={`/clients/${project.client.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-3 group/client mb-3"
          >
            <Avatar className="h-10 w-10 border-2 border-brand-gold/30">
              <AvatarImage src={project.client.websiteUrl || undefined} alt={project.client.companyName} />
              <AvatarFallback className="text-sm bg-gradient-to-br from-brand-gold to-brand-copper text-white">
                {getInitials(project.client.companyName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold truncate group-hover/client:text-brand-gold transition-colors">
                  {project.client.companyName}
                </p>
                {isVerified && (
                  <Star className="h-4 w-4 fill-brand-gold text-brand-gold flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {project.client.industry}
              </p>
            </div>
          </Link>

          {/* Category & Video Type Badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-brand-navy/90 backdrop-blur-sm border-white/20 text-xs">
              {project.category}
            </Badge>
            {project.videoType && (
              <Badge variant="outline" className="border-brand-gold/30 text-brand-gold text-xs">
                {project.videoType}
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          {/* Title */}
          <Link to={`/projects/${project.id}`}>
            <h3 className="font-semibold text-base line-clamp-2 leading-tight group-hover:text-brand-gold transition-colors">
              {project.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {project.description}
          </p>

          {/* Project Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Budget */}
            <div className="flex items-center gap-1.5 text-brand-gold">
              <DollarSign className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="font-semibold truncate">{budgetDisplay}</span>
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{deadlineText}</span>
            </div>

            {/* Experience Level */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate capitalize">{project.experienceLevel}</span>
            </div>

            {/* Proposals */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{project.proposalCount} proposals</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-border/50 mt-auto">
            <Link to={`/projects/${project.id}`} className="block">
              <Button className="w-full btn-gold group-hover:shadow-gold-glow transition-all">
                View & Apply
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Badge - Top Right */}
        {project.status !== 'open' && (
          <div className="absolute top-4 right-4">
            <Badge
              variant={project.status === 'in_progress' ? 'default' : 'secondary'}
              className="capitalize"
            >
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
        )}

        {/* Gradient Border Effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-gold/50 via-brand-copper/50 to-brand-navy/50 blur-xl -z-10" />
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
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-card/50 to-card/30 h-full">
      <div className="p-4 border-b border-border/50 space-y-3 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-3 w-24 bg-muted rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-muted rounded" />
          <div className="h-5 w-24 bg-muted rounded" />
        </div>
      </div>
      <div className="p-4 space-y-3 animate-pulse">
        <div className="h-5 w-full bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
        </div>
        <div className="h-10 w-full bg-muted rounded mt-4" />
      </div>
    </Card>
  );
}
