import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import * as authApi from '@/lib/api/auth';
import type { LoginCredentials, RegisterData, ForgotPasswordData } from '@/lib/api/auth';

/**
 * Hook for login functionality
 */
export function useLogin() {
  const navigate = useNavigate();
  const { login: setAuthData } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      setAuthData(data.user, data.token);
      navigate('/dashboard');
    },
  });
}

/**
 * Hook for registration functionality
 */
export function useRegister() {
  const navigate = useNavigate();
  const { login: setAuthData } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (data) => {
      // Auto-login after successful registration
      setAuthData(data.user, data.token);
      navigate('/dashboard');
    },
  });
}

/**
 * Hook for logout functionality
 */
export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout: clearAuthData } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuthData();
      queryClient.clear(); // Clear all cached queries
      navigate('/login');
    },
    onError: () => {
      // Still clear local data even if API call fails
      clearAuthData();
      queryClient.clear();
      navigate('/login');
    },
  });
}

/**
 * Hook for forgot password functionality
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => authApi.forgotPassword(data),
  });
}

/**
 * Hook to get current user data
 */
export function useCurrentUser() {
  const { token, user } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authApi.getCurrentUser(),
    enabled: !!token && !user, // Only fetch if we have a token but no user data
    staleTime: Infinity, // User data rarely changes
  });
}

/**
 * Hook to check authentication status
 */
export function useAuth() {
  const authStore = useAuthStore();
  const { data: currentUser, isLoading } = useCurrentUser();

  return {
    user: authStore.user || currentUser,
    isAuthenticated: authStore.isAuthenticated,
    isLoading,
    token: authStore.token,
  };
}
