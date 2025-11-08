import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RootLayout from '@/layouts/root-layout';
import { ProtectedRoute, AuthOnlyRoute } from '@/components/auth/protected-route';

// Lazy load pages for code splitting
const Home = lazy(() => import('@/pages/home'));
const BrowseGigs = lazy(() => import('@/pages/browse-gigs'));
const GigDetails = lazy(() => import('@/pages/gig-details'));
const Dashboard = lazy(() => import('@/pages/dashboard'));

// Auth pages
const Login = lazy(() => import('@/pages/auth/login'));
const Register = lazy(() => import('@/pages/auth/register'));
const ForgotPassword = lazy(() => import('@/pages/auth/forgot-password'));

// Loading component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

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
        ),
      },
      {
        path: 'gigs',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BrowseGigs />
          </Suspense>
        ),
      },
      {
        path: 'gigs/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <GigDetails />
          </Suspense>
        ),
      },
      // Legacy route for backward compatibility
      {
        path: 'browse',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BrowseGigs />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  // Auth routes (outside of main layout)
  {
    path: 'login',
    element: (
      <AuthOnlyRoute>
        <Suspense fallback={<PageLoader />}>
          <Login />
        </Suspense>
      </AuthOnlyRoute>
    ),
  },
  {
    path: 'register',
    element: (
      <AuthOnlyRoute>
        <Suspense fallback={<PageLoader />}>
          <Register />
        </Suspense>
      </AuthOnlyRoute>
    ),
  },
  {
    path: 'forgot-password',
    element: (
      <AuthOnlyRoute>
        <Suspense fallback={<PageLoader />}>
          <ForgotPassword />
        </Suspense>
      </AuthOnlyRoute>
    ),
  },
]);
