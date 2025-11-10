import { motion } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/utils';
import type { ProjectFilters } from '@/lib/api/projects';

interface ProjectFiltersProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  onReset: () => void;
}

const VIDEO_TYPE_OPTIONS = [
  { value: 'Instagram Reel', label: 'Instagram Reels' },
  { value: 'Instagram Post', label: 'Instagram Posts' },
  { value: 'Instagram Story', label: 'Instagram Stories' },
  { value: 'Instagram Live', label: 'Instagram Live' },
  { value: 'TikTok', label: 'TikTok Videos' },
  { value: 'YouTube Short', label: 'YouTube Shorts' },
];

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'expert', label: 'Expert' },
  { value: 'any', label: 'Any Level' },
] as const;

const CATEGORY_OPTIONS = [
  { value: 'Social Media Content', label: 'Social Media' },
  { value: 'Video Editing', label: 'Video Editing' },
  { value: 'Photography', label: 'Photography' },
  { value: 'Animation', label: 'Animation' },
];

export function ProjectFilters({ filters, onFiltersChange, onReset }: ProjectFiltersProps) {
  const handleVideoTypeToggle = (type: string) => {
    onFiltersChange({
      ...filters,
      videoType: filters.videoType === type ? undefined : type,
    });
  };

  const handleExperienceLevelToggle = (level: typeof EXPERIENCE_LEVELS[number]['value']) => {
    onFiltersChange({
      ...filters,
      experienceLevel: filters.experienceLevel === level ? undefined : level,
    });
  };

  const handleCategoryToggle = (category: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? undefined : category,
    });
  };

  const handleBudgetChange = ([min, max]: number[]) => {
    onFiltersChange({
      ...filters,
      minBudget: min,
      maxBudget: max,
    });
  };

  const activeFiltersCount = [
    filters.category,
    filters.videoType,
    filters.experienceLevel,
    filters.minBudget !== undefined || filters.maxBudget !== undefined,
  ].filter(Boolean).length;

  const budgetMin = filters.minBudget ?? 0;
  const budgetMax = filters.maxBudget ?? 1000;

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
            <SlidersHorizontal className="h-5 w-5 text-brand-gold" />
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
              className="h-8 text-xs gap-1"
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>

        <Separator />

        {/* Content Type */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Content Type</h4>
          <div className="flex flex-wrap gap-2">
            {VIDEO_TYPE_OPTIONS.map((type) => (
              <motion.button
                key={type.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVideoTypeToggle(type.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filters.videoType === type.value
                    ? 'bg-brand-gold text-white shadow-gold-glow'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                {type.label}
              </motion.button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Category */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Category</h4>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((cat) => (
              <motion.button
                key={cat.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryToggle(cat.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filters.category === cat.value
                    ? 'bg-brand-navy text-white'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Budget Range */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Budget Range</h4>
            <span className="text-xs text-muted-foreground">
              {formatCurrency(budgetMin)} - {formatCurrency(budgetMax)}
            </span>
          </div>
          <Slider
            min={0}
            max={1000}
            step={50}
            value={[budgetMin, budgetMax]}
            onValueChange={handleBudgetChange}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(1000)}</span>
          </div>
        </div>

        <Separator />

        {/* Experience Level */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Experience Level</h4>
          <div className="space-y-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <motion.button
                key={level.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExperienceLevelToggle(level.value)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                  filters.experienceLevel === level.value
                    ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/30'
                    : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                }`}
              >
                {level.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Show Results Button (Mobile) */}
        <Button className="w-full lg:hidden btn-gold" onClick={() => {}}>
          Show Results
        </Button>
      </Card>
    </motion.div>
  );
}
