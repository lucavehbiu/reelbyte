# ReelByte - Frontend Architecture Plan
*Last Updated: November 2025*

## Executive Summary
ReelByte is a mesmerizing, video-focused marketplace platform connecting clients with professional video content creators. Built with cutting-edge 2025 technologies, it emphasizes performance, modern aesthetics, and seamless user experience.

---

## 1. Tech Stack Details

### 1.1 Core Framework - React 19
**Key Features to Leverage:**
- **Server Components** - Use for static content, creator listings, and public profiles
- **Actions** - Form submissions, booking requests, payment processing
- **use() Hook** - Simplified data fetching with Suspense integration
- **Optimistic Updates** - Instant UI feedback for messaging, likes, bookings
- **Asset Loading API** - Preload critical video thumbnails and assets
- **Document Metadata** - Built-in SEO support via `<title>` and `<meta>` in components
- **useFormStatus & useFormState** - Enhanced form handling for complex multi-step flows

**Implementation Strategy:**
```jsx
// Example: Optimistic messaging
import { useOptimistic } from 'react';

function MessageThread({ messages }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, newMessage]
  );
  // ...
}
```

### 1.2 Build Tool - Vite 6
**Configuration Highlights:**

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', { target: '19' }]
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@types': path.resolve(__dirname, './src/types')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'vendor-animation': ['framer-motion'],
          'vendor-data': ['@tanstack/react-query', 'zustand']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
```

**Key Features:**
- Lightning-fast HMR (Hot Module Replacement)
- Native ESM support
- Optimized production builds
- CSS code splitting
- Plugin ecosystem for video optimization

### 1.3 Runtime - Bun
**Setup & Configuration:**

```bash
# Installation
curl -fsSL https://bun.sh/install | bash

# Initialize project
bun create vite reelbyte --template react-ts
cd reelbyte

# Install dependencies
bun install

# Development
bun run dev

# Build
bun run build

# Preview
bun run preview
```

**Package.json Scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit",
    "test": "bun test",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\""
  }
}
```

**Benefits:**
- 3-4x faster package installation
- Native TypeScript support
- Built-in test runner
- Reduced memory footprint
- Native bundler (optional alternative to Vite)

### 1.4 Styling - TailwindCSS v4

**Configuration:**
```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#8B5CF6',
          pink: '#EC4899',
          blue: '#3B82F6',
          dark: '#0F172A',
          light: '#F8FAFC'
        },
        accent: {
          gold: '#F59E0B',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter var', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ]
};
```

**Design System Utilities:**
- Custom glass-morphism classes
- Video player container styles
- Mesh gradient backgrounds
- Micro-interactions with Tailwind

### 1.5 UI Components - shadcn/ui

**Installation:**
```bash
bunx shadcn-ui@latest init
```

**Components to Install:**
```bash
bunx shadcn-ui@latest add button
bunx shadcn-ui@latest add card
bunx shadcn-ui@latest add dialog
bunx shadcn-ui@latest add dropdown-menu
bunx shadcn-ui@latest add input
bunx shadcn-ui@latest add label
bunx shadcn-ui@latest add tabs
bunx shadcn-ui@latest add avatar
bunx shadcn-ui@latest add badge
bunx shadcn-ui@latest add select
bunx shadcn-ui@latest add textarea
bunx shadcn-ui@latest add toast
bunx shadcn-ui@latest add tooltip
bunx shadcn-ui@latest add slider
bunx shadcn-ui@latest add progress
bunx shadcn-ui@latest add switch
bunx shadcn-ui@latest add radio-group
bunx shadcn-ui@latest add checkbox
bunx shadcn-ui@latest add separator
bunx shadcn-ui@latest add skeleton
bunx shadcn-ui@latest add scroll-area
bunx shadcn-ui@latest add popover
bunx shadcn-ui@latest add command
bunx shadcn-ui@latest add calendar
bunx shadcn-ui@latest add sheet
```

**Custom Theme Configuration:**
```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 262 83% 58%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 262 83% 58%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --primary: 262 83% 58%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 262 83% 58%;
  }
}
```

### 1.6 Animations - Framer Motion 11+

**Installation & Setup:**
```bash
bun add framer-motion
```

**Key Animation Patterns:**

```tsx
// Page transitions
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Stagger children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Scroll-triggered animations
import { useScroll, useTransform } from 'framer-motion';

function ParallaxSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return <motion.div style={{ y }} />;
}

// Gesture animations
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Book Now
</motion.button>
```

**Animation Library Structure:**
```
src/lib/animations/
├── page-transitions.ts
├── card-animations.ts
├── modal-animations.ts
├── list-animations.ts
├── scroll-animations.ts
└── gesture-animations.ts
```

### 1.7 State Management - Zustand

**Installation:**
```bash
bun add zustand
```

**Store Architecture:**

```typescript
// src/stores/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'creator' | 'client';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      }))
    }),
    { name: 'auth-storage' }
  )
);

// src/stores/cart-store.ts
interface CartItem {
  gigId: string;
  creatorId: string;
  packageType: 'basic' | 'standard' | 'premium';
  price: number;
  deliveryTime: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (gigId: string) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (gigId) => set((state) => ({
    items: state.items.filter((item) => item.gigId !== gigId)
  })),
  clearCart: () => set({ items: [] }),
  get total() {
    return get().items.reduce((sum, item) => sum + item.price, 0);
  }
}));

// src/stores/ui-store.ts
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'light',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme })
}));
```

### 1.8 Data Fetching - TanStack Query v5

**Installation:**
```bash
bun add @tanstack/react-query @tanstack/react-query-devtools
```

**Setup:**
```tsx
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

// src/App.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Query Hooks Pattern:**
```typescript
// src/hooks/queries/use-gigs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useGigs(filters?: GigFilters) {
  return useQuery({
    queryKey: ['gigs', filters],
    queryFn: () => api.gigs.getAll(filters)
  });
}

export function useGig(id: string) {
  return useQuery({
    queryKey: ['gig', id],
    queryFn: () => api.gigs.getById(id),
    enabled: !!id
  });
}

export function useCreateGig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.gigs.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
    }
  });
}

// src/hooks/queries/use-messages.ts
export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => api.messages.getByConversation(conversationId),
    refetchInterval: 5000 // Poll every 5 seconds
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.messages.send,
    onMutate: async (newMessage) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['messages', newMessage.conversationId] });

      const previousMessages = queryClient.getQueryData(['messages', newMessage.conversationId]);

      queryClient.setQueryData(['messages', newMessage.conversationId], (old: any) => [
        ...old,
        { ...newMessage, id: 'temp-' + Date.now(), status: 'sending' }
      ]);

      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      queryClient.setQueryData(
        ['messages', newMessage.conversationId],
        context?.previousMessages
      );
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
    }
  });
}
```

### 1.9 Routing - React Router v7

**Installation:**
```bash
bun add react-router-dom
```

**Router Configuration:**
```tsx
// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layouts
import RootLayout from '@/layouts/root-layout';
import DashboardLayout from '@/layouts/dashboard-layout';
import AuthLayout from '@/layouts/auth-layout';

// Pages (lazy loaded)
const Home = lazy(() => import('@/pages/home'));
const BrowseGigs = lazy(() => import('@/pages/browse-gigs'));
const GigDetails = lazy(() => import('@/pages/gig-details'));
const CreatorProfile = lazy(() => import('@/pages/creator-profile'));
const ClientDashboard = lazy(() => import('@/pages/client-dashboard'));
const CreatorDashboard = lazy(() => import('@/pages/creator-dashboard'));
const Messages = lazy(() => import('@/pages/messages'));
const Login = lazy(() => import('@/pages/auth/login'));
const Register = lazy(() => import('@/pages/auth/register'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: 'browse',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BrowseGigs />
          </Suspense>
        )
      },
      {
        path: 'gig/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <GigDetails />
          </Suspense>
        )
      },
      {
        path: 'creator/:username',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreatorProfile />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        path: 'client',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ClientDashboard />
          </Suspense>
        )
      },
      {
        path: 'creator',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreatorDashboard />
          </Suspense>
        )
      },
      {
        path: 'messages',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Messages />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        )
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Register />
          </Suspense>
        )
      }
    ]
  }
]);
```

---

## 2. Component Architecture

### 2.1 Page Structure

#### **Public Pages**
```
/                           - Landing page
/browse                     - Browse/search gigs
/browse?category=:cat       - Filtered by category
/browse?search=:query       - Search results
/gig/:id                    - Gig details page
/creator/:username          - Creator profile
/how-it-works               - Information page
/pricing                    - Platform pricing
/about                      - About page
/contact                    - Contact page
```

#### **Authenticated Pages**
```
/dashboard/client           - Client dashboard
/dashboard/client/orders    - Active orders
/dashboard/client/post-job  - Post new job
/dashboard/creator          - Creator dashboard
/dashboard/creator/gigs     - Manage gigs
/dashboard/creator/create   - Create new gig
/dashboard/creator/earnings - Earnings overview
/dashboard/messages         - Messaging interface
/dashboard/settings         - Account settings
/checkout/:gigId            - Checkout flow
```

#### **Authentication Pages**
```
/auth/login                 - Login page
/auth/register              - Registration
/auth/forgot-password       - Password recovery
/auth/verify-email          - Email verification
```

### 2.2 Layout Components

```
src/layouts/
├── root-layout.tsx         - Main layout (header, footer)
├── dashboard-layout.tsx    - Dashboard layout (sidebar, nav)
├── auth-layout.tsx         - Auth layout (centered card)
└── minimal-layout.tsx      - Minimal layout (checkout, onboarding)
```

**Root Layout Structure:**
```tsx
// src/layouts/root-layout.tsx
import { Outlet } from 'react-router-dom';
import Header from '@/components/navigation/header';
import Footer from '@/components/navigation/footer';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

### 2.3 Shared Components Library

#### **Navigation**
```
src/components/navigation/
├── header.tsx              - Main header (logo, nav, user menu)
├── footer.tsx              - Footer (links, social, newsletter)
├── mobile-nav.tsx          - Mobile navigation drawer
├── user-menu.tsx           - User dropdown menu
├── nav-link.tsx            - Active nav link component
└── breadcrumbs.tsx         - Breadcrumb navigation
```

#### **Cards**
```
src/components/cards/
├── gig-card.tsx            - Gig preview card
├── creator-card.tsx        - Creator profile card
├── project-card.tsx        - Project status card
├── review-card.tsx         - Review/testimonial card
├── stat-card.tsx           - Dashboard stat card
└── featured-card.tsx       - Featured content card
```

#### **Forms**
```
src/components/forms/
├── gig-creation-form/      - Multi-step gig creation
│   ├── index.tsx
│   ├── basic-info.tsx
│   ├── pricing.tsx
│   ├── gallery.tsx
│   └── requirements.tsx
├── job-post-form.tsx       - Client job posting
├── profile-edit-form.tsx   - Profile editing
├── message-form.tsx        - Message composition
├── review-form.tsx         - Review submission
└── search-form.tsx         - Advanced search
```

#### **Media**
```
src/components/media/
├── video-player.tsx        - Custom video player
├── video-thumbnail.tsx     - Video thumbnail with play overlay
├── video-gallery.tsx       - Video portfolio gallery
├── image-upload.tsx        - Drag-n-drop image uploader
├── video-upload.tsx        - Video upload with progress
├── media-preview.tsx       - Media preview modal
└── avatar.tsx              - User avatar component
```

#### **Messaging**
```
src/components/messaging/
├── conversation-list.tsx   - List of conversations
├── conversation-item.tsx   - Single conversation preview
├── message-thread.tsx      - Message thread view
├── message-bubble.tsx      - Individual message
├── message-input.tsx       - Message composition input
├── typing-indicator.tsx    - "User is typing..." indicator
└── file-attachment.tsx     - File attachment component
```

#### **Dashboard**
```
src/components/dashboard/
├── stats-overview.tsx      - Stats grid
├── recent-activity.tsx     - Activity feed
├── earnings-chart.tsx      - Earnings visualization
├── order-list.tsx          - Order management list
├── gig-manager.tsx         - Gig management interface
├── sidebar.tsx             - Dashboard sidebar
└── quick-actions.tsx       - Quick action buttons
```

#### **UI Elements**
```
src/components/ui/
├── [shadcn components]     - All shadcn/ui components
├── loading-spinner.tsx     - Loading indicator
├── page-loader.tsx         - Full page loader
├── empty-state.tsx         - Empty state component
├── error-boundary.tsx      - Error boundary wrapper
├── confirmation-modal.tsx  - Confirmation dialog
├── star-rating.tsx         - Star rating display/input
├── price-tag.tsx           - Price display component
├── delivery-badge.tsx      - Delivery time badge
└── status-badge.tsx        - Status indicator badge
```

### 2.4 shadcn/ui Components Usage Map

| Component | Primary Use Cases |
|-----------|------------------|
| Button | CTAs, form submissions, actions |
| Card | Gig cards, stat cards, content containers |
| Dialog | Modals, confirmations, video previews |
| Dropdown Menu | User menu, action menus, filters |
| Input | Form fields, search bars |
| Label | Form labels |
| Tabs | Dashboard sections, profile sections |
| Avatar | User avatars, creator thumbnails |
| Badge | Status indicators, category tags |
| Select | Dropdowns, filters |
| Textarea | Message input, descriptions |
| Toast | Notifications, success/error messages |
| Tooltip | Help text, info tooltips |
| Slider | Price range, video timeline |
| Progress | Upload progress, order progress |
| Switch | Settings toggles, preferences |
| Radio Group | Payment methods, package selection |
| Checkbox | Agreement checkboxes, multi-select |
| Separator | Content dividers |
| Skeleton | Loading states |
| Scroll Area | Long content areas, message threads |
| Popover | Info popovers, quick actions |
| Command | Search command palette |
| Calendar | Date selection, booking |
| Sheet | Mobile menus, filters sidebar |

### 2.5 Custom Components Needed

#### **VideoPlayer**
```tsx
// src/components/media/video-player.tsx
import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
}

export function VideoPlayer({ src, poster, autoplay, controls, className }: VideoPlayerProps) {
  // Custom controls implementation
  // Progress bar, volume control, fullscreen
  // Optimized for portfolio video playback
}
```

#### **GigPackageSelector**
```tsx
// src/components/gig/package-selector.tsx
interface Package {
  type: 'basic' | 'standard' | 'premium';
  name: string;
  price: number;
  deliveryTime: number;
  features: string[];
  revisions: number;
}

export function GigPackageSelector({ packages, onSelect }: Props) {
  // Interactive package comparison
  // Highlight differences between tiers
  // Smooth transitions between selections
}
```

#### **MessageThread**
```tsx
// src/components/messaging/message-thread.tsx
export function MessageThread({ conversationId }: Props) {
  // Real-time message updates
  // Infinite scroll for history
  // Typing indicators
  // Read receipts
  // File attachments
}
```

#### **SearchFilters**
```tsx
// src/components/search/search-filters.tsx
export function SearchFilters({ onFilterChange }: Props) {
  // Category selection
  // Price range slider
  // Delivery time
  // Creator level
  // Rating filter
  // Video duration
}
```

---

## 3. Features List

### 3.1 Homepage

#### **Hero Section**
- Mesmerizing gradient background with animated mesh
- Headline: "Find Your Perfect Video Creator"
- Search bar with category suggestions
- Primary CTA: "Browse Creators" / "Start Selling"
- Video background loop (muted, auto-play)
- Floating elements (Framer Motion)

#### **Featured Creators**
- Carousel/grid of top-rated creators
- Video thumbnail previews on hover
- Creator stats (rating, completed projects)
- "View Profile" CTA
- Auto-rotating carousel

#### **Categories Section**
- Visual category cards with icons
- Popular categories: YouTube Editing, Reels, Ads, Music Videos, Animation, etc.
- Hover animations (scale, glow effects)
- Link to browse by category

#### **How It Works**
- 3-step visual guide
- For Clients: Post → Review → Hire
- For Creators: Create Gig → Get Orders → Deliver
- Animated step transitions
- Interactive demo

#### **Featured Gigs**
- Grid of trending/featured gigs
- Video thumbnails with play on hover
- Starting price, delivery time, rating
- Quick view modal
- "See More" button

#### **Statistics Section**
- Animated counters (Framer Motion)
- Total creators, projects completed, client satisfaction
- Visual impact with large numbers
- Gradient backgrounds

#### **Testimonials**
- Rotating testimonial cards
- Client and creator testimonials
- Avatar, name, role
- 5-star ratings
- Video testimonials (optional)

#### **CTA Section**
- Different CTAs for creators vs clients
- "Start Selling Today" / "Find Your Creator"
- Background video or gradient
- Sign-up form or button

### 3.2 Browse/Search Gigs

#### **Search Interface**
- Prominent search bar
- Auto-complete suggestions
- Recent searches
- Filter button (opens sidebar)

#### **Filter Sidebar**
- Category checkboxes
- Price range slider
- Delivery time options
- Creator level (New, Level 1, Level 2, Top Rated)
- Rating filter (4+ stars, etc.)
- Video duration
- Language
- "Apply Filters" button
- "Clear All" option

#### **Gig Grid/List View**
- Toggle between grid/list views
- Gig cards with:
  - Video thumbnail (play on hover)
  - Creator avatar and name
  - Gig title
  - Rating and review count
  - Starting price
  - Delivery time badge
  - Favorite/Save button
- Infinite scroll or pagination
- Skeleton loaders

#### **Sort Options**
- Relevance (default)
- Price: Low to High
- Price: High to Low
- Delivery Time
- Best Selling
- Newest

### 3.3 Gig Details Page

#### **Video Gallery**
- Primary video player (autoplay on load)
- Thumbnail gallery (additional samples)
- Full-screen video modal
- Video timeline scrubber

#### **Gig Information**
- Title and description
- Category tags
- Creator info card (avatar, name, level, rating)
- "Contact Me" button

#### **Pricing Packages**
- Tabbed interface (Basic, Standard, Premium)
- Package comparison table
- Features list with checkmarks
- Price and delivery time prominent
- "Order Now" button
- Add-ons/extras section

#### **Reviews Section**
- Overall rating statistics
- Star distribution chart
- Individual reviews with:
  - Client avatar and name
  - Rating
  - Review text
  - Date
  - Helpful votes
- Sort by: Most Recent, Most Helpful
- Pagination

#### **About the Creator**
- Bio/description
- Member since date
- Languages
- Skills/specializations
- Response time
- "View Full Profile" link

#### **FAQ Section**
- Common questions about this gig
- Expandable accordion

#### **Related Gigs**
- "You might also like" section
- Similar gigs carousel

### 3.4 Creator Profile

#### **Profile Header**
- Cover image/video
- Profile avatar
- Creator name and tagline
- Level badge (New, Level 1, Level 2, Top Rated)
- Rating and review count
- Location and timezone
- "Contact Me" button
- Social media links

#### **Video Portfolio**
- Featured video showcase
- Grid of portfolio videos
- Play videos in modal
- Filter by category/project type

#### **About Section**
- Bio/description
- Skills and expertise
- Years of experience
- Education
- Certifications

#### **Services/Gigs**
- Grid of active gigs
- Same format as browse page cards
- "View All Gigs" button

#### **Reviews**
- Overall rating stats
- Recent reviews
- Filter by star rating
- "See All Reviews" link

#### **Stats Overview**
- Projects completed
- On-time delivery rate
- Response time
- Member since

### 3.5 Client Dashboard

#### **Overview Tab**
- Welcome message
- Active orders count
- Pending requests
- Messages unread count
- Recent activity feed
- Quick actions (Post a Job, Browse Gigs)

#### **Active Orders**
- List/grid of current orders
- Order status (In Progress, Delivered, Revision, Completed)
- Creator info
- Deadline countdown
- Quick actions (Message Creator, Request Revision, Approve)
- Order details modal

#### **Post a Job**
- Multi-step form:
  1. Job details (title, description, category)
  2. Budget and timeline
  3. Requirements/deliverables
  4. Review and post
- Save as draft option
- File attachments for references

#### **Saved Gigs**
- Gigs the client has favorited
- Quick access to saved creators

#### **Transaction History**
- Past orders
- Payment receipts
- Invoices download
- Filter by date range

### 3.6 Creator Dashboard

#### **Overview Tab**
- Earnings overview (today, this week, this month)
- Active orders count
- Pending order requests
- Gig views and clicks
- Conversion rate
- Quick actions (Create Gig, View Messages)

#### **Active Projects**
- Orders in progress
- Client info
- Deadline
- Project details
- Delivery upload interface
- Message client

#### **My Gigs**
- List of all gigs (active, paused, draft)
- Performance stats per gig (views, orders, conversion)
- Edit/pause/delete options
- Duplicate gig feature
- Create new gig button

#### **Gig Creation/Editing**
- Multi-step form:
  1. Basic info (title, category, tags)
  2. Pricing & packages (3 tiers)
  3. Description & FAQ
  4. Requirements from buyer
  5. Gallery (images, videos)
  6. Publish settings
- Preview mode
- Save as draft

#### **Earnings**
- Total earnings (all-time, monthly, weekly)
- Available for withdrawal
- Pending clearance
- Earnings chart/graph
- Withdraw funds interface
- Transaction history

#### **Analytics**
- Gig performance metrics
- Traffic sources
- Conversion funnel
- Top-performing gigs
- Buyer demographics (if available)

### 3.7 Messaging Interface

#### **Conversation List** (Left Sidebar)
- Search conversations
- Filter (All, Unread, Archived)
- Conversation items with:
  - Other user avatar
  - Name
  - Last message preview
  - Timestamp
  - Unread indicator
- Infinite scroll

#### **Message Thread** (Main Area)
- Conversation header:
  - User info
  - Order reference (if applicable)
  - Quick actions dropdown
- Message bubbles:
  - Timestamp
  - Read receipts
  - File attachments
- Typing indicator
- Message input:
  - Text area
  - File attachment button
  - Send button (or Enter key)
  - Character limit indicator

#### **Order Context Panel** (Right Sidebar, optional)
- Related order details
- Deadline countdown
- Quick links to order page
- Delivery upload shortcut

### 3.8 Checkout Flow

#### **Order Summary**
- Gig details
- Selected package
- Add-ons/extras
- Subtotal
- Service fee
- Total price
- Delivery date estimate

#### **Requirements from Buyer**
- Form based on creator's requirements
- File uploads
- Text inputs
- Additional instructions

#### **Payment Method**
- Credit/debit card
- PayPal
- Other payment options
- Saved payment methods
- Add new payment method

#### **Order Confirmation**
- Success message
- Order number
- Next steps
- "Go to Dashboard" CTA
- "Message Creator" CTA

### 3.9 Review System

#### **Leave a Review** (After Order Completion)
- Star rating (1-5)
- Review text area
- Aspects to rate:
  - Communication
  - Service as described
  - Buy/hire again?
- Submit review
- Skip for now option

#### **Review Display**
- Public reviews on gig pages
- Review responses from creator (optional)
- Helpful/Not helpful votes
- Report inappropriate review

---

## 4. Project Structure

### 4.1 Directory Organization

```
reelbyte/
├── public/
│   ├── videos/              # Sample videos
│   ├── images/              # Static images
│   └── favicon.ico
├── src/
│   ├── assets/              # Images, icons, fonts
│   │   ├── icons/
│   │   ├── images/
│   │   └── fonts/
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── navigation/      # Nav components
│   │   ├── cards/           # Card components
│   │   ├── forms/           # Form components
│   │   ├── media/           # Media components
│   │   ├── messaging/       # Messaging components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── search/          # Search components
│   │   └── gig/             # Gig-specific components
│   ├── pages/               # Page components
│   │   ├── home.tsx
│   │   ├── browse-gigs.tsx
│   │   ├── gig-details.tsx
│   │   ├── creator-profile.tsx
│   │   ├── client-dashboard.tsx
│   │   ├── creator-dashboard.tsx
│   │   ├── messages.tsx
│   │   ├── checkout.tsx
│   │   └── auth/
│   │       ├── login.tsx
│   │       └── register.tsx
│   ├── layouts/             # Layout components
│   │   ├── root-layout.tsx
│   │   ├── dashboard-layout.tsx
│   │   ├── auth-layout.tsx
│   │   └── minimal-layout.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── queries/         # TanStack Query hooks
│   │   │   ├── use-gigs.ts
│   │   │   ├── use-creators.ts
│   │   │   ├── use-orders.ts
│   │   │   └── use-messages.ts
│   │   ├── use-auth.ts
│   │   ├── use-media-upload.ts
│   │   ├── use-debounce.ts
│   │   └── use-intersection-observer.ts
│   ├── stores/              # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── cart-store.ts
│   │   ├── ui-store.ts
│   │   └── message-store.ts
│   ├── lib/                 # Utility libraries
│   │   ├── api/             # API client
│   │   │   ├── client.ts
│   │   │   ├── gigs.ts
│   │   │   ├── users.ts
│   │   │   ├── orders.ts
│   │   │   └── messages.ts
│   │   ├── animations/      # Framer Motion variants
│   │   │   ├── page-transitions.ts
│   │   │   ├── card-animations.ts
│   │   │   └── scroll-animations.ts
│   │   ├── utils.ts         # Utility functions
│   │   ├── cn.ts            # Class name utility
│   │   ├── validators.ts    # Form validators
│   │   └── constants.ts     # App constants
│   ├── types/               # TypeScript types
│   │   ├── gig.ts
│   │   ├── user.ts
│   │   ├── order.ts
│   │   ├── message.ts
│   │   └── index.ts
│   ├── routes/              # Route configuration
│   │   └── index.tsx
│   ├── styles/              # Global styles
│   │   └── globals.css
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts        # Vite types
├── .env.example             # Environment variables template
├── .env.local               # Local environment (gitignored)
├── .eslintrc.cjs            # ESLint configuration
├── .gitignore
├── .prettierrc              # Prettier configuration
├── bun.lockb                # Bun lock file
├── components.json          # shadcn/ui config
├── index.html               # HTML template
├── package.json
├── postcss.config.js        # PostCSS config
├── README.md
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript config
└── vite.config.ts           # Vite configuration
```

### 4.2 File Naming Conventions

#### **Components**
- PascalCase for component files: `GigCard.tsx`, `VideoPlayer.tsx`
- Kebab-case for directories: `gig-card/`, `video-player/`
- Index files for complex components: `gig-creation-form/index.tsx`

#### **Hooks**
- Prefix with `use`: `useAuth.ts`, `useGigs.ts`
- Kebab-case: `use-media-upload.ts`

#### **Utilities**
- Kebab-case: `api-client.ts`, `format-date.ts`
- Descriptive names: `validators.ts`, `constants.ts`

#### **Types**
- Singular nouns: `user.ts`, `gig.ts`, `order.ts`
- PascalCase for type names: `User`, `Gig`, `Order`

#### **Pages**
- Kebab-case: `browse-gigs.tsx`, `creator-profile.tsx`
- Match route structure

#### **Stores**
- Suffix with `-store`: `auth-store.ts`, `ui-store.ts`

### 4.3 Code Organization Best Practices

#### **Component Structure**
```tsx
// 1. Imports
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 2. Types/Interfaces
interface GigCardProps {
  gig: Gig;
  featured?: boolean;
  className?: string;
}

// 3. Component
export function GigCard({ gig, featured, className }: GigCardProps) {
  // 4. Hooks
  const [isHovered, setIsHovered] = useState(false);

  // 5. Derived state
  const formattedPrice = formatCurrency(gig.price);

  // 6. Event handlers
  const handleClick = () => {
    // ...
  };

  // 7. Render
  return (
    <motion.div
      className={cn('gig-card', featured && 'featured', className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Component JSX */}
    </motion.div>
  );
}
```

#### **API Organization**
```typescript
// src/lib/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
});

// src/lib/api/gigs.ts
import { apiClient } from './client';
import type { Gig, GigFilters } from '@/types';

export const gigsApi = {
  getAll: (filters?: GigFilters) =>
    apiClient.get<Gig[]>('/gigs', { params: filters }),

  getById: (id: string) =>
    apiClient.get<Gig>(`/gigs/${id}`),

  create: (data: CreateGigInput) =>
    apiClient.post<Gig>('/gigs', data),

  update: (id: string, data: UpdateGigInput) =>
    apiClient.patch<Gig>(`/gigs/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/gigs/${id}`)
};
```

---

## 5. Performance Optimization

### 5.1 Code Splitting

#### **Route-based Splitting**
```tsx
// Already implemented via lazy loading in routes
const BrowseGigs = lazy(() => import('@/pages/browse-gigs'));
```

#### **Component-based Splitting**
```tsx
// Heavy components loaded on-demand
const VideoEditor = lazy(() => import('@/components/media/video-editor'));
const ChartDashboard = lazy(() => import('@/components/dashboard/charts'));

function Dashboard() {
  return (
    <Suspense fallback={<Skeleton />}>
      <ChartDashboard />
    </Suspense>
  );
}
```

#### **Vendor Splitting** (Vite Config)
```js
manualChunks: {
  'vendor-react': ['react', 'react-dom', 'react-router-dom'],
  'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  'vendor-animation': ['framer-motion'],
  'vendor-data': ['@tanstack/react-query', 'zustand']
}
```

### 5.2 Lazy Loading

#### **Images**
```tsx
// Use native lazy loading
<img src={thumbnail} alt={title} loading="lazy" />

// Or intersection observer for custom logic
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

function LazyImage({ src, alt }: Props) {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div ref={ref}>
      {isVisible && <img src={src} alt={alt} />}
    </div>
  );
}
```

#### **Videos**
```tsx
// Load video on interaction
function VideoThumbnail({ videoUrl, poster }: Props) {
  const [shouldLoad, setShouldLoad] = useState(false);

  return (
    <div onMouseEnter={() => setShouldLoad(true)}>
      {shouldLoad ? (
        <video src={videoUrl} poster={poster} />
      ) : (
        <img src={poster} alt="Video thumbnail" />
      )}
    </div>
  );
}
```

#### **Infinite Scroll**
```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

function GigList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['gigs'],
    queryFn: ({ pageParam = 1 }) => fetchGigs(pageParam),
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor
  });

  const [ref] = useIntersectionObserver({
    onIntersect: () => hasNextPage && fetchNextPage()
  });

  return (
    <>
      {data?.pages.map(page =>
        page.gigs.map(gig => <GigCard key={gig.id} gig={gig} />)
      )}
      <div ref={ref}>{isFetchingNextPage && <Spinner />}</div>
    </>
  );
}
```

### 5.3 Image/Video Optimization

#### **Image Optimization**
```tsx
// Use modern formats (WebP, AVIF)
<picture>
  <source srcSet={imageAvif} type="image/avif" />
  <source srcSet={imageWebp} type="image/webp" />
  <img src={imageJpg} alt={alt} />
</picture>

// Responsive images
<img
  src={imageSrc}
  srcSet={`
    ${imageSm} 400w,
    ${imageMd} 800w,
    ${imageLg} 1200w
  `}
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  alt={alt}
/>
```

#### **Video Optimization**
```tsx
// Adaptive streaming (HLS/DASH)
import Hls from 'hls.js';

function VideoPlayer({ src }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
    }
  }, [src]);

  return <video ref={videoRef} />;
}

// Video preload strategy
<video preload="metadata" poster={poster}>
  <source src={video} type="video/mp4" />
</video>
```

#### **Thumbnail Generation**
- Generate multiple thumbnail sizes server-side
- Use low-quality image placeholders (LQIP)
- Implement blur-up technique

```tsx
function ProgressiveImage({ src, placeholder }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative">
      <img
        src={placeholder}
        alt=""
        className={cn('blur-sm', loaded && 'hidden')}
      />
      <img
        src={src}
        alt=""
        onLoad={() => setLoaded(true)}
        className={cn('transition-opacity', !loaded && 'opacity-0')}
      />
    </div>
  );
}
```

### 5.4 Bundle Size Optimization

#### **Tree Shaking**
```js
// Import only what you need
import { formatDistance } from 'date-fns/formatDistance';
// Instead of: import { formatDistance } from 'date-fns';

// Use named imports
import { Button } from '@/components/ui/button';
// Instead of: import * as UI from '@/components/ui';
```

#### **Bundle Analysis**
```bash
# Install bundle analyzer
bun add -d rollup-plugin-visualizer

# vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
});
```

#### **Dynamic Imports**
```tsx
// Load heavy libraries on-demand
const handleExport = async () => {
  const { exportToPDF } = await import('@/lib/export-pdf');
  exportToPDF(data);
};

// Conditional imports
if (isAdmin) {
  const AdminPanel = (await import('@/components/admin-panel')).default;
}
```

#### **Remove Unused Dependencies**
```bash
# Audit dependencies
bun pm ls

# Remove unused packages
bun remove <package-name>
```

### 5.5 Performance Monitoring

#### **Web Vitals**
```tsx
// src/lib/web-vitals.ts
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

export function reportWebVitals() {
  onCLS(console.log);
  onFID(console.log);
  onFCP(console.log);
  onLCP(console.log);
  onTTFB(console.log);
}

// src/main.tsx
reportWebVitals();
```

#### **React Profiler**
```tsx
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number
) {
  console.log({ id, phase, actualDuration });
}

<Profiler id="GigList" onRender={onRenderCallback}>
  <GigList />
</Profiler>
```

### 5.6 Caching Strategies

#### **Service Worker** (Optional)
```tsx
// Use Vite PWA plugin for advanced caching
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.reelbyte\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300 // 5 minutes
              }
            }
          }
        ]
      }
    })
  ]
});
```

#### **React Query Caching**
```tsx
// Already configured in queryClient
staleTime: 1000 * 60 * 5, // 5 minutes
gcTime: 1000 * 60 * 10, // 10 minutes
```

#### **CDN for Static Assets**
- Host images, videos on CDN (Cloudflare, AWS CloudFront)
- Use CDN URLs in production
- Enable browser caching headers

---

## 6. Additional Considerations

### 6.1 Accessibility (a11y)

- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **ARIA Labels**: Proper labeling for screen readers
- **Color Contrast**: WCAG AA compliance minimum
- **Focus Management**: Visible focus indicators, focus trapping in modals
- **Alt Text**: Meaningful alt text for all images
- **Video Captions**: Support for video subtitles/captions

### 6.2 SEO Optimization

- **React Helmet Async**: Dynamic meta tags per page
- **Structured Data**: JSON-LD for gigs, creators, reviews
- **Open Graph**: Social media sharing previews
- **Sitemap**: Auto-generated sitemap.xml
- **Robots.txt**: Proper crawling directives
- **Canonical URLs**: Prevent duplicate content

```tsx
import { Helmet } from 'react-helmet-async';

function GigDetails({ gig }: Props) {
  return (
    <>
      <Helmet>
        <title>{gig.title} | ReelByte</title>
        <meta name="description" content={gig.description} />
        <meta property="og:title" content={gig.title} />
        <meta property="og:description" content={gig.description} />
        <meta property="og:image" content={gig.thumbnail} />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": gig.title,
            "description": gig.description,
            "image": gig.thumbnail,
            "offers": {
              "@type": "Offer",
              "price": gig.price,
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>
      {/* Page content */}
    </>
  );
}
```

### 6.3 Error Handling

```tsx
// Global error boundary
function ErrorBoundary({ children }: Props) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log to error tracking service (Sentry, etc.)
        console.error(error, errorInfo);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

// Query error handling
function GigList() {
  const { data, error, isError } = useGigs();

  if (isError) {
    return <ErrorState error={error} retry={refetch} />;
  }

  return <>{/* Render gigs */}</>;
}
```

### 6.4 Testing Strategy

```bash
# Testing libraries
bun add -d vitest @testing-library/react @testing-library/jest-dom
bun add -d @testing-library/user-event happy-dom
```

**Test Types:**
- Unit tests for utilities, hooks
- Component tests for UI components
- Integration tests for user flows
- E2E tests with Playwright (optional)

### 6.5 Environment Variables

```bash
# .env.example
VITE_API_URL=https://api.reelbyte.com
VITE_WS_URL=wss://ws.reelbyte.com
VITE_CDN_URL=https://cdn.reelbyte.com
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_GOOGLE_CLIENT_ID=...
VITE_ENABLE_ANALYTICS=true
```

---

## 7. Development Workflow

### 7.1 Getting Started

```bash
# Clone repo
git clone <repo-url>
cd reelbyte

# Install dependencies
bun install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
bun run dev

# Open http://localhost:3000
```

### 7.2 Development Commands

```bash
# Development
bun run dev           # Start dev server
bun run build         # Build for production
bun run preview       # Preview production build
bun run lint          # Lint code
bun run type-check    # TypeScript type checking
bun run format        # Format code with Prettier
bun run test          # Run tests
```

### 7.3 Git Workflow

- **Main branch**: Production-ready code
- **Develop branch**: Integration branch
- **Feature branches**: `feature/gig-creation`, `feature/messaging`
- **Commit conventions**: Conventional Commits (feat:, fix:, docs:, etc.)

### 7.4 Code Quality Tools

```json
// .eslintrc.cjs
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
};

// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## 8. Deployment Strategy

### 8.1 Build Optimization

```bash
# Production build
bun run build

# Output: dist/
# - Minified JS/CSS
# - Optimized assets
# - Source maps (optional)
```

### 8.2 Hosting Options

- **Vercel**: Zero-config deployment, edge functions
- **Netlify**: Continuous deployment, edge handlers
- **AWS Amplify**: Full AWS integration
- **Cloudflare Pages**: Global edge network

### 8.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run lint
      - run: bun run type-check
      - run: bun run build
      - uses: vercel/action@v2
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 9. Next Steps

### Phase 1: Foundation (Week 1-2)
1. Set up project with Vite + Bun
2. Configure TailwindCSS v4 + shadcn/ui
3. Implement routing with React Router v7
4. Set up Zustand stores
5. Configure TanStack Query
6. Create base layouts

### Phase 2: Core Pages (Week 3-4)
1. Build homepage with hero and featured sections
2. Implement browse/search functionality
3. Create gig details page
4. Build creator profile page
5. Add authentication pages

### Phase 3: Dashboards (Week 5-6)
1. Client dashboard with order management
2. Creator dashboard with gig management
3. Messaging interface
4. Analytics and earnings

### Phase 4: Polish (Week 7-8)
1. Framer Motion animations throughout
2. Performance optimization
3. Accessibility improvements
4. SEO implementation
5. Testing and bug fixes

### Phase 5: Launch Prep
1. Final performance audit
2. Security review
3. Documentation
4. Deployment setup
5. Monitoring and analytics

---

## Conclusion

This frontend architecture plan provides a comprehensive roadmap for building ReelByte, a mesmerizing video-focused marketplace. By leveraging the latest 2025 technologies including React 19, Vite 6, Bun runtime, TailwindCSS v4, and Framer Motion 11+, the platform will deliver exceptional performance and user experience.

The modular component architecture, combined with robust state management and data fetching strategies, ensures scalability and maintainability. Performance optimizations, including code splitting, lazy loading, and caching strategies, will keep the application lightweight and fast.

**Key Success Factors:**
- Modern, mesmerizing design using Framer Motion and TailwindCSS
- Lightning-fast performance with Vite and Bun
- Type-safe development with TypeScript
- Scalable component architecture
- Optimized for video content delivery
- Excellent developer experience

**Technology Advantages:**
- React 19: Server Components, Actions, optimistic updates
- Vite 6: Fastest build tool, native ESM
- Bun: 3-4x faster than npm, native TypeScript
- TailwindCSS v4: Utility-first styling, modern design system
- shadcn/ui: Beautiful, accessible components
- Framer Motion 11+: Smooth, performant animations
- Zustand: Lightweight state management
- TanStack Query v5: Powerful data synchronization
- React Router v7: Modern routing with data loading

This plan serves as both a technical specification and implementation guide. Refer to it throughout development to maintain consistency and ensure all requirements are met.

**Happy coding!**
