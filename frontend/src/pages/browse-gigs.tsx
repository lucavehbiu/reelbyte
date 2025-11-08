import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid3x3, List, Loader2, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GigCard, GigCardSkeleton } from '@/components/gigs/gig-card';
import { GigFilters } from '@/components/gigs/gig-filters';
import { useInfiniteGigs } from '@/hooks/use-gigs';
import { useDebounce } from '@/hooks/use-debounce';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import type { GigFilters as Filters } from '@/types';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';

export default function BrowseGigs() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Merge search with filters
  const activeFilters: Filters = {
    ...filters,
    search: debouncedSearch || undefined,
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteGigs(activeFilters);

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allGigs = data?.pages.flatMap((page) => page.gigs) || [];
  const totalCount = data?.pages[0]?.total || 0;

  const handleResetFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="border-b bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Discover Amazing{' '}
              <span className="gradient-purple-pink bg-clip-text text-transparent">
                Video Creators
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse thousands of professional video services tailored to your needs
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for video editing, animation, tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-14 text-base border-2 focus:border-primary transition-all shadow-lg"
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
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 shrink-0">
            <GigFilters
              filters={filters}
              onFiltersChange={setFilters}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Gigs Grid */}
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
                        gig{totalCount !== 1 ? 's' : ''} found
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
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
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
                  <GigFilters
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
                  <GigCardSkeleton key={i} />
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
                    We couldn't load the gigs. Please try again later.
                  </p>
                  <Button onClick={() => window.location.reload()}>
                    Refresh Page
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && allGigs.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto space-y-4">
                  <div className="text-6xl">🔍</div>
                  <h3 className="text-2xl font-bold">No gigs found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search query to find what you're looking for.
                  </p>
                  <Button onClick={handleResetFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Gigs Grid */}
            {!isLoading && !isError && allGigs.length > 0 && (
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
                {hasNextPage && (
                  <div ref={loadMoreRef} className="flex justify-center py-8">
                    {isFetchingNextPage && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading more gigs...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* End of Results */}
                {!hasNextPage && allGigs.length > 0 && (
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
      </div>
    </div>
  );
}
