import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: all blogs OR single blog by id
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const blog = await prisma.blog.findUnique({
      where: { id },
    });
    return NextResponse.json({ blog });
  }

  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ blogs });
}

// POST: create blog
export async function POST(req: Request) {
  const body = await req.json();

  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || '',
      content: body.content,
      coverImage: body.coverImage || null,
      published: body.status === 'published',
      featured: body.featured || false,
      metaTitle: body.metaTitle || null,
      metaDesc: body.metaDescription || null,
      keywords: body.keywords || null,
      authorId: body.authorId, // MUST be passed from admin (or set default admin later)
      categoryId: body.categoryId || null,
    },
  });

  return NextResponse.json({ blog }, { status: 201 });
}

// PUT: update blog
export async function PUT(req: Request) {
  const body = await req.json();

  const blog = await prisma.blog.update({
    where: { id: body.id },
    data: {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || '',
      content: body.content,
      coverImage: body.coverImage || null,
      published: body.status === 'published',
      featured: body.featured || false,
      metaTitle: body.metaTitle || null,
      metaDesc: body.metaDescription || null,
      keywords: body.keywords || null,
      categoryId: body.categoryId || null,
    },
  });

  return NextResponse.json({ blog });
}

// DELETE: remove blog
export async function DELETE(req: Request) {
  const body = await req.json();

  await prisma.blog.delete({
    where: { id: body.id },
  });

  return NextResponse.json({ success: true });
}

