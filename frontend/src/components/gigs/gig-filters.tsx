import { motion } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import type { GigFilters } from '@/types';
import { useCategories } from '@/hooks/use-gigs';

interface GigFiltersProps {
  filters: GigFilters;
  onFiltersChange: (filters: GigFilters) => void;
  onReset: () => void;
}

const DELIVERY_TIME_OPTIONS = [
  { value: 1, label: '24 Hours' },
  { value: 3, label: '3 Days' },
  { value: 7, label: '7 Days' },
  { value: 14, label: '2 Weeks' },
  { value: 30, label: '1 Month' },
];

const CREATOR_LEVELS = [
  { value: 'new', label: 'New Seller' },
  { value: 'level1', label: 'Level 1' },
  { value: 'level2', label: 'Level 2' },
  { value: 'toprated', label: 'Top Rated' },
] as const;

const MIN_RATING_OPTIONS = [
  { value: 4.5, label: '4.5 & up' },
  { value: 4.0, label: '4.0 & up' },
  { value: 3.5, label: '3.5 & up' },
  { value: 3.0, label: '3.0 & up' },
];

export function GigFilters({ filters, onFiltersChange, onReset }: GigFiltersProps) {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const handleCategoryToggle = (category: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? undefined : category,
    });
  };

  const handleDeliveryTimeToggle = (days: number) => {
    onFiltersChange({
      ...filters,
      deliveryTime: filters.deliveryTime === days ? undefined : days,
    });
  };

  const handleCreatorLevelToggle = (level: typeof CREATOR_LEVELS[number]['value']) => {
    onFiltersChange({
      ...filters,
      creatorLevel: filters.creatorLevel === level ? undefined : level,
    });
  };

  const handleMinRatingToggle = (rating: number) => {
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === rating ? undefined : rating,
    });
  };

  const handlePriceChange = ([min, max]: number[]) => {
    onFiltersChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  const activeFiltersCount = [
    filters.category,
    filters.deliveryTime,
    filters.creatorLevel,
    filters.minRating,
    filters.minPrice !== undefined || filters.maxPrice !== undefined,
  ].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 space-y-6 sticky top-24 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Filters</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 text-xs"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <Separator />

        {/* Category Filter */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Category</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
            {categoriesLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (
              categories.map((category) => (
                <motion.label
                  key={category}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.category === category}
                    onCheckedChange={() => handleCategoryToggle(category)}
                    className="data-[state=checked]:bg-primary"
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">
                    {category}
                  </span>
                </motion.label>
              ))
            )}
          </div>
        </div>

        <Separator />

        {/* Price Range Filter */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Price Range</h4>
          <div className="space-y-4 px-2">
            <Slider
              min={0}
              max={10000}
              step={50}
              value={[filters.minPrice || 0, filters.maxPrice || 10000]}
              onValueChange={handlePriceChange}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {formatCurrency(filters.minPrice || 0)}
              </span>
              <span className="text-muted-foreground">
                {formatCurrency(filters.maxPrice || 10000)}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Delivery Time Filter */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Delivery Time</h4>
          <div className="flex flex-wrap gap-2">
            {DELIVERY_TIME_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeliveryTimeToggle(option.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filters.deliveryTime === option.value
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Creator Level Filter */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Seller Level</h4>
          <div className="space-y-2">
            {CREATOR_LEVELS.map((level) => (
              <motion.label
                key={level.value}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <Checkbox
                  checked={filters.creatorLevel === level.value}
                  onCheckedChange={() => handleCreatorLevelToggle(level.value)}
                  className="data-[state=checked]:bg-primary"
                />
                <span className="text-sm group-hover:text-primary transition-colors">
                  {level.label}
                </span>
              </motion.label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Rating Filter */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Minimum Rating</h4>
          <div className="space-y-2">
            {MIN_RATING_OPTIONS.map((option) => (
              <motion.label
                key={option.value}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <Checkbox
                  checked={filters.minRating === option.value}
                  onCheckedChange={() => handleMinRatingToggle(option.value)}
                  className="data-[state=checked]:bg-primary"
                />
                <span className="text-sm group-hover:text-primary transition-colors flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  {option.label}
                </span>
              </motion.label>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
