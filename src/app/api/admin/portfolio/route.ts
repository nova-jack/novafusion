import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// Auth check helper
function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET: all portfolio OR single by id
export async function GET(req: NextRequest) {
  try {
    const user = checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const project = await prisma.portfolio.findUnique({ where: { id } });
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json({ project });
    }

    const projects = await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('GET portfolio error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}

// POST: create portfolio
export async function POST(req: NextRequest) {
  try {
    const user = checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.title || !body.slug || !body.description) {
      return NextResponse.json(
        { error: 'Title, slug, and description are required' },
        { status: 400 }
      );
    }

    const slug = body.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await prisma.portfolio.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const project = await prisma.portfolio.create({
      data: {
        title: body.title.trim(),
        slug,
        shortDesc: body.shortDesc?.trim() || '',
        description: body.description,
        coverImage: body.coverImage || '',
        images: body.images || [],
        clientName: body.clientName?.trim() || null,
        projectUrl: body.projectUrl?.trim() || null,
        techStack: body.techStack || [],
        featured: body.featured || false,
        published: body.published || false,
        metaTitle: body.metaTitle?.trim() || null,
        metaDesc: body.metaDesc?.trim() || null,
        authorId: user.id,
        serviceId: body.serviceId || null,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('POST portfolio error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

// PUT: update portfolio
export async function PUT(req: NextRequest) {
  try {
    const user = checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const existing = await prisma.portfolio.findUnique({ where: { id: body.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = await prisma.portfolio.update({
      where: { id: body.id },
      data: {
        title: body.title?.trim(),
        slug: body.slug?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        shortDesc: body.shortDesc?.trim(),
        description: body.description,
        coverImage: body.coverImage,
        images: body.images,
        clientName: body.clientName?.trim() || null,
        projectUrl: body.projectUrl?.trim() || null,
        techStack: body.techStack,
        featured: body.featured,
        published: body.published,
        metaTitle: body.metaTitle?.trim() || null,
        metaDesc: body.metaDesc?.trim() || null,
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('PUT portfolio error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE: remove portfolio
export async function DELETE(req: NextRequest) {
  try {
    const user = checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    await prisma.portfolio.delete({ where: { id: body.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE portfolio error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}