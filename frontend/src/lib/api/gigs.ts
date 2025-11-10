import { apiClient } from './client';
import type { Gig, GigFilters, Creator, Review } from '@/types';

export interface GigWithCreator extends Gig {
  creator: Creator;
}

export interface GigsResponse {
  gigs: GigWithCreator[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GigDetailsResponse extends GigWithCreator {
  reviews: Review[];
}

/**
 * Fetch gigs with optional filters and pagination
 */
export async function fetchGigs(
  filters?: GigFilters,
  page: number = 1,
  pageSize: number = 12
): Promise<GigsResponse> {
  const params = new URLSearchParams();

  if (filters?.category) params.append('category', filters.category);
  if (filters?.minPrice) params.append('min_price', filters.minPrice.toString());
  if (filters?.maxPrice) params.append('max_price', filters.maxPrice.toString());
  if (filters?.search) params.append('search', filters.search);

  // Backend uses skip/limit instead of page/pageSize
  const skip = (page - 1) * pageSize;
  params.append('skip', skip.toString());
  params.append('limit', pageSize.toString());
  params.append('status', 'active'); // Only show active gigs

  const response = await apiClient.get<any>(`/gigs?${params.toString()}`);

  // Adapt backend response to frontend format
  const backendData = response.data;
  const totalPages = Math.ceil(backendData.total / pageSize);

  return {
    gigs: backendData.gigs || [],
    total: backendData.total || 0,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Fetch a single gig by ID with creator details and reviews
 */
export async function fetchGigById(gigId: string): Promise<GigDetailsResponse> {
  const response = await apiClient.get<GigDetailsResponse>(`/gigs/${gigId}`);
  return response.data;
}

/**
 * Search gigs by query
 */
export async function searchGigs(
  query: string,
  page: number = 1,
  pageSize: number = 12
): Promise<GigsResponse> {
  const params = new URLSearchParams({
    search: query,
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const response = await apiClient.get<GigsResponse>(`/gigs/search?${params.toString()}`);
  return response.data;
}

/**
 * Fetch categories
 */
export async function fetchCategories(): Promise<string[]> {
  const response = await apiClient.get<{ categories: string[] }>('/gigs/categories');
  return response.data.categories;
}

/**
 * Create a new order for a gig
 */
export async function createOrder(
  gigId: string,
  packageType: 'basic' | 'standard' | 'premium',
  requirements: string
): Promise<{ orderId: string }> {
  const response = await apiClient.post('/orders', {
    gigId,
    packageType,
    requirements,
  });
  return response.data;
}
