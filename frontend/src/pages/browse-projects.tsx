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
  const [activeTab, setActiveTab] = useState<BrowseTab>('projects');
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

      {/* Hero Section */}
      <div className="border-b bg-gradient-to-r from-brand-gold/5 via-brand-navy/5 to-brand-copper/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Discover{' '}
              <span className="text-gradient-gold bg-clip-text text-transparent">
                Restaurant Collaborations
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse collaboration opportunities from Amsterdam's finest restaurants
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for restaurants, cuisine types, collaboration types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-14 text-base border-2 focus:border-brand-gold transition-all shadow-lg"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BrowseTab)} className="w-full">
          {/* Tabs Navigation */}
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="projects" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Restaurant Projects
              </TabsTrigger>
              <TabsTrigger value="gigs" className="gap-2">
                <Users className="h-4 w-4" />
                Influencer Services
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
