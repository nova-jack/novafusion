// src/types/api.ts
/**
 * All types derived directly from prisma/schema.prisma
 */

// ─── Auth ────────────────────────────────────────────────────────────────────

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

// ─── Blog ────────────────────────────────────────────────────────────────────

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  featured: boolean;
  metaTitle: string | null;
  metaDesc: string | null;
  keywords: string | null;
  authorId: string;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogWithAuthor extends Blog {
  author: {
    id: string;
    name: string;
    email: string;
  };
  category: Category | null;
}

export interface CreateBlogInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published?: boolean;
  featured?: boolean;
  metaTitle?: string;
  metaDesc?: string;
  keywords?: string;
  categoryId?: string;
}

export interface UpdateBlogInput {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string | null;
  published?: boolean;
  featured?: boolean;
  metaTitle?: string | null;
  metaDesc?: string | null;
  keywords?: string | null;
  categoryId?: string | null;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
}

// ─── Portfolio ───────────────────────────────────────────────────────────────

export interface Portfolio {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  coverImage: string;
  images: string[];
  clientName: string | null;
  projectUrl: string | null;
  techStack: string[];
  featured: boolean;
  published: boolean;
  metaTitle: string | null;
  metaDesc: string | null;
  authorId: string;
  serviceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioWithAuthor extends Portfolio {
  author: {
    id: string;
    name: string;
    email: string;
  };
  service: Pick<Service, 'id' | 'title' | 'slug'> | null;
}

export interface CreatePortfolioInput {
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  coverImage: string;
  images?: string[];
  clientName?: string;
  projectUrl?: string;
  techStack?: string[];
  featured?: boolean;
  published?: boolean;
  metaTitle?: string;
  metaDesc?: string;
  serviceId?: string;
}

export interface UpdatePortfolioInput {
  id: string;
  title?: string;
  slug?: string;
  description?: string;
  shortDesc?: string;
  coverImage?: string;
  images?: string[];
  clientName?: string | null;
  projectUrl?: string | null;
  techStack?: string[];
  featured?: boolean;
  published?: boolean;
  metaTitle?: string | null;
  metaDesc?: string | null;
  serviceId?: string | null;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  icon: string | null;
  coverImage: string | null;
  features: string[];
  published: boolean;
  order: number;
  metaTitle: string | null;
  metaDesc: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceInput {
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  icon?: string;
  coverImage?: string;
  features?: string[];
  published?: boolean;
  order?: number;
  metaTitle?: string;
  metaDesc?: string;
}

export interface UpdateServiceInput {
  id: string;
  title?: string;
  slug?: string;
  shortDesc?: string;
  description?: string;
  icon?: string | null;
  coverImage?: string | null;
  features?: string[];
  published?: boolean;
  order?: number;
  metaTitle?: string | null;
  metaDesc?: string | null;
}

// ─── Enquiry ─────────────────────────────────────────────────────────────────

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CONVERTED' | 'CLOSED';

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  budget: string | null;
  message: string;
  source: string | null;
  status: EnquiryStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnquiryInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  source?: string;
}

export interface UpdateEnquiryInput {
  id: string;
  status?: EnquiryStatus;
  notes?: string;
}

// ─── SEO & Settings ──────────────────────────────────────────────────────────

export interface SeoSetting {
  id: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string | null;
  keywords: string | null;
  customSchema: string | null;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
}

// ─── API Envelope ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
