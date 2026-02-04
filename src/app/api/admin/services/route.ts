import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET: all services OR single by id
export async function GET(req: NextRequest) {
  try {
    const user = checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const service = await prisma.service.findUnique({ where: { id } });
      if (!service) {
        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
      }
      return NextResponse.json({ service });
    }

    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error('GET services error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST: create service
export async function POST(req: NextRequest) {
  try {
    const user = checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    const slug = body.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const service = await prisma.service.create({
      data: {
        title: body.title.trim(),
        slug,
        shortDesc: body.shortDesc?.trim() || '',
        description: body.description || '',
        icon: body.icon || null,
        coverImage: body.coverImage || null,
        features: body.features || [],
        published: body.published || false,
        order: body.order || 0,
        metaTitle: body.metaTitle?.trim() || null,
        metaDesc: body.metaDesc?.trim() || null,
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error('POST service error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

// PUT: update service
export async function PUT(req: NextRequest) {
  try {
    const user = checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Service ID required' }, { status: 400 });
    }

    const existing = await prisma.service.findUnique({ where: { id: body.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const service = await prisma.service.update({
      where: { id: body.id },
      data: {
        title: body.title?.trim(),
        slug: body.slug?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        shortDesc: body.shortDesc?.trim(),
        description: body.description,
        icon: body.icon || null,
        coverImage: body.coverImage || null,
        features: body.features,
        published: body.published,
        order: body.order,
        metaTitle: body.metaTitle?.trim() || null,
        metaDesc: body.metaDesc?.trim() || null,
      },
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error('PUT service error:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// DELETE: remove service
export async function DELETE(req: NextRequest) {
  try {
    const user = checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Service ID required' }, { status: 400 });
    }

    await prisma.service.delete({ where: { id: body.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE service error:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}