// src/types/api.ts
/**
 * Centralized API types for type-safe API calls
 */
// Common response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
// Auth types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  user: AdminUser;
  token: string;
}
// Blog types
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDesc?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}
export interface CreateBlogRequest {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDesc?: string;
  published: boolean;
}
export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {
  id: string;
}
// Portfolio types
export interface Portfolio {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  images: string[];
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface CreatePortfolioRequest {
  title: string;
  slug: string;
  description: string;
  content: string;
  images: string[];
  category: string;
  tags: string[];
  published: boolean;
  featured?: boolean;
}
export interface UpdatePortfolioRequest extends Partial<CreatePortfolioRequest> {
  id: string;
}
// Service types
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  icon?: string;
  features: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface CreateServiceRequest {
  title: string;
  slug: string;
  description: string;
  content: string;
  icon?: string;
  features: string[];
  published: boolean;
}
export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  id: string;
}
// Enquiry types
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
  updatedAt: string;
}
export interface CreateEnquiryRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}
// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
