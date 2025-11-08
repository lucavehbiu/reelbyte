import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  fetchGigs,
  fetchGigById,
  searchGigs,
  fetchCategories,
  type GigsResponse,
  type GigDetailsResponse,
} from '@/lib/api/gigs';
import type { GigFilters } from '@/types';
import { useDebounce } from './use-debounce';

/**
 * Hook for fetching gigs with filters and pagination
 */
export function useGigs(filters?: GigFilters, page: number = 1, pageSize: number = 12) {
  return useQuery({
    queryKey: ['gigs', filters, page, pageSize],
    queryFn: () => fetchGigs(filters, page, pageSize),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

/**
 * Hook for infinite scroll gigs
 */
export function useInfiniteGigs(filters?: GigFilters, pageSize: number = 12) {
  return useInfiniteQuery({
    queryKey: ['gigs-infinite', filters, pageSize],
    queryFn: ({ pageParam = 1 }) => fetchGigs(filters, pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook for fetching a single gig by ID
 */
export function useGigDetails(gigId: string | undefined) {
  return useQuery({
    queryKey: ['gig', gigId],
    queryFn: () => fetchGigById(gigId!),
    enabled: !!gigId, // Only fetch if gigId is provided
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook for searching gigs with debounce
 */
export function useGigSearch(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);

  const searchResults = useQuery({
    queryKey: ['gigs-search', debouncedQuery],
    queryFn: () => searchGigs(debouncedQuery),
    enabled: debouncedQuery.length >= 2, // Only search if query is at least 2 characters
    staleTime: 1000 * 60 * 2,
  });

  return {
    query,
    setQuery,
    debouncedQuery,
    ...searchResults,
  };
}

/**
 * Hook for fetching categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes - categories don't change often
  });
}
