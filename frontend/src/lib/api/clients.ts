import { apiClient } from './client';
import type { ClientProfile } from '@/types';

/**
 * Fetch a single client profile by ID
 */
export async function fetchClientProfile(clientId: string): Promise<ClientProfile> {
  const response = await apiClient.get<ClientProfile>(`/clients/${clientId}`);
  return response.data;
}
