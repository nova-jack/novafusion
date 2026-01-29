// src/lib/auth.ts
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function generateToken(user: AdminUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET!,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as AdminUser;
    return decoded;
  } catch {
    return null;
  }
}

export async function validateCredentials(email: string, password: string): Promise<AdminUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
}

export async function getServerSession(): Promise<AdminUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Helper to hash password (use when creating users)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}