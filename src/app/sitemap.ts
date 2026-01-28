import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://novafusion.in';

  const services = await prisma.service.findMany({
    where: { published: true },
    select: { slug: true },
  });

  const blogs = await prisma.blog.findMany({
    where: { published: true },
    select: { slug: true },
  });

  const portfolios = await prisma.portfolio.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/services`, lastModified: new Date() },
    { url: `${baseUrl}/portfolio`, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },

    ...services.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: new Date(),
    })),

    ...blogs.map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: new Date(),
    })),

    ...portfolios.map((p) => ({
      url: `${baseUrl}/portfolio/${p.slug}`,
      lastModified: new Date(),
    })),
  ];
}

