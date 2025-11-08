import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Clock,
  RefreshCw,
  Heart,
  Share2,
  ChevronLeft,
  MapPin,
  MessageCircle,
  Award,
  CheckCircle2,
  Play,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { PackageSelector, PackageComparison } from '@/components/gigs/package-selector';
import { useGigDetails } from '@/hooks/use-gigs';
import { formatCurrency, formatRelativeTime, getInitials } from '@/lib/utils';
import { createOrder } from '@/lib/api/gigs';

export default function GigDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: gig, isLoading, isError } = useGigDetails(id);

  const [isLiked, setIsLiked] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'standard' | 'premium' | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleSelectPackage = (packageType: 'basic' | 'standard' | 'premium') => {
    setSelectedPackage(packageType);
  };

  const handleOrderNow = async () => {
    if (!selectedPackage || !gig) return;

    try {
      // In a real app, you'd show a modal to collect requirements
      const requirements = prompt('Please describe your requirements:');
      if (!requirements) return;

      const { orderId } = await createOrder(gig.id, selectedPackage, requirements);
      navigate(`/orders/${orderId}`);
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const handleContactSeller = () => {
    if (!gig) return;
    navigate(`/messages/${gig.creatorId}`);
  };

  if (isLoading) {
    return <GigDetailsSkeleton />;
  }

  if (isError || !gig) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="text-6xl">😕</div>
          <h2 className="text-3xl font-bold">Gig Not Found</h2>
          <p className="text-muted-foreground">
            The gig you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/gigs')}>
            Browse All Gigs
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
                    {gig.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <Badge className="bg-primary/90">{gig.category}</Badge>
                    {gig.reviewCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{gig.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">
                          ({gig.reviewCount} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isLiked ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Media Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
                <div className="relative aspect-video bg-muted group">
                  <img
                    src={gig.thumbnail}
                    alt={gig.title}
                    className="h-full w-full object-cover"
                  />
                  {gig.videos.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCurrentVideoIndex(0);
                        setShowVideoModal(true);
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40">
                        <Play className="h-10 w-10 text-white fill-white ml-2" />
                      </div>
                    </motion.button>
                  )}
                </div>

                {/* Video Thumbnails */}
                {gig.videos.length > 0 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {gig.videos.map((video, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentVideoIndex(index);
                          setShowVideoModal(true);
                        }}
                        className="relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors"
                      >
                        <img
                          src={gig.thumbnail}
                          alt={`Video ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="h-6 w-6 text-white fill-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>About This Gig</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap">{gig.description}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Package Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Compare Packages</CardTitle>
                </CardHeader>
                <CardContent>
                  <PackageComparison packages={gig.packages} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>
                    Reviews ({gig.reviewCount})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {gig.reviews.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No reviews yet. Be the first to order!</p>
                    </div>
                  ) : (
                    gig.reviews.map((review) => (
                      <div key={review.id} className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                                {getInitials(review.clientId)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{review.clientId}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {formatRelativeTime(review.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                        <Separator />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Creator Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <Card className="border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>About the Creator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link
                    to={`/creators/${gig.creator.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarImage src={gig.creator.avatar} alt={gig.creator.username} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-lg">
                        {getInitials(gig.creator.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {gig.creator.username}
                      </h3>
                      {gig.creator.tagline && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {gig.creator.tagline}
                        </p>
                      )}
                    </div>
                  </Link>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Star className="h-4 w-4" />
                        <span>Rating</span>
                      </div>
                      <p className="font-semibold">
                        {gig.creator.rating.toFixed(1)} ({gig.creator.reviewCount})
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Completed</span>
                      </div>
                      <p className="font-semibold">{gig.creator.completedProjects}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Response</span>
                      </div>
                      <p className="font-semibold">{gig.creator.responseTime}h</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Award className="h-4 w-4" />
                        <span>Level</span>
                      </div>
                      <p className="font-semibold capitalize">
                        {gig.creator.level.replace(/(\d)/, ' $1')}
                      </p>
                    </div>
                  </div>

                  {gig.creator.skills.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {gig.creator.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    onClick={handleContactSeller}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contact Seller
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Package Selection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <PackageSelector
            packages={gig.packages}
            onSelectPackage={handleSelectPackage}
          />
        </motion.div>

        {/* Sticky Order Button */}
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t shadow-2xl"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Selected Package</p>
                  <p className="font-semibold capitalize">{selectedPackage}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {formatCurrency(
                        gig.packages.find((p) => p.type === selectedPackage)!.price
                      )}
                    </p>
                  </div>
                  <Button
                    onClick={handleOrderNow}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white font-semibold shadow-lg"
                  >
                    Order Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowVideoModal(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full aspect-video bg-black rounded-lg overflow-hidden"
          >
            <video
              src={gig.videos[currentVideoIndex]}
              controls
              autoPlay
              className="w-full h-full"
            />
            <Button
              onClick={() => setShowVideoModal(false)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function GigDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-32 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  );
}
