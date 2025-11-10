import { useQuery } from '@tanstack/react-query';
import { fetchClientProfile } from '@/lib/api/clients';

/**
 * Hook for fetching a single client profile by ID
 */
export function useClientProfile(clientId: string | undefined) {
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: () => fetchClientProfile(clientId!),
    enabled: !!clientId, // Only fetch if clientId is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
