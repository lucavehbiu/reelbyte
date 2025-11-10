import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  fetchProjects,
  fetchProjectById,
  searchProjects,
  type ProjectsResponse,
  type ProjectWithClient,
  type ProjectFilters,
} from '@/lib/api/projects';
import { useDebounce } from './use-debounce';

/**
 * Hook for fetching projects with filters and pagination
 */
export function useProjects(filters?: ProjectFilters, page: number = 1, pageSize: number = 12) {
  return useQuery({
    queryKey: ['projects', filters, page, pageSize],
    queryFn: () => fetchProjects(filters, page, pageSize),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

/**
 * Hook for infinite scroll projects
 */
export function useInfiniteProjects(filters?: ProjectFilters, pageSize: number = 12) {
  return useInfiniteQuery({
    queryKey: ['projects-infinite', filters, pageSize],
    queryFn: ({ pageParam = 1 }) => fetchProjects(filters, pageParam, pageSize),
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
 * Hook for fetching a single project by ID
 */
export function useProjectDetails(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProjectById(projectId!),
    enabled: !!projectId, // Only fetch if projectId is provided
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook for searching projects with debounce
 */
export function useProjectSearch(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);

  const searchResults = useQuery({
    queryKey: ['projects-search', debouncedQuery],
    queryFn: () => searchProjects(debouncedQuery),
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
