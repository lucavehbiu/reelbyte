/**
 * Core type definitions for ReelByte
 */

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'creator' | 'client' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Creator extends User {
  role: 'creator';
  bio?: string;
  tagline?: string;
  skills: string[];
  level: 'new' | 'level1' | 'level2' | 'toprated';
  rating: number;
  reviewCount: number;
  completedProjects: number;
  responseTime: number; // in hours
  languages: string[];
}

export interface Gig {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: string;
  videos: string[];
  packages: GigPackage[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GigPackage {
  type: 'basic' | 'standard' | 'premium';
  name: string;
  description: string;
  price: number;
  deliveryTime: number; // in days
  revisions: number;
  features: string[];
}

export interface Order {
  id: string;
  gigId: string;
  clientId: string;
  creatorId: string;
  packageType: 'basic' | 'standard' | 'premium';
  status: 'pending' | 'in_progress' | 'delivered' | 'revision' | 'completed' | 'cancelled';
  price: number;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  gigId: string;
  orderId: string;
  clientId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface GigFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  deliveryTime?: number;
  creatorLevel?: Creator['level'];
  minRating?: number;
  search?: string;
}

export interface ClientProfile {
  id: string;
  userId: string;
  companyName: string;
  companyLogoUrl?: string;
  industry?: string;
  companySize?: string;
  websiteUrl?: string;
  description?: string;
  totalJobsPosted: number;
  totalSpent: string;
  averageRating: string;
  totalReviews: number;
  isVerified: boolean;
  verifiedAt?: string;
  paymentVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
