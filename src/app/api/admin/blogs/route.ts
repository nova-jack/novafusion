import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// Middleware to check auth
async function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET: all blogs OR single blog by id
export async function GET(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const blog = await prisma.blog.findUnique({ where: { id } });
      if (!blog) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }
      return NextResponse.json({ blog });
    }

    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('GET blogs error:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST: create blog
export async function POST(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Validation
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Sanitize slug
    const slug = body.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check slug uniqueness
    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const blog = await prisma.blog.create({
      data: {
        title: body.title.trim(),
        slug,
        excerpt: body.excerpt?.trim() || '',
        content: body.content,
        coverImage: body.coverImage || null,
        published: body.status === 'published',
        featured: body.featured || false,
        metaTitle: body.metaTitle?.trim() || null,
        metaDesc: body.metaDescription?.trim() || null,
        keywords: body.keywords?.trim() || null,
        authorId: user.id, // Use authenticated user's ID
        categoryId: body.categoryId || null,
      },
    });

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error) {
    console.error('POST blog error:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

// PUT: update blog
export async function PUT(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Blog ID required' }, { status: 400 });
    }

    // Check blog exists
    const existing = await prisma.blog.findUnique({ where: { id: body.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const blog = await prisma.blog.update({
      where: { id: body.id },
      data: {
        title: body.title?.trim(),
        slug: body.slug?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt: body.excerpt?.trim() || '',
        content: body.content,
        coverImage: body.coverImage || null,
        published: body.status === 'published',
        featured: body.featured || false,
        metaTitle: body.metaTitle?.trim() || null,
        metaDesc: body.metaDescription?.trim() || null,
        keywords: body.keywords?.trim() || null,
        categoryId: body.categoryId || null,
      },
    });

    return NextResponse.json({ blog });
  } catch (error) {
    console.error('PUT blog error:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

// DELETE: remove blog
export async function DELETE(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Blog ID required' }, { status: 400 });
    }

    await prisma.blog.delete({ where: { id: body.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE blog error:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}