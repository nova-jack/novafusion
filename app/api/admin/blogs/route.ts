// src/app/api/admin/blogs/route.ts
/**
 * Improved blogs API with proper validation, error handling, and security
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/authMiddleware';
import { generateSlug, sanitizeHTML, createExcerpt } from '@/lib/utils';
import { 
  CreateBlogRequest, 
  UpdateBlogRequest, 
  Blog 
} from '@/types/api';
import { 
  HTTP_STATUS, 
  ERROR_MESSAGES 
} from '@/constants';

/**
 * GET - Fetch blogs (single or list)
 */
export async function GET(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      const slug = searchParams.get('slug');
      const status = searchParams.get('status');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');

      // Fetch single blog by ID
      if (id) {
        const blog = await prisma.blog.findUnique({
          where: { id },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        if (!blog) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Blog not found' 
            },
            { status: HTTP_STATUS.NOT_FOUND }
          );
        }

        return NextResponse.json({
          success: true,
          data: { blog },
        });
      }

      // Fetch single blog by slug
      if (slug) {
        const blog = await prisma.blog.findUnique({
          where: { slug },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        if (!blog) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Blog not found' 
            },
            { status: HTTP_STATUS.NOT_FOUND }
          );
        }

        return NextResponse.json({
          success: true,
          data: { blog },
        });
      }

      // Fetch list of blogs with pagination
      const where: any = {};
      if (status) {
        where.status = status;
      }

      const [blogs, total] = await Promise.all([
        prisma.blog.findMany({
          where,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.blog.count({ where }),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          blogs,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
          },
        },
      });
    } catch (error) {
      console.error('GET /api/admin/blogs error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: ERROR_MESSAGES.SERVER_ERROR 
        },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  });
}

/**
 * POST - Create new blog
 */
export async function POST(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const body: CreateBlogRequest = await req.json();

      // Validate required fields
      if (!body.title || !body.content) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Title and content are required' 
          },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      // Validate title length
      if (body.title.length < 3 || body.title.length > 200) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Title must be between 3 and 200 characters' 
          },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      // Validate content length
      if (body.content.length < 10) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Content must be at least 10 characters' 
          },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      // Generate slug if not provided
      const slug = body.slug || generateSlug(body.title);

      // Check if slug already exists
      const existingBlog = await prisma.blog.findUnique({
        where: { slug },
      });

      if (existingBlog) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'A blog with this slug already exists' 
          },
          { status: HTTP_STATUS.CONFLICT }
        );
      }

      // Create excerpt if not provided
      const excerpt = body.excerpt || createExcerpt(body.content, 160);

      // Create blog
      const blog = await prisma.blog.create({
        data: {
          title: body.title.trim(),
          slug,
          content: body.content,
          excerpt,
          metaTitle: body.metaTitle?.trim() || body.title.trim(),
          metaDescription: body.metaDescription?.trim() || excerpt,
          status: body.status || 'draft',
          authorId: user.id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json(
        {
          success: true,
          data: { blog },
          message: 'Blog created successfully',
        },
        { status: HTTP_STATUS.CREATED }
      );
    } catch (error) {
      console.error('POST /api/admin/blogs error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: ERROR_MESSAGES.SERVER_ERROR 
        },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  });
}

/**
 * PUT - Update existing blog
 */
export async function PUT(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const body: UpdateBlogRequest = await req.json();

      // Validate ID
      if (!body.id) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Blog ID is required' 
          },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      // Check if blog exists
      const existingBlog = await prisma.blog.findUnique({
        where: { id: body.id },
      });

      if (!existingBlog) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Blog not found' 
          },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }

      // Check authorization (only author or super admin can edit)
      if (existingBlog.authorId !== user.id && user.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { 
            success: false, 
            error: ERROR_MESSAGES.UNAUTHORIZED 
          },
          { status: HTTP_STATUS.FORBIDDEN }
        );
      }

      // Validate slug if provided
      if (body.slug && body.slug !== existingBlog.slug) {
        const slugExists = await prisma.blog.findUnique({
          where: { slug: body.slug },
        });

        if (slugExists) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'A blog with this slug already exists' 
            },
            { status: HTTP_STATUS.CONFLICT }
          );
        }
      }

      // Build update data
      const updateData: any = {};
      
      if (body.title !== undefined) {
        if (body.title.length < 3 || body.title.length > 200) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Title must be between 3 and 200 characters' 
            },
            { status: HTTP_STATUS.BAD_REQUEST }
          );
        }
        updateData.title = body.title.trim();
      }
      
      if (body.slug !== undefined) {
        updateData.slug = body.slug;
      }
      
      if (body.content !== undefined) {
        if (body.content.length < 10) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Content must be at least 10 characters' 
            },
            { status: HTTP_STATUS.BAD_REQUEST }
          );
        }
        updateData.content = body.content;
      }
      
      if (body.excerpt !== undefined) {
        updateData.excerpt = body.excerpt;
      }
      
      if (body.metaTitle !== undefined) {
        updateData.metaTitle = body.metaTitle.trim();
      }
      
      if (body.metaDescription !== undefined) {
        updateData.metaDescription = body.metaDescription.trim();
      }
      
      if (body.status !== undefined) {
        updateData.status = body.status;
      }

      // Update blog
      const blog = await prisma.blog.update({
        where: { id: body.id },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: { blog },
        message: 'Blog updated successfully',
      });
    } catch (error) {
      console.error('PUT /api/admin/blogs error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: ERROR_MESSAGES.SERVER_ERROR 
        },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  });
}

/**
 * DELETE - Delete blog
 */
export async function DELETE(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Blog ID is required' 
          },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      // Check if blog exists
      const existingBlog = await prisma.blog.findUnique({
        where: { id },
      });

      if (!existingBlog) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Blog not found' 
          },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }

      // Check authorization (only author or super admin can delete)
      if (existingBlog.authorId !== user.id && user.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { 
            success: false, 
            error: ERROR_MESSAGES.UNAUTHORIZED 
          },
          { status: HTTP_STATUS.FORBIDDEN }
        );
      }

      // Delete blog
      await prisma.blog.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: 'Blog deleted successfully',
      });
    } catch (error) {
      console.error('DELETE /api/admin/blogs error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: ERROR_MESSAGES.SERVER_ERROR 
        },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  });
}
