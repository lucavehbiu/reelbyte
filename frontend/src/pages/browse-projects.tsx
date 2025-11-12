import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid3x3, List, Loader2, Filter, X, Briefcase, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectCard, ProjectCardSkeleton } from '@/components/projects/project-card';
import { GigCard, GigCardSkeleton } from '@/components/gigs/gig-card';
import { ProjectFilters } from '@/components/projects/project-filters';
import { useInfiniteProjects } from '@/hooks/use-projects';
import { useInfiniteGigs } from '@/hooks/use-gigs';
import { useDebounce } from '@/hooks/use-debounce';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { PullToRefreshIndicator } from '@/components/ui/pull-to-refresh';
import type { ProjectFilters as Filters } from '@/lib/api/projects';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';
type BrowseTab = 'projects' | 'gigs';

export default function BrowseProjects() {
  const [activeTab, setActiveTab] = useState<BrowseTab>('gigs');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Merge search with filters for projects
  const activeFilters: Filters = {
    ...filters,
    search: debouncedSearch || undefined,
    status: 'open', // Only show open projects by default
  };

  // Projects query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch: refetchProjects,
  } = useInfiniteProjects(activeFilters);

  // Gigs query (for Influencer Services tab)
  const {
    data: gigsData,
    fetchNextPage: fetchNextGigsPage,
    hasNextPage: hasNextGigsPage,
    isFetchingNextPage: isFetchingNextGigsPage,
    isLoading: isLoadingGigs,
    isError: isErrorGigs,
    refetch: refetchGigs,
  } = useInfiniteGigs({ search: debouncedSearch || undefined });

  // Pull-to-refresh for mobile - switches based on active tab
  const pullToRefresh = usePullToRefresh({
    onRefresh: async () => {
      if (activeTab === 'projects') {
        await refetchProjects();
      } else {
        await refetchGigs();
      }
    },
    enabled: typeof window !== 'undefined' && window.innerWidth < 768, // Only enable on mobile
  });

  // Intersection observer for infinite scroll - Projects
  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });

  // Intersection observer for infinite scroll - Gigs
  const { ref: loadMoreGigsRef, isIntersecting: isIntersectingGigs } = useIntersectionObserver({
    threshold: 0.1,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (isIntersectingGigs && hasNextGigsPage && !isFetchingNextGigsPage) {
      fetchNextGigsPage();
    }
  }, [isIntersectingGigs, hasNextGigsPage, isFetchingNextGigsPage, fetchNextGigsPage]);

  const allProjects = data?.pages.flatMap((page) => page.projects) || [];
  const totalCount = data?.pages[0]?.total || 0;

  const allGigs = gigsData?.pages.flatMap((page) => page.gigs) || [];
  const totalGigsCount = gigsData?.pages[0]?.total || 0;

  const handleResetFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Pull to Refresh Indicator */}
      <PullToRefreshIndicator {...pullToRefresh} />

      {/* Hero Section - MAGICAL ✨ */}
      <div className="relative border-b overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 via-brand-copper/5 to-brand-navy/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-navy/20 via-transparent to-transparent" />

        {/* Floating Shapes */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-brand-gold/20 to-brand-copper/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-brand-navy/20 to-brand-copper/20 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            {/* Title with Stagger Animation */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight"
            >
              Discover{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-brand-gold via-brand-copper to-brand-navy bg-clip-text text-transparent">
                  Restaurant Collaborations
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                  className="absolute bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-brand-gold/30 to-brand-copper/30 -z-10 origin-left"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-brand-charcoal/70 font-medium max-w-2xl mx-auto"
            >
              Browse collaboration opportunities from Amsterdam's finest restaurants
            </motion.p>

            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative max-w-3xl mx-auto"
            >
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold via-brand-copper to-brand-navy rounded-2xl opacity-30 group-hover:opacity-60 blur-lg transition-all duration-500" />

                <div className="relative">
                  {searchQuery && (
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-brand-navy/40 group-hover:text-brand-gold transition-colors duration-300 z-10" />
                  )}
                  <Input
                    type="text"
                    placeholder="Search for restaurants, cuisine types, collaboration types..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "relative h-16 md:h-18 text-base md:text-lg border-2 border-brand-cream bg-white/90 backdrop-blur-xl rounded-2xl focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20 transition-all duration-300 shadow-2xl font-medium placeholder:text-brand-charcoal/40 hover:shadow-3xl",
                      searchQuery ? "pl-16 pr-16" : "pl-6 pr-16"
                    )}
                  />
                  {searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full hover:bg-brand-gold/10 transition-all"
                      >
                        <X className="h-5 w-5 text-brand-charcoal/60" />
                      </Button>
                    </motion.div>
                  )}

                  {/* Search Icon Animation */}
                  {!searchQuery && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-brand-gold to-brand-copper flex items-center justify-center shadow-lg">
                        <Search className="h-5 w-5 text-white" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Quick Search Tags */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap justify-center gap-2 mt-4"
              >
                {['Social Media', 'Video Editing', 'Photography', 'Animation'].map((tag, index) => (
                  <motion.button
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchQuery(tag)}
                    className="px-4 py-2 text-sm font-medium rounded-full bg-white/80 backdrop-blur-sm border border-brand-navy/10 text-brand-navy hover:bg-gradient-to-r hover:from-brand-gold hover:to-brand-copper hover:text-white hover:border-transparent transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {tag}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 fill-background" viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,32L80,29.3C160,27,320,21,480,21.3C640,21,800,27,960,26.7C1120,27,1280,21,1360,18.7L1440,16L1440,48L1360,48C1280,48,1120,48,960,48C800,48,640,48,480,48C320,48,160,48,80,48L0,48Z" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BrowseTab)} className="w-full">
          {/* Tabs Navigation */}
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="gigs" className="gap-2">
                <Users className="h-4 w-4" />
                Influencer Services
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Restaurant Projects
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-0">
            <div className="flex gap-8">
              {/* Filters Sidebar - Desktop */}
              <aside className="hidden lg:block w-80 shrink-0">
                <ProjectFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onReset={handleResetFilters}
                />
              </aside>

              {/* Projects Grid */}
              <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">
                  {isLoading ? (
                    'Loading...'
                  ) : (
                    <>
                      {totalCount.toLocaleString()}{' '}
                      <span className="text-muted-foreground font-normal">
                        project{totalCount !== 1 ? 's' : ''} found
                      </span>
                    </>
                  )}
                </h2>
                {activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear filters ({activeFilterCount})
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden relative"
                >
                  <Filter className="h-4 w-4" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-brand-gold text-white text-xs rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden mb-6 overflow-hidden"
                >
                  <ProjectFilters
                    filters={filters}
                    onFiltersChange={(newFilters) => {
                      setFilters(newFilters);
                      setShowFilters(false);
                    }}
                    onReset={() => {
                      handleResetFilters();
                      setShowFilters(false);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading State */}
            {isLoading && (
              <div
                className={cn(
                  'grid gap-6',
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                )}
              >
                {[...Array(9)].map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error State */}
            {isError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto space-y-4">
                  <div className="text-6xl">😕</div>
                  <h3 className="text-2xl font-bold">Oops! Something went wrong</h3>
                  <p className="text-muted-foreground">
                    We couldn't load the projects. Please try again later.
                  </p>
                  <Button onClick={() => window.location.reload()}>
                    Refresh Page
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && allProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto space-y-4">
                  <div className="text-6xl">🔍</div>
                  <h3 className="text-2xl font-bold">No projects found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search query to find collaboration opportunities.
                  </p>
                  <Button onClick={handleResetFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Projects Grid */}
            {!isLoading && !isError && allProjects.length > 0 && (
              <>
                <motion.div
                  layout
                  className={cn(
                    'grid gap-6',
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
                  )}
                >
                  <AnimatePresence mode="popLayout">
                    {allProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        className={viewMode === 'list' ? 'col-span-1' : ''}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Load More Trigger */}
                {hasNextPage && (
                  <div ref={loadMoreRef} className="flex justify-center py-8">
                    {isFetchingNextPage && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading more projects...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* End of Results */}
                {!hasNextPage && allProjects.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <p>You've reached the end of the results</p>
                  </motion.div>
                )}
              </>
            )}
              </div>
            </div>
          </TabsContent>

          {/* Gigs Tab */}
          <TabsContent value="gigs" className="mt-0">
            <div className="max-w-7xl mx-auto">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold">
                    {isLoadingGigs ? (
                      'Loading...'
                    ) : (
                      <>
                        {totalGigsCount.toLocaleString()}{' '}
                        <span className="text-muted-foreground font-normal">
                          service{totalGigsCount !== 1 ? 's' : ''} available
                        </span>
                      </>
                    )}
                  </h2>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Loading State */}
              {isLoadingGigs && (
                <div
                  className={cn(
                    'grid gap-6',
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  )}
                >
                  {[...Array(8)].map((_, i) => (
                    <GigCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Error State */}
              {isErrorGigs && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="text-6xl">😕</div>
                    <h3 className="text-2xl font-bold">Oops! Something went wrong</h3>
                    <p className="text-muted-foreground">
                      We couldn't load the influencer services. Please try again later.
                    </p>
                    <Button onClick={() => window.location.reload()}>
                      Refresh Page
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Empty State */}
              {!isLoadingGigs && !isErrorGigs && allGigs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="text-6xl">🔍</div>
                    <h3 className="text-2xl font-bold">No influencer services found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? 'Try adjusting your search query to find available influencers.'
                        : 'No influencers are currently offering services. Check back soon!'}
                    </p>
                    {searchQuery && (
                      <Button onClick={() => setSearchQuery('')} variant="outline">
                        Clear Search
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Gigs Grid */}
              {!isLoadingGigs && !isErrorGigs && allGigs.length > 0 && (
                <>
                  <motion.div
                    layout
                    className={cn(
                      'grid gap-6',
                      viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                    )}
                  >
                    <AnimatePresence mode="popLayout">
                      {allGigs.map((gig) => (
                        <GigCard
                          key={gig.id}
                          gig={gig}
                          className={viewMode === 'list' ? 'col-span-1' : ''}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Load More Trigger */}
                  {hasNextGigsPage && (
                    <div ref={loadMoreGigsRef} className="flex justify-center py-8">
                      {isFetchingNextGigsPage && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Loading more services...</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* End of Results */}
                  {!hasNextGigsPage && allGigs.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <p>You've reached the end of the results</p>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
