import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Users,
  Video,
  CheckCircle2,
  MessageCircle,
  Star,
  Briefcase,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjectDetails } from '@/hooks/use-projects';
import { formatCurrency, formatRelativeTime, getInitials } from '@/lib/utils';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, isError } = useProjectDetails(id);

  const [showProposalModal, setShowProposalModal] = useState(false);

  const handleSubmitProposal = () => {
    // Navigate to proposal submission page or show modal
    setShowProposalModal(true);
  };

  const handleContactClient = () => {
    if (!project) return;
    navigate(`/messages/${project.clientProfile.userId}`);
  };

  if (isLoading) {
    return <ProjectDetailsSkeleton />;
  }

  if (isError || !project) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="text-6xl">😕</div>
          <h2 className="text-3xl font-bold">Project Not Found</h2>
          <p className="text-muted-foreground">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/browse')}>
            Browse All Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Back Button */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    {project.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Posted {formatRelativeTime(new Date(project.createdAt))}
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {project.proposalCount} proposals
                    </div>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-brand-gold to-brand-copper text-white">
                  {project.status}
                </Badge>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="border-brand-gold/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <DollarSign className="h-4 w-4" />
                      Budget
                    </div>
                    <div className="font-bold text-lg">
                      {project.budgetType === 'fixed' ? (
                        formatCurrency(project.budgetMin)
                      ) : (
                        `${formatCurrency(project.budgetMin)} - ${formatCurrency(project.budgetMax)}`
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {project.budgetType === 'fixed' ? 'Fixed Price' : 'Range'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      Deadline
                    </div>
                    <div className="font-bold">
                      {project.deadlineDate ? new Date(project.deadlineDate).toLocaleDateString() : 'Flexible'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {project.estimatedDurationDays ? `~${project.estimatedDurationDays} days` : 'TBD'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Video className="h-4 w-4" />
                      Video Type
                    </div>
                    <div className="font-bold">
                      {project.videoType || 'Any'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {project.videoDurationPreference || 'Flexible'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Award className="h-4 w-4" />
                      Level
                    </div>
                    <div className="font-bold capitalize">
                      {project.experienceLevel || 'Any'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Experience
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap">{project.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Required Skills */}
            {project.requiredSkills && project.requiredSkills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.requiredSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Platform Preferences */}
            {project.platformPreference && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.platformPreference.map((platform, index) => (
                        <Badge key={index} className="bg-primary/10 text-primary">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Action Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <Card className="border-2 border-brand-gold/20">
                <CardHeader>
                  <CardTitle>Interested in this project?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-brand-gold to-brand-copper hover:from-brand-gold/90 hover:to-brand-copper/90"
                    onClick={handleSubmitProposal}
                  >
                    Submit Proposal
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleContactClient}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contact Client
                  </Button>

                  <Separator />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Proposals</span>
                      <span className="font-semibold">{project.proposalCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Views</span>
                      <span className="font-semibold">{project.viewCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant="secondary">{project.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Client Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>About the Client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-16 w-16 border-2 border-primary">
                      <AvatarImage
                        src={project.clientProfile.companyLogoUrl || undefined}
                        alt={project.clientProfile.companyName}
                      />
                      <AvatarFallback className="text-lg bg-gradient-to-br from-brand-gold to-brand-copper text-white">
                        {getInitials(project.clientProfile.companyName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {project.clientProfile.companyName}
                      </h3>
                      {project.clientProfile.industry && (
                        <p className="text-sm text-muted-foreground">
                          {project.clientProfile.industry}
                        </p>
                      )}
                      {project.clientProfile.isVerified && (
                        <div className="flex items-center gap-1 text-sm text-primary mt-1">
                          <CheckCircle2 className="h-4 w-4" />
                          Verified Client
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Jobs</span>
                      <span className="font-semibold">{project.clientProfile.totalJobsPosted}</span>
                    </div>
                    {project.clientProfile.averageRating > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">
                            {project.clientProfile.averageRating.toFixed(1)}
                          </span>
                          <span className="text-muted-foreground">
                            ({project.clientProfile.totalReviews})
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {project.clientProfile.description && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground line-clamp-4">
                          {project.clientProfile.description}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
