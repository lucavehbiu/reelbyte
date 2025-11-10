import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  MapPin,
  Globe,
  Building2,
  Users,
  Star,
  CheckCircle2,
  Briefcase,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useClientProfile } from '@/hooks/use-clients';
import { formatCurrency, formatRelativeTime, getInitials } from '@/lib/utils';

export default function ClientProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: client, isLoading, isError } = useClientProfile(id);

  if (isLoading) {
    return <ClientProfileSkeleton />;
  }

  if (isError || !client) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="text-6xl">😕</div>
          <h2 className="text-3xl font-bold">Client Not Found</h2>
          <p className="text-muted-foreground">
            The client profile you're looking for doesn't exist or has been removed.
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Company Logo */}
                  <Avatar className="h-24 w-24 border-4 border-background">
                    {client.companyLogoUrl ? (
                      <AvatarImage src={client.companyLogoUrl} alt={client.companyName} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-brand-gold to-brand-copper text-white text-2xl">
                        {getInitials(client.companyName)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* Company Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h1 className="text-3xl font-bold">{client.companyName}</h1>
                          {client.isVerified && (
                            <Badge className="gap-1 bg-brand-gold/20 text-brand-gold border-brand-gold/30">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        {client.industry && (
                          <p className="text-lg text-muted-foreground">{client.industry}</p>
                        )}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {client.averageRating && parseFloat(client.averageRating) > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">
                            {parseFloat(client.averageRating).toFixed(1)}
                          </span>
                          <span className="text-muted-foreground">
                            ({client.totalReviews} reviews)
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        <span>{client.totalJobsPosted} jobs posted</span>
                      </div>
                      {client.companySize && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{client.companySize} employees</span>
                        </div>
                      )}
                    </div>

                    {/* Website Link */}
                    {client.websiteUrl && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={client.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {client.websiteUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      {client.totalJobsPosted}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Jobs Posted
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      ${parseFloat(client.totalSpent).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Spent
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold flex items-center gap-1">
                      {parseFloat(client.averageRating).toFixed(1)}
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Average Rating
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* About Section */}
          {client.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>About {client.companyName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {client.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Member Since */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">
                  Member since {formatRelativeTime(new Date(client.createdAt))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ClientProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
