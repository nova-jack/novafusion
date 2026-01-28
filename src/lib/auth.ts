// src/lib/auth.ts
import { cookies } from 'next/headers';

// Simple admin credentials - In production, use database & hashed passwords
const ADMIN_EMAIL = "admin@novafusion.in";
const ADMIN_PASSWORD = "NovaFusion1234"; // Change this!
const AUTH_SECRET = "novafusion-admin-secret-key-change-this";

export interface AdminUser {
  email: string;
  name: string;
  role: string;
}

export function generateToken(user: AdminUser): string {
  const payload = {
    ...user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp < Date.now()) return null;
    return { email: payload.email, name: payload.name, role: payload.role };
  } catch {
    return null;
  }
}

export function validateCredentials(email: string, password: string): AdminUser | null {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return {
      email: ADMIN_EMAIL,
      name: "Admin",
      role: "admin"
    };
  }
  return null;
}

export async function getServerSession(): Promise<AdminUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
