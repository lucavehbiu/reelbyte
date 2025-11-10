import { apiClient } from './client';

/**
 * Project types matching backend schema
 */
export interface Project {
  id: string;
  clientProfileId: string;
  title: string;
  description: string;
  category: string;
  videoType: string | null;
  budgetType: 'fixed' | 'range';
  budgetMin: number;
  budgetMax: number | null;
  budgetFixed: number | null;
  deadlineDate: string | null;
  experienceLevel: 'entry' | 'intermediate' | 'expert' | 'any';
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled' | 'closed';
  viewCount: number;
  proposalCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface Client {
  id: string;
  userId: string;
  companyName: string;
  companySize: string;
  industry: string;
  websiteUrl: string | null;
  description: string;
  isVerified: boolean;
  totalJobsPosted: number;
  totalSpent: number;
  averageRating: number;
  totalReviews: number;
}

export interface ProjectWithClient extends Project {
  client: Client;
}

export interface ProjectsResponse {
  projects: ProjectWithClient[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProjectFilters {
  category?: string;
  videoType?: string;
  minBudget?: number;
  maxBudget?: number;
  experienceLevel?: Project['experienceLevel'];
  status?: Project['status'];
  search?: string;
  industry?: string; // For filtering by restaurant type
}

/**
 * Fetch projects with optional filters and pagination
 */
export async function fetchProjects(
  filters?: ProjectFilters,
  page: number = 1,
  pageSize: number = 12
): Promise<ProjectsResponse> {
  const params = new URLSearchParams();

  if (filters?.category) params.append('category', filters.category);
  if (filters?.videoType) params.append('videoType', filters.videoType);
  if (filters?.minBudget) params.append('minBudget', filters.minBudget.toString());
  if (filters?.maxBudget) params.append('maxBudget', filters.maxBudget.toString());
  if (filters?.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.industry) params.append('industry', filters.industry);

  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());

  const response = await apiClient.get<ProjectsResponse>(`/projects?${params.toString()}`);
  return response.data;
}

/**
 * Fetch a single project by ID with client details
 */
export async function fetchProjectById(projectId: string): Promise<ProjectWithClient> {
  const response = await apiClient.get<ProjectWithClient>(`/projects/${projectId}`);
  return response.data;
}

/**
 * Search projects by query
 */
export async function searchProjects(
  query: string,
  page: number = 1,
  pageSize: number = 12
): Promise<ProjectsResponse> {
  const params = new URLSearchParams({
    search: query,
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const response = await apiClient.get<ProjectsResponse>(`/projects/search?${params.toString()}`);
  return response.data;
}

/**
 * Create a new proposal for a project
 */
export async function createProposal(
  projectId: string,
  coverLetter: string,
  proposedBudget: number,
  proposedTimelineDays: number,
  portfolioSamples?: string[]
): Promise<{ proposalId: string }> {
  const response = await apiClient.post('/proposals', {
    projectId,
    coverLetter,
    proposedBudget,
    proposedTimelineDays,
    portfolioSamples,
  });
  return response.data;
}
