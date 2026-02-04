// src/constants/index.ts
/**
 * Application constants
 */

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/admin/auth',
    LOGOUT: '/api/admin/auth/logout',
    VERIFY: '/api/admin/auth/verify',
  },
  BLOGS: {
    BASE: '/api/admin/blogs',
    BY_ID: (id: string) => `/api/admin/blogs?id=${id}`,
    BY_SLUG: (slug: string) => `/api/admin/blogs?slug=${slug}`,
  },
  PORTFOLIO: {
    BASE: '/api/admin/portfolio',
    BY_ID: (id: string) => `/api/admin/portfolio?id=${id}`,
    BY_SLUG: (slug: string) => `/api/admin/portfolio?slug=${slug}`,
  },
  SERVICES: {
    BASE: '/api/admin/services',
    BY_ID: (id: string) => `/api/admin/services?id=${id}`,
    BY_SLUG: (slug: string) => `/api/admin/services?slug=${slug}`,
  },
  ENQUIRIES: {
    BASE: '/api/enquiry',
    ADMIN: '/api/admin/enquiries',
  },
} as const;

// Admin Routes
export const ADMIN_ROUTES = {
  LOGIN: '/admin/login',
  DASHBOARD: '/admin/dashboard',
  BLOGS: '/admin/blogs',
  BLOGS_NEW: '/admin/blogs/new',
  BLOGS_EDIT: (id: string) => `/admin/blogs/edit/${id}`,
  PORTFOLIO: '/admin/portfolio',
  PORTFOLIO_NEW: '/admin/portfolio/new',
  PORTFOLIO_EDIT: (id: string) => `/admin/portfolio/edit/${id}`,
  SERVICES: '/admin/services',
  SERVICES_EDIT: (id: string) => `/admin/services/edit/${id}`,
  ENQUIRIES: '/admin/enquiries',
} as const;

// Public Routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  PORTFOLIO: '/portfolio',
  PORTFOLIO_PROJECT: (slug: string) => `/portfolio/${slug}`,
  SERVICES: '/services',
  SERVICE_DETAIL: (slug: string) => `/services/${slug}`,
  CONTACT: '/contact',
} as const;

// Form Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 200,
  SLUG_MAX_LENGTH: 200,
  CONTENT_MIN_LENGTH: 10,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\d\s+()-]+$/,
} as const;

// Status Options
export const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
] as const;

export const ENQUIRY_STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
] as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
  TITLE_TOO_SHORT: `Title must be at least ${VALIDATION.TITLE_MIN_LENGTH} characters`,
  CONTENT_TOO_SHORT: `Content must be at least ${VALIDATION.CONTENT_MIN_LENGTH} characters`,
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'An error occurred. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in',
  LOGOUT_SUCCESS: 'Successfully logged out',
  CREATED: 'Successfully created',
  UPDATED: 'Successfully updated',
  DELETED: 'Successfully deleted',
  ENQUIRY_SUBMITTED: 'Your enquiry has been submitted successfully',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ADMIN_TOKEN: 'admin_token',
  THEME: 'theme',
} as const;

// Cookie Names
export const COOKIE_NAMES = {
  ADMIN_TOKEN: 'admin_token',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
