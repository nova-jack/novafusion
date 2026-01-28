import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const service = await prisma.service.findUnique({
      where: { id },
    });
    return NextResponse.json({ service });
  }

  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' },
  });

  return NextResponse.json({ services });
}

export async function PUT(req: Request) {
  const body = await req.json();

  const service = await prisma.service.update({
    where: { id: body.id },
    data: {
      title: body.title,
      slug: body.slug,
      shortDesc: body.shortDesc,
      description: body.description,
      metaTitle: body.metaTitle,
      metaDesc: body.metaDesc,
      published: body.published,
    },
  });

  return NextResponse.json({ service });
}

