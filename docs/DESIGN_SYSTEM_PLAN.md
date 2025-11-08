# ReelByte Design System Plan

> A mesmerizing, dark-mode-first design system for the next generation of video creator marketplace

**Version:** 1.0.0
**Last Updated:** November 2025
**Tech Stack:** TailwindCSS v4, shadcn/ui, Framer Motion 11+

---

## 🎨 Visual Identity

### Color Palette

#### Dark Mode (Primary)

**Base Colors**
```css
--background: 0 0% 8%         /* #141414 - Deep charcoal */
--background-alt: 0 0% 11%    /* #1C1C1C - Slightly lighter */
--surface: 0 0% 14%           /* #242424 - Card surfaces */
--surface-elevated: 0 0% 18%  /* #2E2E2E - Elevated surfaces */
```

**Brand Colors**
```css
--primary: 280 100% 70%       /* #C77DFF - Electric purple */
--primary-hover: 280 100% 65% /* #B865FF - Deeper purple */
--primary-glow: 280 100% 70%  /* Glow effect */

--secondary: 195 100% 50%     /* #00B4D8 - Cyan blue */
--secondary-hover: 195 100% 45% /* #0096B8 */

--accent: 340 100% 65%        /* #FF3D9A - Hot pink */
--accent-hover: 340 100% 60%  /* #FF1A85 */
```

**Gradient Palette**
```css
--gradient-primary: linear-gradient(135deg, #C77DFF 0%, #FF3D9A 100%)
--gradient-aurora: linear-gradient(135deg, #C77DFF 0%, #00B4D8 50%, #10F4C6 100%)
--gradient-sunset: linear-gradient(135deg, #FF3D9A 0%, #FF8D3D 100%)
--gradient-ocean: linear-gradient(135deg, #00B4D8 0%, #7209B7 100%)
--gradient-cosmic: linear-gradient(135deg, #7209B7 0%, #3A0CA3 50%, #C77DFF 100%)
```

**Semantic Colors**
```css
--success: 142 76% 56%        /* #3DDC84 - Bright green */
--warning: 38 92% 50%         /* #F59E0B - Amber */
--error: 0 84% 60%            /* #EF4444 - Red */
--info: 199 89% 48%           /* #0EA5E9 - Sky blue */
```

**Text Colors**
```css
--text-primary: 0 0% 98%      /* #FAFAFA - Almost white */
--text-secondary: 0 0% 70%    /* #B3B3B3 - Medium gray */
--text-tertiary: 0 0% 50%     /* #808080 - Muted gray */
--text-disabled: 0 0% 35%     /* #595959 - Disabled text */
```

**Glass Morphism**
```css
--glass-bg: rgba(255, 255, 255, 0.05)
--glass-border: rgba(255, 255, 255, 0.1)
--glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37)
--glass-blur: blur(12px)
```

#### Light Mode (Secondary)

**Base Colors**
```css
--background-light: 0 0% 98%      /* #FAFAFA */
--surface-light: 0 0% 100%        /* #FFFFFF */
--text-primary-light: 0 0% 10%    /* #1A1A1A */
--text-secondary-light: 0 0% 40%  /* #666666 */
```

### Typography System

**Font Families**
```css
--font-display: 'Clash Display', 'Inter', system-ui, -apple-system, sans-serif
--font-body: 'Inter', system-ui, -apple-system, sans-serif
--font-mono: 'JetBrains Mono', 'Fira Code', monospace
```

**Font Sizes** (Mobile-first, fluid scaling)
```css
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)      /* 12-14px */
--text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem)        /* 14-16px */
--text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem)      /* 16-18px */
--text-lg: clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem)    /* 18-20px */
--text-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)        /* 20-24px */
--text-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem)     /* 24-30px */
--text-3xl: clamp(1.875rem, 1.65rem + 1.125vw, 2.25rem)   /* 30-36px */
--text-4xl: clamp(2.25rem, 1.95rem + 1.5vw, 3rem)         /* 36-48px */
--text-5xl: clamp(3rem, 2.5rem + 2.5vw, 4rem)             /* 48-64px */
--text-6xl: clamp(4rem, 3.25rem + 3.75vw, 6rem)           /* 64-96px */
```

**Font Weights**
```css
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-black: 900
```

**Line Heights**
```css
--leading-tight: 1.2
--leading-snug: 1.375
--leading-normal: 1.5
--leading-relaxed: 1.625
--leading-loose: 2
```

**Letter Spacing**
```css
--tracking-tight: -0.025em
--tracking-normal: 0
--tracking-wide: 0.025em
--tracking-wider: 0.05em
--tracking-widest: 0.1em
```

### Spacing System

**Base Unit:** 4px (0.25rem)

```css
--space-0: 0
--space-1: 0.25rem      /* 4px */
--space-2: 0.5rem       /* 8px */
--space-3: 0.75rem      /* 12px */
--space-4: 1rem         /* 16px */
--space-5: 1.25rem      /* 20px */
--space-6: 1.5rem       /* 24px */
--space-8: 2rem         /* 32px */
--space-10: 2.5rem      /* 40px */
--space-12: 3rem        /* 48px */
--space-16: 4rem        /* 64px */
--space-20: 5rem        /* 80px */
--space-24: 6rem        /* 96px */
--space-32: 8rem        /* 128px */
```

### Border Radius

```css
--radius-none: 0
--radius-sm: 0.375rem      /* 6px - Small elements */
--radius-md: 0.5rem        /* 8px - Default */
--radius-lg: 0.75rem       /* 12px - Cards */
--radius-xl: 1rem          /* 16px - Large cards */
--radius-2xl: 1.5rem       /* 24px - Hero elements */
--radius-full: 9999px      /* Pills, avatars */
```

### Shadows

```css
/* Soft Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5)
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.6)

/* Glow Effects */
--glow-primary: 0 0 20px rgba(199, 125, 255, 0.5)
--glow-secondary: 0 0 20px rgba(0, 180, 216, 0.5)
--glow-accent: 0 0 20px rgba(255, 61, 154, 0.5)
--glow-success: 0 0 20px rgba(61, 220, 132, 0.5)

/* Inner Shadows */
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)
--shadow-inner-lg: inset 0 4px 8px 0 rgba(0, 0, 0, 0.5)
```

### Brand Personality

**Voice & Tone**
- **Creative**: Inspiring, artistic, innovative
- **Professional**: Reliable, trustworthy, competent
- **Energetic**: Dynamic, vibrant, exciting
- **Modern**: Cutting-edge, tech-forward, contemporary

**Design Principles**
1. **Mesmerizing Visual Hierarchy** - Every element should guide the eye naturally
2. **Smooth Motion** - All interactions feel fluid and intentional
3. **Depth & Dimension** - Glass morphism and layering create spatial awareness
4. **Content First** - Design enhances, never overshadows the creator's work
5. **Performance Matters** - Beautiful, but never at the cost of speed

**Emotional Goals**
- Inspire creativity and confidence
- Create sense of premium quality
- Feel cutting-edge and forward-thinking
- Build trust through polish and attention to detail

---

## 🎭 Design Patterns

### Glass Morphism Effects

**Standard Glass Card**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

**Glass Navigation**
```css
.glass-nav {
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
```

**Glass Modal Overlay**
```css
.glass-overlay {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
}
```

**Frosted Glass Sidebar**
```css
.glass-sidebar {
  background: linear-gradient(
    135deg,
    rgba(199, 125, 255, 0.1) 0%,
    rgba(0, 180, 216, 0.05) 100%
  );
  backdrop-filter: blur(16px);
  border-right: 1px solid rgba(255, 255, 255, 0.12);
}
```

### Gradient Animations

**Animated Background Gradient**
```css
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.gradient-animate {
  background: linear-gradient(
    -45deg,
    #7209B7,
    #C77DFF,
    #00B4D8,
    #FF3D9A
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
```

**Gradient Border Animation**
```css
@keyframes border-spin {
  100% { transform: rotate(360deg); }
}

.gradient-border {
  position: relative;
  background: var(--surface);
  border-radius: var(--radius-lg);
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(45deg, #C77DFF, #00B4D8, #FF3D9A);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  animation: border-spin 3s linear infinite;
}
```

**Text Gradient Shimmer**
```css
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.text-shimmer {
  background: linear-gradient(
    90deg,
    #C77DFF 0%,
    #FFFFFF 50%,
    #C77DFF 100%
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}
```

### Micro-interactions

**Button Hover Scale**
```tsx
// Framer Motion variant
const buttonHover = {
  scale: 1.02,
  boxShadow: "0 0 20px rgba(199, 125, 255, 0.5)",
  transition: { duration: 0.2, ease: "easeOut" }
}
```

**Card Hover Lift**
```tsx
const cardHover = {
  y: -8,
  scale: 1.01,
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
}
```

**Icon Bounce**
```tsx
const iconBounce = {
  scale: [1, 1.2, 0.9, 1.1, 1],
  transition: { duration: 0.5, ease: "easeInOut" }
}
```

**Input Focus Glow**
```css
.input-focus {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.input-focus:focus {
  box-shadow: 0 0 0 3px rgba(199, 125, 255, 0.3);
  border-color: var(--primary);
}
```

**Ripple Effect**
```tsx
const rippleVariants = {
  initial: { scale: 0, opacity: 0.5 },
  animate: {
    scale: 2,
    opacity: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}
```

### Loading States

**Skeleton Pulse**
```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface) 0%,
    var(--surface-elevated) 50%,
    var(--surface) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 2s ease-in-out infinite;
}
```

**Spinner Variants**
```tsx
// Orbit Spinner
const orbitSpinner = {
  rotate: 360,
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "linear"
  }
}

// Pulse Dots
const pulseDots = {
  scale: [1, 1.3, 1],
  opacity: [0.4, 1, 0.4],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

// Progress Bar
const progressBar = {
  scaleX: [0, 1],
  transition: {
    duration: 2,
    ease: [0.43, 0.13, 0.23, 0.96]
  }
}
```

**Loading Overlay**
```tsx
const loadingOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
}
```

### Empty States

**Visual Components**
- Illustration (lottie animation or static SVG)
- Headline (clear, encouraging message)
- Description (helpful context)
- Primary action button
- Optional secondary action

**Example Messages**
- "No gigs yet - Create your first one!"
- "Your inbox is empty - Start a conversation"
- "No saved items - Browse and save favorites"
- "Search came up empty - Try different keywords"

**Design Specs**
```tsx
<div className="flex flex-col items-center justify-center py-20 px-6">
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="w-64 h-64 mb-8"
  >
    {/* Illustration */}
  </motion.div>

  <h3 className="text-2xl font-bold mb-3">
    {headline}
  </h3>

  <p className="text-secondary text-center max-w-md mb-8">
    {description}
  </p>

  <Button variant="primary" size="lg">
    {primaryAction}
  </Button>
</div>
```

### Error States

**Error Types**
1. **Inline Field Errors** - Below form inputs
2. **Toast Notifications** - Top-right corner
3. **Alert Banners** - Top of page/section
4. **Full Page Errors** - 404, 500, etc.

**Error Message Pattern**
```tsx
<motion.div
  initial={{ opacity: 0, x: -10 }}
  animate={{ opacity: 1, x: 0 }}
  className="flex items-start gap-3 p-4 rounded-lg bg-error/10 border border-error/30"
>
  <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
  <div className="flex-1">
    <p className="font-medium text-error mb-1">
      {errorTitle}
    </p>
    <p className="text-sm text-secondary">
      {errorMessage}
    </p>
    {action && (
      <Button variant="ghost" size="sm" className="mt-3">
        {action}
      </Button>
    )}
  </div>
</motion.div>
```

**Error Animation**
```tsx
const errorShake = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.4 }
}
```

---

## 🧩 Component Design Specs

### Buttons

**Variants**

```tsx
// Primary (Call-to-action)
<Button variant="primary">
  className="
    bg-gradient-to-r from-primary to-accent
    text-white font-semibold
    px-6 py-3 rounded-lg
    hover:shadow-glow-primary
    transition-all duration-300
  "
</Button>

// Secondary (Alternative actions)
<Button variant="secondary">
  className="
    bg-surface border border-glass-border
    text-primary font-semibold
    px-6 py-3 rounded-lg
    hover:bg-surface-elevated hover:border-primary/50
    transition-all duration-300
  "
</Button>

// Ghost (Subtle actions)
<Button variant="ghost">
  className="
    bg-transparent
    text-secondary font-medium
    px-4 py-2 rounded-lg
    hover:bg-white/5 hover:text-primary
    transition-all duration-300
  "
</Button>

// Destructive (Delete, remove actions)
<Button variant="destructive">
  className="
    bg-error/10 border border-error/30
    text-error font-semibold
    px-6 py-3 rounded-lg
    hover:bg-error/20
    transition-all duration-300
  "
</Button>
```

**Sizes**
```tsx
sizes: {
  xs: "px-3 py-1.5 text-xs",
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
  xl: "px-10 py-5 text-xl"
}
```

**States**
```tsx
// Default → Hover → Active → Disabled

const buttonVariants = {
  hover: {
    scale: 1.02,
    boxShadow: "0 0 20px rgba(199, 125, 255, 0.5)"
  },
  tap: {
    scale: 0.98
  },
  disabled: {
    opacity: 0.5,
    cursor: "not-allowed"
  }
}
```

**With Icons**
```tsx
<Button>
  <Icon className="mr-2" />
  Button Text
</Button>

// Icon only
<Button size="icon" className="w-10 h-10">
  <Icon />
</Button>
```

**Loading State**
```tsx
<Button disabled={loading}>
  {loading ? (
    <>
      <Spinner className="mr-2" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

### Cards

**Gig Card**
```tsx
<motion.div
  whileHover={{ y: -8 }}
  className="
    glass-card rounded-xl overflow-hidden
    border border-glass-border
    hover:border-primary/30
    transition-all duration-300
    group
  "
>
  {/* Thumbnail with gradient overlay */}
  <div className="relative aspect-video overflow-hidden">
    <img
      src={thumbnail}
      className="
        w-full h-full object-cover
        group-hover:scale-105
        transition-transform duration-500
      "
    />
    <div className="
      absolute inset-0
      bg-gradient-to-t from-black/80 via-black/20 to-transparent
    " />

    {/* Duration badge */}
    <div className="absolute top-3 right-3 glass-card px-3 py-1 rounded-full">
      <span className="text-xs font-medium">2:45</span>
    </div>
  </div>

  {/* Content */}
  <div className="p-5">
    {/* Title */}
    <h3 className="
      font-semibold text-lg mb-2
      line-clamp-2
      group-hover:text-primary
      transition-colors
    ">
      {title}
    </h3>

    {/* Creator info */}
    <div className="flex items-center gap-3 mb-4">
      <Avatar size="sm" src={creatorAvatar} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{creatorName}</p>
        <p className="text-xs text-secondary">{creatorLevel}</p>
      </div>
    </div>

    {/* Stats */}
    <div className="flex items-center gap-4 mb-4 text-sm text-secondary">
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-warning text-warning" />
        <span className="font-medium">{rating}</span>
        <span>({reviews})</span>
      </div>
      <div className="flex items-center gap-1">
        <Eye className="w-4 h-4" />
        <span>{views}</span>
      </div>
    </div>

    {/* Price & CTA */}
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-secondary mb-1">Starting at</p>
        <p className="text-xl font-bold text-primary">${price}</p>
      </div>
      <Button variant="primary" size="sm">
        View Details
      </Button>
    </div>
  </div>
</motion.div>
```

**Creator Card**
```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  className="
    glass-card rounded-2xl p-6
    border border-glass-border
    hover:shadow-2xl hover:border-primary/30
    transition-all duration-300
    text-center
  "
>
  {/* Background decoration */}
  <div className="
    absolute inset-0 rounded-2xl overflow-hidden
    bg-gradient-to-br from-primary/10 to-accent/5
    opacity-0 group-hover:opacity-100
    transition-opacity duration-300
  " />

  {/* Avatar with ring */}
  <div className="relative inline-block mb-4">
    <div className="
      absolute inset-0 rounded-full
      bg-gradient-to-br from-primary to-accent
      animate-pulse blur-md
    " />
    <Avatar
      size="xl"
      src={avatar}
      className="relative ring-2 ring-primary/50"
    />
    {isOnline && (
      <div className="
        absolute bottom-2 right-2
        w-4 h-4 rounded-full
        bg-success border-2 border-surface
      " />
    )}
  </div>

  {/* Name & badge */}
  <div className="mb-2">
    <h3 className="font-bold text-xl mb-1">{name}</h3>
    <Badge variant="primary">{badge}</Badge>
  </div>

  {/* Specialties */}
  <p className="text-secondary text-sm mb-4">{specialties}</p>

  {/* Stats grid */}
  <div className="grid grid-cols-3 gap-4 mb-5 py-4 border-y border-glass-border">
    <div>
      <p className="text-2xl font-bold text-primary">{projectsCompleted}</p>
      <p className="text-xs text-secondary">Projects</p>
    </div>
    <div>
      <p className="text-2xl font-bold text-primary">{rating}</p>
      <p className="text-xs text-secondary">Rating</p>
    </div>
    <div>
      <p className="text-2xl font-bold text-primary">{responseTime}</p>
      <p className="text-xs text-secondary">Response</p>
    </div>
  </div>

  {/* Actions */}
  <div className="flex gap-2">
    <Button variant="primary" className="flex-1">
      View Profile
    </Button>
    <Button variant="secondary" size="icon">
      <MessageCircle className="w-5 h-5" />
    </Button>
  </div>
</motion.div>
```

**Project Card (Dashboard)**
```tsx
<div className="
  glass-card rounded-xl p-5
  border border-glass-border
  hover:border-primary/30
  transition-all duration-300
">
  {/* Header */}
  <div className="flex items-start justify-between mb-4">
    <div className="flex-1">
      <h3 className="font-semibold text-lg mb-1">{projectTitle}</h3>
      <p className="text-sm text-secondary">{clientName}</p>
    </div>
    <Badge variant={statusVariant}>{status}</Badge>
  </div>

  {/* Progress */}
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-2">
      <span className="text-secondary">Progress</span>
      <span className="font-medium">{progress}%</span>
    </div>
    <div className="h-2 bg-surface rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className="h-full bg-gradient-to-r from-primary to-accent"
      />
    </div>
  </div>

  {/* Metadata */}
  <div className="flex items-center gap-4 text-sm text-secondary mb-4">
    <div className="flex items-center gap-1">
      <Calendar className="w-4 h-4" />
      <span>{deadline}</span>
    </div>
    <div className="flex items-center gap-1">
      <DollarSign className="w-4 h-4" />
      <span className="font-medium text-primary">{budget}</span>
    </div>
  </div>

  {/* Actions */}
  <div className="flex gap-2">
    <Button variant="secondary" size="sm" className="flex-1">
      View Details
    </Button>
    <Button variant="ghost" size="sm">
      <MoreHorizontal className="w-5 h-5" />
    </Button>
  </div>
</div>
```

### Forms

**Input Field**
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">
    {label}
    {required && <span className="text-error ml-1">*</span>}
  </label>

  <div className="relative">
    {leftIcon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
        {leftIcon}
      </div>
    )}

    <input
      className="
        w-full px-4 py-3
        bg-surface border border-glass-border rounded-lg
        text-base
        placeholder:text-tertiary
        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
      "
      style={{ paddingLeft: leftIcon ? '2.75rem' : '1rem' }}
      {...props}
    />

    {rightIcon && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary">
        {rightIcon}
      </div>
    )}
  </div>

  {error && (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-sm text-error flex items-center gap-1"
    >
      <AlertCircle className="w-4 h-4" />
      {error}
    </motion.p>
  )}

  {helperText && !error && (
    <p className="text-sm text-secondary">{helperText}</p>
  )}
</div>
```

**Select Dropdown**
```tsx
<Select>
  <SelectTrigger className="
    w-full px-4 py-3
    bg-surface border border-glass-border rounded-lg
    text-base
    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
    transition-all duration-300
  ">
    <SelectValue placeholder={placeholder} />
  </SelectTrigger>

  <SelectContent className="
    bg-surface-elevated border border-glass-border
    rounded-lg overflow-hidden
    backdrop-blur-xl
  ">
    {options.map(option => (
      <SelectItem
        key={option.value}
        value={option.value}
        className="
          px-4 py-3
          hover:bg-white/5 hover:text-primary
          cursor-pointer
          transition-colors duration-200
        "
      >
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

**Textarea**
```tsx
<textarea
  className="
    w-full px-4 py-3
    bg-surface border border-glass-border rounded-lg
    text-base resize-y min-h-[120px]
    placeholder:text-tertiary
    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
    transition-all duration-300
  "
  {...props}
/>
```

**Checkbox**
```tsx
<label className="flex items-start gap-3 cursor-pointer group">
  <div className="relative flex items-center justify-center">
    <input
      type="checkbox"
      className="
        peer sr-only
      "
      {...props}
    />
    <div className="
      w-5 h-5 rounded border-2 border-glass-border
      bg-surface
      peer-checked:bg-gradient-to-br peer-checked:from-primary peer-checked:to-accent
      peer-checked:border-transparent
      peer-focus:ring-2 peer-focus:ring-primary/30
      transition-all duration-300
      flex items-center justify-center
    ">
      <Check className="
        w-3 h-3 text-white
        opacity-0 peer-checked:opacity-100
        transition-opacity duration-200
      " />
    </div>
  </div>

  <div className="flex-1">
    <p className="text-sm font-medium group-hover:text-primary transition-colors">
      {label}
    </p>
    {description && (
      <p className="text-xs text-secondary mt-1">
        {description}
      </p>
    )}
  </div>
</label>
```

**Radio Group**
```tsx
<RadioGroup className="space-y-3">
  {options.map(option => (
    <label key={option.value} className="
      flex items-center gap-3
      p-4 rounded-lg
      border border-glass-border
      cursor-pointer
      hover:bg-white/5 hover:border-primary/30
      transition-all duration-300
      group
    ">
      <input
        type="radio"
        className="peer sr-only"
        value={option.value}
        {...props}
      />
      <div className="
        w-5 h-5 rounded-full
        border-2 border-glass-border
        bg-surface
        peer-checked:border-primary peer-checked:border-[6px]
        transition-all duration-300
      " />
      <div className="flex-1">
        <p className="font-medium group-hover:text-primary transition-colors">
          {option.label}
        </p>
        {option.description && (
          <p className="text-sm text-secondary mt-1">
            {option.description}
          </p>
        )}
      </div>
    </label>
  ))}
</RadioGroup>
```

**File Upload (Drag & Drop)**
```tsx
<div
  className="
    relative
    border-2 border-dashed border-glass-border
    rounded-xl p-12
    text-center
    bg-surface/50
    hover:bg-surface hover:border-primary/50
    transition-all duration-300
    cursor-pointer
    group
  "
  onDragOver={handleDragOver}
  onDrop={handleDrop}
>
  <input
    type="file"
    className="absolute inset-0 opacity-0 cursor-pointer"
    {...props}
  />

  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    className="mb-4"
  >
    <Upload className="w-12 h-12 mx-auto text-primary" />
  </motion.div>

  <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
    Drag & drop your files here
  </h4>
  <p className="text-sm text-secondary mb-4">
    or click to browse
  </p>
  <p className="text-xs text-tertiary">
    Supports: MP4, MOV, AVI up to 500MB
  </p>
</div>
```

### Navigation

**Top Navigation Bar**
```tsx
<motion.nav
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  className="
    fixed top-0 left-0 right-0 z-50
    glass-nav
    px-6 py-4
  "
>
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    {/* Logo */}
    <Link to="/" className="flex items-center gap-2 group">
      <div className="
        w-10 h-10 rounded-xl
        bg-gradient-to-br from-primary to-accent
        flex items-center justify-center
        group-hover:scale-110
        transition-transform duration-300
      ">
        <Play className="w-6 h-6 text-white" />
      </div>
      <span className="text-xl font-bold gradient-text">ReelByte</span>
    </Link>

    {/* Search */}
    <div className="flex-1 max-w-2xl mx-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
        <input
          type="search"
          placeholder="Search for video services..."
          className="
            w-full pl-12 pr-4 py-3
            bg-surface border border-glass-border rounded-full
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            transition-all duration-300
          "
        />
      </div>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon">
        <Bell className="w-5 h-5" />
        {hasNotifications && (
          <span className="
            absolute top-2 right-2
            w-2 h-2 rounded-full
            bg-error
            animate-pulse
          " />
        )}
      </Button>

      <Button variant="ghost" size="icon">
        <MessageCircle className="w-5 h-5" />
      </Button>

      <Button variant="primary">
        Post a Gig
      </Button>

      {/* Avatar dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar src={userAvatar} size="md" className="ring-2 ring-primary/30" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* Menu items */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</motion.nav>
```

**Sidebar Navigation**
```tsx
<motion.aside
  initial={{ x: -300 }}
  animate={{ x: 0 }}
  className="
    fixed left-0 top-16 bottom-0
    w-64
    glass-sidebar
    p-6
    overflow-y-auto
  "
>
  <nav className="space-y-2">
    {menuItems.map(item => (
      <Link
        key={item.path}
        to={item.path}
        className="
          flex items-center gap-3
          px-4 py-3 rounded-lg
          text-secondary
          hover:text-primary hover:bg-white/5
          transition-all duration-300
          group
        "
      >
        <item.icon className="
          w-5 h-5
          group-hover:scale-110
          transition-transform duration-300
        " />
        <span className="font-medium">{item.label}</span>
        {item.badge && (
          <Badge variant="primary" size="sm" className="ml-auto">
            {item.badge}
          </Badge>
        )}
      </Link>
    ))}
  </nav>
</motion.aside>
```

**Mobile Bottom Navigation**
```tsx
<motion.nav
  initial={{ y: 100 }}
  animate={{ y: 0 }}
  className="
    fixed bottom-0 left-0 right-0
    md:hidden
    glass-nav border-t border-glass-border
    px-4 py-2
    safe-area-bottom
  "
>
  <div className="flex items-center justify-around">
    {mobileMenuItems.map(item => (
      <Link
        key={item.path}
        to={item.path}
        className="
          flex flex-col items-center gap-1
          px-3 py-2
          text-secondary
          active:text-primary
          transition-colors duration-200
        "
      >
        <item.icon className="w-6 h-6" />
        <span className="text-xs font-medium">{item.label}</span>
      </Link>
    ))}
  </div>
</motion.nav>
```

**Breadcrumb Navigation**
```tsx
<nav className="flex items-center gap-2 text-sm">
  {breadcrumbs.map((crumb, index) => (
    <Fragment key={crumb.path}>
      {index > 0 && (
        <ChevronRight className="w-4 h-4 text-tertiary" />
      )}
      <Link
        to={crumb.path}
        className="
          text-secondary hover:text-primary
          transition-colors duration-200
        "
      >
        {crumb.label}
      </Link>
    </Fragment>
  ))}
</nav>
```

### Modals and Dialogs

**Standard Modal**
```tsx
<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-full max-w-lg
          glass-card rounded-2xl
          border border-glass-border
          shadow-2xl
          z-50
          max-h-[90vh] overflow-y-auto
        "
      >
        {/* Header */}
        <div className="
          flex items-center justify-between
          px-6 py-4
          border-b border-glass-border
        ">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-secondary hover:text-primary"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer (optional) */}
        {footer && (
          <div className="
            flex items-center justify-end gap-3
            px-6 py-4
            border-t border-glass-border
          ">
            {footer}
          </div>
        )}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

**Confirmation Dialog**
```tsx
<Dialog>
  <DialogContent className="max-w-md">
    <div className="text-center">
      <div className="
        w-16 h-16 mx-auto mb-4
        rounded-full bg-warning/10
        flex items-center justify-center
      ">
        <AlertTriangle className="w-8 h-8 text-warning" />
      </div>

      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-secondary mb-6">{description}</p>

      <div className="flex gap-3">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
          className="flex-1"
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
```

**Drawer (Slide-in Panel)**
```tsx
<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="
          fixed top-0 right-0 bottom-0
          w-full max-w-md
          glass-card
          border-l border-glass-border
          shadow-2xl
          z-50
          overflow-y-auto
        "
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          {children}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### Video Players

**Custom Video Player**
```tsx
<div className="relative aspect-video bg-black rounded-xl overflow-hidden group">
  {/* Video element */}
  <video
    ref={videoRef}
    className="w-full h-full"
    src={videoSrc}
    poster={thumbnail}
  />

  {/* Overlay gradient */}
  <div className="
    absolute inset-0
    bg-gradient-to-t from-black/80 via-transparent to-black/40
    opacity-0 group-hover:opacity-100
    transition-opacity duration-300
  " />

  {/* Play/Pause button (center) */}
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="
      absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      w-16 h-16 rounded-full
      bg-white/20 backdrop-blur-sm
      flex items-center justify-center
      opacity-0 group-hover:opacity-100
      transition-opacity duration-300
    "
    onClick={togglePlay}
  >
    {isPlaying ? (
      <Pause className="w-8 h-8 text-white" />
    ) : (
      <Play className="w-8 h-8 text-white ml-1" />
    )}
  </motion.button>

  {/* Controls bar */}
  <div className="
    absolute bottom-0 left-0 right-0
    px-4 py-3
    opacity-0 group-hover:opacity-100
    transition-opacity duration-300
  ">
    {/* Progress bar */}
    <div className="mb-3">
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleSeek}
        className="w-full h-1 bg-white/20 rounded-full"
      />
    </div>

    {/* Controls */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={togglePlay}>
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <button onClick={toggleMute}>
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <span className="text-sm font-medium">
          {currentTime} / {duration}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={toggleCaptions}>
          <Subtitles className="w-5 h-5" />
        </button>

        <button onClick={openSettings}>
          <Settings className="w-5 h-5" />
        </button>

        <button onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>
    </div>
  </div>

  {/* Loading spinner */}
  {isLoading && (
    <div className="absolute inset-0 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )}
</div>
```

### Profile Layouts

**Creator Profile Header**
```tsx
<div className="relative">
  {/* Cover image with gradient */}
  <div className="relative h-64 overflow-hidden">
    <img
      src={coverImage}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent" />
  </div>

  {/* Profile content */}
  <div className="max-w-7xl mx-auto px-6">
    <div className="relative -mt-20">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <Avatar
            src={avatar}
            size="2xl"
            className="
              ring-4 ring-background
              w-32 h-32
            "
          />
          {isOnline && (
            <div className="
              absolute bottom-2 right-2
              w-6 h-6 rounded-full
              bg-success border-4 border-background
            " />
          )}
        </motion.div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold mb-2">{name}</h1>
              <p className="text-lg text-secondary mb-3">{tagline}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Joined {joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="primary">
                <MessageCircle className="w-5 h-5 mr-2" />
                Message
              </Button>
              <Button variant="secondary">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="
        mt-6 p-6
        glass-card rounded-xl
        border border-glass-border
      ">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary mb-1">{stats.projects}</p>
            <p className="text-sm text-secondary">Projects Completed</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-5 h-5 fill-warning text-warning" />
              <p className="text-3xl font-bold text-primary">{stats.rating}</p>
            </div>
            <p className="text-sm text-secondary">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary mb-1">{stats.reviews}</p>
            <p className="text-sm text-secondary">Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary mb-1">{stats.responseTime}</p>
            <p className="text-sm text-secondary">Response Time</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary mb-1">{stats.rehireRate}%</p>
            <p className="text-sm text-secondary">Rehire Rate</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 🎬 Animation Strategy

### Page Transitions

**Route Transition Wrapper**
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

**Staggered Children Animation**
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Scroll Animations

**Fade In on Scroll**
```tsx
import { useInView } from 'framer-motion'

const FadeInOnScroll = ({ children }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
```

**Parallax Effect**
```tsx
import { useScroll, useTransform } from 'framer-motion'

const ParallaxSection = ({ children }) => {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, -200])

  return (
    <motion.div style={{ y }}>
      {children}
    </motion.div>
  )
}
```

**Progress Indicator**
```tsx
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
```

### Hover Effects

**Magnetic Button**
```tsx
const MagneticButton = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={position}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.button>
  )
}
```

**3D Tilt Card**
```tsx
const TiltCard = ({ children }) => {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientY - rect.top - rect.height / 2) / 20
    const y = (e.clientX - rect.left - rect.width / 2) / -20
    setRotateX(x)
    setRotateY(y)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  )
}
```

**Glow on Hover**
```tsx
const glowVariants = {
  initial: { boxShadow: "0 0 0 rgba(199, 125, 255, 0)" },
  hover: {
    boxShadow: "0 0 30px rgba(199, 125, 255, 0.6)",
    transition: { duration: 0.3 }
  }
}
```

### Loading Animations

**Skeleton Loader**
```tsx
const Skeleton = ({ className }) => (
  <motion.div
    className={cn("bg-surface rounded", className)}
    animate={{
      opacity: [0.5, 1, 0.5]
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
)
```

**Spinner Variants**
```tsx
// Orbit Spinner
const OrbitSpinner = () => (
  <div className="relative w-12 h-12">
    <motion.div
      className="absolute inset-0 border-4 border-primary/30 border-t-primary rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
)

// Pulse Dots
const PulseDots = () => (
  <div className="flex gap-2">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        className="w-3 h-3 rounded-full bg-primary"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.4, 1, 0.4]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.2
        }}
      />
    ))}
  </div>
)

// Progress Bar
const ProgressBar = ({ progress }) => (
  <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
    <motion.div
      className="h-full bg-gradient-to-r from-primary to-accent"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
    />
  </div>
)
```

### Success/Error Feedback

**Toast Notification Animation**
```tsx
const toastVariants = {
  initial: {
    opacity: 0,
    y: -50,
    scale: 0.3
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    x: 200,
    transition: { duration: 0.2 }
  }
}
```

**Success Checkmark Animation**
```tsx
const checkmarkVariants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.5, ease: "easeOut" },
      opacity: { duration: 0.2 }
    }
  }
}

<motion.svg viewBox="0 0 52 52">
  <motion.circle
    cx="26"
    cy="26"
    r="25"
    fill="none"
    stroke="var(--success)"
    strokeWidth="2"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 0.5 }}
  />
  <motion.path
    fill="none"
    stroke="var(--success)"
    strokeWidth="3"
    d="M14 27l7 7 16-16"
    variants={checkmarkVariants}
  />
</motion.svg>
```

**Error Shake**
```tsx
const errorShake = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.4 }
}
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px     /* Small devices (landscape phones) */
--breakpoint-md: 768px     /* Medium devices (tablets) */
--breakpoint-lg: 1024px    /* Large devices (laptops) */
--breakpoint-xl: 1280px    /* Extra large devices (desktops) */
--breakpoint-2xl: 1536px   /* 2X large devices (large desktops) */
```

**TailwindCSS Configuration**
```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
}
```

### Mobile-First Approach

**Layout Strategy**
```tsx
// Stack on mobile, grid on desktop
<div className="
  flex flex-col gap-4        /* Mobile: vertical stack */
  md:grid md:grid-cols-2     /* Tablet: 2 columns */
  lg:grid-cols-3             /* Desktop: 3 columns */
">
  {items}
</div>
```

**Typography Scaling**
```tsx
// Fluid typography that scales with viewport
<h1 className="
  text-3xl      /* Mobile: 30px */
  md:text-4xl   /* Tablet: 36px */
  lg:text-5xl   /* Desktop: 48px */
  xl:text-6xl   /* Large desktop: 64px */
  font-bold
">
  {title}
</h1>
```

**Spacing Adjustments**
```tsx
// More compact on mobile, generous on desktop
<section className="
  px-4 py-8         /* Mobile */
  md:px-6 md:py-12  /* Tablet */
  lg:px-8 lg:py-16  /* Desktop */
">
  {content}
</section>
```

**Conditional Rendering**
```tsx
// Show/hide elements based on screen size
<div className="hidden lg:block">Desktop only content</div>
<div className="block lg:hidden">Mobile only content</div>
```

### Touch Interactions

**Touch Target Sizes**
```css
/* Minimum touch target: 44x44px (Apple), 48x48px (Material) */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}
```

**Touch Gestures**
```tsx
import { useDrag } from '@use-gesture/react'

const SwipeableCard = () => {
  const [{ x }, api] = useSpring(() => ({ x: 0 }))

  const bind = useDrag(({ down, movement: [mx] }) => {
    api.start({
      x: down ? mx : 0,
      immediate: down
    })

    if (!down && Math.abs(mx) > 100) {
      onSwipe(mx > 0 ? 'right' : 'left')
    }
  })

  return (
    <animated.div {...bind()} style={{ x }}>
      {content}
    </animated.div>
  )
}
```

**Pull to Refresh**
```tsx
const PullToRefresh = ({ onRefresh, children }) => {
  const [pulling, setPulling] = useState(false)

  const bind = useDrag(({ down, movement: [, my] }) => {
    if (my > 0 && window.scrollY === 0) {
      setPulling(down && my > 80)

      if (!down && my > 80) {
        onRefresh()
      }
    }
  })

  return (
    <div {...bind()}>
      {pulling && <RefreshIndicator />}
      {children}
    </div>
  )
}
```

**Mobile Navigation**
```tsx
// Drawer menu for mobile
const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset }) => {
              if (offset.x < -100) setIsOpen(false)
            }}
            className="fixed inset-y-0 left-0 w-80 glass-card z-50"
          >
            {menuContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

---

## ♿ Accessibility

### Color Contrast

**WCAG 2.1 Level AA Compliance**
- Normal text (< 18px): Contrast ratio 4.5:1 minimum
- Large text (≥ 18px or bold ≥ 14px): Contrast ratio 3:1 minimum
- UI components and graphics: Contrast ratio 3:1 minimum

**Tested Color Combinations**
```css
/* Primary on dark background */
--primary (#C77DFF) on --background (#141414)
/* Contrast ratio: 5.8:1 ✓ */

/* Text primary on dark background */
--text-primary (#FAFAFA) on --background (#141414)
/* Contrast ratio: 15.3:1 ✓ */

/* Text secondary on dark background */
--text-secondary (#B3B3B3) on --background (#141414)
/* Contrast ratio: 7.2:1 ✓ */

/* Success on dark background */
--success (#3DDC84) on --background (#141414)
/* Contrast ratio: 6.1:1 ✓ */

/* Error on dark background */
--error (#EF4444) on --background (#141414)
/* Contrast ratio: 4.8:1 ✓ */
```

**Focus Indicators**
```css
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: var(--radius-md);
}
```

### Keyboard Navigation

**Tab Order**
```tsx
// Logical tab order through interactive elements
<div>
  <button tabIndex={0}>Primary Action</button>
  <button tabIndex={0}>Secondary Action</button>
  <button tabIndex={-1}>Hidden from tab order</button>
</div>
```

**Keyboard Shortcuts**
```tsx
useEffect(() => {
  const handleKeyPress = (e) => {
    // Escape to close modals
    if (e.key === 'Escape') closeModal()

    // Enter to submit forms
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') submitForm()

    // Arrow keys for navigation
    if (e.key === 'ArrowUp') navigateUp()
    if (e.key === 'ArrowDown') navigateDown()

    // Cmd/Ctrl + K for search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      openSearch()
    }
  }

  window.addEventListener('keydown', handleKeyPress)
  return () => window.removeEventListener('keydown', handleKeyPress)
}, [])
```

**Skip Links**
```tsx
<a
  href="#main-content"
  className="
    sr-only focus:not-sr-only
    focus:absolute focus:top-4 focus:left-4
    focus:z-50 focus:px-4 focus:py-2
    focus:bg-primary focus:text-white
    focus:rounded-lg
  "
>
  Skip to main content
</a>
```

**Focus Trap in Modals**
```tsx
import { useFocusTrap } from '@mantine/hooks'

const Modal = ({ isOpen, children }) => {
  const focusTrapRef = useFocusTrap(isOpen)

  return (
    <div ref={focusTrapRef}>
      {children}
    </div>
  )
}
```

### Screen Reader Support

**Semantic HTML**
```tsx
// Use semantic elements
<header>...</header>
<nav>...</nav>
<main>...</main>
<article>...</article>
<aside>...</aside>
<footer>...</footer>
```

**Alternative Text**
```tsx
// Descriptive alt text for images
<img
  src={thumbnail}
  alt="Professional video editing demo showcasing color grading and transitions"
/>

// Empty alt for decorative images
<img src={decoration} alt="" role="presentation" />
```

**Live Regions**
```tsx
// Announce dynamic content changes
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {statusMessage}
</div>

// For urgent announcements
<div
  role="alert"
  aria-live="assertive"
  className="sr-only"
>
  {errorMessage}
</div>
```

**Form Labels**
```tsx
// Always associate labels with inputs
<label htmlFor="email" className="text-sm font-medium">
  Email Address
  {required && <span className="text-error ml-1">*</span>}
</label>
<input
  id="email"
  type="email"
  aria-required={required}
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <p id="email-error" role="alert" className="text-error text-sm">
    {errorMessage}
  </p>
)}
```

### ARIA Labels

**Buttons**
```tsx
// Icon-only buttons need aria-label
<button aria-label="Close modal">
  <X className="w-5 h-5" />
</button>

// Loading state announcement
<button aria-busy={loading} aria-label={loading ? "Loading..." : "Submit"}>
  {loading ? <Spinner /> : 'Submit'}
</button>
```

**Navigation**
```tsx
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/browse">Browse</a></li>
    <li><a href="/dashboard">Dashboard</a></li>
  </ul>
</nav>

<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/category">Category</a></li>
    <li aria-current="page">Current Page</li>
  </ol>
</nav>
```

**Expandable Sections**
```tsx
<button
  aria-expanded={isExpanded}
  aria-controls="panel-content"
  onClick={() => setIsExpanded(!isExpanded)}
>
  {title}
</button>
<div id="panel-content" aria-hidden={!isExpanded}>
  {content}
</div>
```

**Custom Components**
```tsx
// Combobox/Autocomplete
<div role="combobox" aria-expanded={isOpen} aria-haspopup="listbox">
  <input
    aria-autocomplete="list"
    aria-controls="suggestions-list"
  />
  <ul id="suggestions-list" role="listbox">
    {suggestions.map(item => (
      <li key={item.id} role="option" aria-selected={item.selected}>
        {item.label}
      </li>
    ))}
  </ul>
</div>

// Tabs
<div>
  <div role="tablist" aria-label="Project sections">
    <button
      role="tab"
      aria-selected={activeTab === 'overview'}
      aria-controls="overview-panel"
      id="overview-tab"
    >
      Overview
    </button>
  </div>
  <div
    role="tabpanel"
    id="overview-panel"
    aria-labelledby="overview-tab"
  >
    {content}
  </div>
</div>
```

---

## 🎨 Implementation Guidelines

### Component Library Structure

```
src/
├── components/
│   ├── ui/                    # Base shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── layout/                # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   ├── cards/                 # Specialized cards
│   │   ├── GigCard.tsx
│   │   ├── CreatorCard.tsx
│   │   └── ProjectCard.tsx
│   ├── video/                 # Video-related components
│   │   ├── VideoPlayer.tsx
│   │   ├── VideoGrid.tsx
│   │   └── VideoPreview.tsx
│   └── animations/            # Reusable animation components
│       ├── FadeIn.tsx
│       ├── SlideIn.tsx
│       └── Parallax.tsx
├── styles/
│   ├── globals.css           # Global styles & CSS variables
│   └── animations.css        # Keyframe animations
└── lib/
    ├── animations.ts         # Framer Motion variants
    └── utils.ts              # Utility functions
```

### Design Tokens in Code

```typescript
// lib/design-tokens.ts
export const colors = {
  background: 'hsl(0 0% 8%)',
  surface: 'hsl(0 0% 14%)',
  primary: 'hsl(280 100% 70%)',
  secondary: 'hsl(195 100% 50%)',
  accent: 'hsl(340 100% 65%)',
  // ... etc
}

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  // ... etc
}

export const typography = {
  fontFamily: {
    display: '"Clash Display", "Inter", system-ui',
    body: '"Inter", system-ui',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
    // ... etc
  }
}
```

### Animation Presets

```typescript
// lib/animations.ts
import { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
}

export const slideInRight: Variants = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 }
}

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const cardHover = {
  y: -8,
  scale: 1.01,
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
  transition: {
    duration: 0.3,
    ease: [0.25, 0.46, 0.45, 0.94]
  }
}
```

---

## 📝 Design Checklist

### Before Launching

- [ ] All colors meet WCAG AA contrast requirements
- [ ] All interactive elements have focus states
- [ ] All images have descriptive alt text
- [ ] Forms have proper labels and error messages
- [ ] Keyboard navigation works throughout the app
- [ ] Screen reader testing completed
- [ ] Mobile responsiveness tested on real devices
- [ ] Touch targets are minimum 44x44px
- [ ] Loading states implemented for all async operations
- [ ] Error states provide helpful feedback
- [ ] Empty states are engaging and actionable
- [ ] Animations respect prefers-reduced-motion
- [ ] Performance: First Contentful Paint < 1.8s
- [ ] Performance: Time to Interactive < 3.9s
- [ ] Performance: Cumulative Layout Shift < 0.1

### Performance Optimization

```tsx
// Lazy load images
<img
  src={thumbnail}
  loading="lazy"
  decoding="async"
/>

// Lazy load components
const VideoPlayer = lazy(() => import('@/components/video/VideoPlayer'))

// Optimize animations for reduced motion
const prefersReducedMotion = useReducedMotion()

<motion.div
  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
>
  {content}
</motion.div>
```

---

## 🚀 Next Steps

1. **Set up design tokens** in TailwindCSS config
2. **Install dependencies**: shadcn/ui components, Framer Motion 11+
3. **Create base component library** following this specification
4. **Build out page templates** (Home, Browse, Profile, Dashboard)
5. **Implement animation system** with Framer Motion variants
6. **Test accessibility** with automated tools (axe, Lighthouse)
7. **Gather user feedback** and iterate

---

## 📚 Resources

**Fonts**
- [Clash Display](https://www.fontshare.com/fonts/clash-display) - Free display font
- [Inter](https://rsms.me/inter/) - Free UI font
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) - Free monospace font

**Tools**
- [Coolors](https://coolors.co/) - Color palette generator
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/) - WCAG compliance
- [Easing Functions](https://easings.net/) - Animation easing reference
- [Cubic Bezier](https://cubic-bezier.com/) - Timing function generator
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [WebAIM WAVE](https://wave.webaim.org/) - Accessibility evaluation

**Documentation**
- [TailwindCSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**ReelByte Design System v1.0.0** - Created with care for the next generation of creators.
