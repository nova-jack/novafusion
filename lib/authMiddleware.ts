// src/lib/authMiddleware.ts
/**
 * Improved authentication middleware with proper error handling and logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import { AdminUser } from '@/types/api';
import { COOKIE_NAMES, HTTP_STATUS } from '@/constants';

/**
 * Higher-order function to wrap API routes with authentication
 * @param handler - The API route handler function
 * @param options - Optional configuration
 * @returns Wrapped handler with authentication
 */
export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest, user: AdminUser) => Promise<NextResponse>,
  options?: {
    requiredRole?: 'ADMIN' | 'SUPER_ADMIN';
    allowRoles?: Array<'ADMIN' | 'SUPER_ADMIN'>;
  }
): Promise<NextResponse> {
  try {
    // Extract token from cookies
    const token = req.cookies.get(COOKIE_NAMES.ADMIN_TOKEN)?.value;
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized',
          message: 'No authentication token provided' 
        },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Verify token
    const user = verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized',
          message: 'Invalid or expired authentication token' 
        },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Check role-based access if specified
    if (options?.requiredRole && user.role !== options.requiredRole) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Forbidden',
          message: 'Insufficient permissions' 
        },
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    // Check if user has any of the allowed roles
    if (options?.allowRoles && !options.allowRoles.includes(user.role)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Forbidden',
          message: 'Insufficient permissions' 
        },
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    // Call the actual handler with authenticated user
    return await handler(req, user);
    
  } catch (error) {
    console.error('Authentication middleware error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal Server Error',
        message: 'An error occurred during authentication' 
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * Utility to check if request has valid authentication
 * (for non-API routes like pages)
 */
export function getAuthUser(req: NextRequest): AdminUser | null {
  try {
    const token = req.cookies.get(COOKIE_NAMES.ADMIN_TOKEN)?.value;
    
    if (!token) {
      return null;
    }
    
    return verifyToken(token);
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

/**
 * Check if user has required role
 */
export function hasRole(
  user: AdminUser | null, 
  role: 'ADMIN' | 'SUPER_ADMIN'
): boolean {
  if (!user) {
    return false;
  }
  
  return user.role === role || user.role === 'SUPER_ADMIN';
}

/**
 * Check if user has any of the allowed roles
 */
export function hasAnyRole(
  user: AdminUser | null, 
  roles: Array<'ADMIN' | 'SUPER_ADMIN'>
): boolean {
  if (!user) {
    return false;
  }
  
  return roles.includes(user.role);
}
