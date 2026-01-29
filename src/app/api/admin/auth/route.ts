// src/app/api/admin/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, generateToken, verifyToken } from "@/lib/auth";

// Rate limiting (simple in-memory)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const attempt = loginAttempts.get(ip);
  if (!attempt) return false;
  
  if (Date.now() - attempt.lastAttempt > LOCKOUT_TIME) {
    loginAttempts.delete(ip);
    return false;
  }
  
  return attempt.count >= MAX_ATTEMPTS;
}

function recordAttempt(ip: string): void {
  const attempt = loginAttempts.get(ip) || { count: 0, lastAttempt: Date.now() };
  attempt.count++;
  attempt.lastAttempt = Date.now();
  loginAttempts.set(ip, attempt);
}

function clearAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

// POST - Login
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many login attempts. Try again later." },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const user = await validateCredentials(email, password);

    if (!user) {
      recordAttempt(ip);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    clearAttempts(ip);
    const token = generateToken(user);

    const response = NextResponse.json({
      success: true,
      user: { email: user.email, name: user.name, role: user.role }
    });

    // Set HTTP-only cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

// GET - Check session
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

// DELETE - Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}