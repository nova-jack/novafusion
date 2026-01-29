import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Rate limiting for spam protection
const submissions = new Map<string, number[]>();
const MAX_SUBMISSIONS = 5;
const TIME_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userSubmissions = submissions.get(ip) || [];
  const recentSubmissions = userSubmissions.filter(t => now - t < TIME_WINDOW);
  submissions.set(ip, recentSubmissions);
  return recentSubmissions.length >= MAX_SUBMISSIONS;
}

function recordSubmission(ip: string): void {
  const userSubmissions = submissions.get(ip) || [];
  userSubmissions.push(Date.now());
  submissions.set(ip, userSubmissions);
}

// POST - Public (with rate limiting)
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, company, service, budget, message, source } = body;

    // Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedEmail = email.trim().toLowerCase().slice(0, 255);
    const sanitizedMessage = message.trim().slice(0, 5000);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Phone validation (optional)
    if (phone && !/^[\d\s+\-()]{7,20}$/.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    recordSubmission(ip);

    const enquiry = await prisma.enquiry.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        phone: phone?.trim().slice(0, 20) || null,
        company: company?.trim().slice(0, 100) || null,
        service: service?.trim().slice(0, 100) || null,
        budget: budget?.trim().slice(0, 50) || null,
        message: sanitizedMessage,
        source: source?.trim().slice(0, 50) || "website",
      },
    });

    return NextResponse.json(
      { success: true, message: "Enquiry submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}

// GET - Protected (admin only)
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));

    const where = status ? { status: status as any } : {};

    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.enquiry.count({ where }),
    ]);

    return NextResponse.json({
      enquiries,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Fetch enquiries error:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}