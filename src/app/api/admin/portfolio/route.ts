import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const project = await prisma.portfolio.findUnique({ where: { id } });
    return NextResponse.json({ project });
  }

  const projects = await prisma.portfolio.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ projects });
}

export async function PUT(req: Request) {
  const body = await req.json();

  const project = await prisma.portfolio.update({
    where: { id: body.id },
    data: {
      title: body.title,
      slug: body.slug,
      shortDesc: body.shortDesc,
      description: body.description,
      coverImage: body.coverImage,
      images: body.images,
      clientName: body.clientName,
      projectUrl: body.projectUrl,
      techStack: body.techStack,
      featured: body.featured,
      published: body.published,
      metaTitle: body.metaTitle,
      metaDesc: body.metaDesc,
    },
  });

  return NextResponse.json({ project });
}

