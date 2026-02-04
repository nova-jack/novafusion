// src/lib/auth.ts
/**
 * Improved authentication utilities with proper security
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { env } from './env';
import { AdminUser } from '@/types/api';
import { COOKIE_NAMES } from '@/constants';

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = env.ADMIN_SESSION_DURATION;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

// Bcrypt configuration
const SALT_ROUNDS = 12;

/**
 * Generate JWT token for authenticated user
 */
export function generateToken(user: AdminUser): string {
  if (!user.id || !user.email) {
    throw new Error('Invalid user data for token generation');
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'novafusion-admin',
      audience: 'novafusion-admin-panel',
    }
  );
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'novafusion-admin',
      audience: 'novafusion-admin-panel',
    }) as AdminUser;
    
    // Validate decoded token structure
    if (!decoded.id || !decoded.email || !decoded.role) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    // Token expired, invalid, or malformed
    console.error('Token verification failed:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Validate user credentials against database
 */
export async function validateCredentials(
  email: string, 
  password: string
): Promise<AdminUser | null> {
  try {
    // Input validation
    if (!email || !password) {
      return null;
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      // Use constant-time comparison to prevent timing attacks
      await bcrypt.compare(password, '$2a$12$dummyHashToPreventTimingAttacks');
      return null;
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return null;
    }

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'ADMIN' | 'SUPER_ADMIN',
    };
  } catch (error) {
    console.error('Credential validation error:', error);
    return null;
  }
}

/**
 * Get current server session from cookies
 */
export async function getServerSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAMES.ADMIN_TOKEN)?.value;
    
    if (!token) {
      return null;
    }
    
    const user = verifyToken(token);
    
    if (!user) {
      return null;
    }
    
    // Optional: Verify user still exists in database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, role: true },
    });
    
    if (!dbUser) {
      return null;
    }
    
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role as 'ADMIN' | 'SUPER_ADMIN',
    };
  } catch (error) {
    console.error('Session retrieval error:', error);
    return null;
  }
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare password with hash
 */
export async function comparePassword(
  password: string, 
  hash: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
}

/**
 * Clear authentication session
 */
export function clearSession(): void {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAMES.ADMIN_TOKEN);
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must not exceed 128 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
