// src/app/admin/(dashboard)/blogs/edit/[id]/page.tsx
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from '@/hooks/useForm';
import { useApi } from '@/hooks/useApi';
import { generateSlug, isEmpty } from '@/lib/utils';
import { apiClient } from '@/lib/apiClient';
import { 
  Blog, 
  UpdateBlogRequest, 
  ApiResponse 
} from '@/types/api';
import { 
  API_ENDPOINTS, 
  ADMIN_ROUTES, 
  STATUS_OPTIONS,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES 
} from '@/constants';

// Form values interface matching UpdateBlogRequest
interface BlogFormValues {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  status: 'draft' | 'published';
}

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // Fetch blog data
  const {
    data: blog,
    loading: fetchLoading,
    error: fetchError,
    execute: fetchBlog,
  } = useApi<Blog>(
    () => apiClient.get<Blog>(API_ENDPOINTS.BLOGS.BY_ID(id))
  );

  // Update blog mutation
  const {
    loading: updateLoading,
    error: updateError,
    execute: updateBlog,
  } = useApi<Blog, [UpdateBlogRequest]>(
    (data: UpdateBlogRequest) => apiClient.put<Blog>(API_ENDPOINTS.BLOGS.BASE, data),
    {
      onSuccess: () => {
        alert(SUCCESS_MESSAGES.UPDATED);
        router.push(ADMIN_ROUTES.BLOGS);
      },
      onError: (error) => {
        alert(`Failed to update blog: ${error}`);
      },
    }
  );

  // Form configuration with validation
  const form = useForm<BlogFormValues>({
    fields: {
      id: {
        initialValue: id,
      },
      title: {
        initialValue: '',
        validation: {
          required: true,
          minLength: VALIDATION.TITLE_MIN_LENGTH,
          maxLength: VALIDATION.TITLE_MAX_LENGTH,
        },
      },
      slug: {
        initialValue: '',
        validation: {
          required: true,
          maxLength: VALIDATION.SLUG_MAX_LENGTH,
          pattern: /^[a-z0-9-]+$/,
          custom: (value: string | undefined) => {
            if (value && !/^[a-z0-9-]+$/.test(value)) {
              return 'Slug can only contain lowercase letters, numbers, and hyphens';
            }
            return null;
          },
        },
      },
      content: {
        initialValue: '',
        validation: {
          required: true,
          minLength: VALIDATION.CONTENT_MIN_LENGTH,
        },
      },
      metaTitle: {
        initialValue: '',
        validation: {
          maxLength: 60,
        },
      },
      metaDescription: {
        initialValue: '',
        validation: {
          maxLength: 160,
        },
      },
      status: {
        initialValue: 'draft' as 'draft' | 'published',
        validation: {
          required: true,
        },
      },
    },
    onSubmit: async (values) => {
      await updateBlog(values as UpdateBlogRequest);
    },
  });

  // Fetch blog on mount
  useEffect(() => {
    fetchBlog();
  }, [id]);

  // Populate form when blog is loaded
  useEffect(() => {
    if (blog) {
      form.setFieldValue('title', blog.title);
      form.setFieldValue('slug', blog.slug);
      form.setFieldValue('content', blog.content);
      form.setFieldValue('metaTitle', blog.metaTitle || '');
      form.setFieldValue('metaDescription', blog.metaDescription || '');
      form.setFieldValue('status', blog.status);
    }
  }, [blog]);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    form.handleChange('title')(e);
    
    // Only auto-generate slug if it hasn't been manually edited
    if (!form.touched.slug || isEmpty(form.values.slug)) {
      form.setFieldValue('slug', generateSlug(newTitle));
    }
  };

  // Loading state
  if (fetchLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="mb-2 text-xl font-semibold text-red-800">Error Loading Blog</h2>
          <p className="text-red-600">{fetchError}</p>
          <button
            onClick={() => fetchBlog()}
            className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!blog) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">Blog Not Found</h2>
          <p className="mb-4 text-gray-600">The blog you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push(ADMIN_ROUTES.BLOGS)}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Blog</h1>
        <button
          type="button"
          onClick={() => router.push(ADMIN_ROUTES.BLOGS)}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back to Blogs
        </button>
      </div>

      {updateError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {updateError}
        </div>
      )}

      <form onSubmit={form.handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={form.values.title}
            onChange={handleTitleChange}
            onBlur={form.handleBlur('title')}
            className={`mt-1 w-full rounded-lg border p-3 transition-colors ${
              form.errors.title && form.touched.title
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            disabled={updateLoading}
          />
          {form.errors.title && form.touched.title && (
            <p className="mt-1 text-sm text-red-600">{form.errors.title}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block font-medium text-gray-700">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            type="text"
            value={form.values.slug}
            onChange={form.handleChange('slug')}
            onBlur={form.handleBlur('slug')}
            className={`mt-1 w-full rounded-lg border p-3 font-mono text-sm transition-colors ${
              form.errors.slug && form.touched.slug
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            disabled={updateLoading}
          />
          {form.errors.slug && form.touched.slug && (
            <p className="mt-1 text-sm text-red-600">{form.errors.slug}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            URL-friendly version of the title
          </p>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block font-medium text-gray-700">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={form.values.content}
            onChange={form.handleChange('content')}
            onBlur={form.handleBlur('content')}
            rows={16}
            className={`mt-1 w-full rounded-lg border p-3 font-mono text-sm transition-colors ${
              form.errors.content && form.touched.content
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            disabled={updateLoading}
          />
          {form.errors.content && form.touched.content && (
            <p className="mt-1 text-sm text-red-600">{form.errors.content}</p>
          )}
        </div>

        {/* Meta Title */}
        <div>
          <label htmlFor="metaTitle" className="block font-medium text-gray-700">
            Meta Title (SEO)
          </label>
          <input
            id="metaTitle"
            type="text"
            value={form.values.metaTitle}
            onChange={form.handleChange('metaTitle')}
            onBlur={form.handleBlur('metaTitle')}
            className={`mt-1 w-full rounded-lg border p-3 transition-colors ${
              form.errors.metaTitle && form.touched.metaTitle
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            disabled={updateLoading}
            placeholder="Title for search engines (60 chars max)"
            maxLength={60}
          />
          {form.errors.metaTitle && form.touched.metaTitle && (
            <p className="mt-1 text-sm text-red-600">{form.errors.metaTitle}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {form.values.metaTitle?.length || 0}/60 characters
          </p>
        </div>

        {/* Meta Description */}
        <div>
          <label htmlFor="metaDescription" className="block font-medium text-gray-700">
            Meta Description (SEO)
          </label>
          <textarea
            id="metaDescription"
            value={form.values.metaDescription}
            onChange={form.handleChange('metaDescription')}
            onBlur={form.handleBlur('metaDescription')}
            rows={3}
            className={`mt-1 w-full rounded-lg border p-3 transition-colors ${
              form.errors.metaDescription && form.touched.metaDescription
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            disabled={updateLoading}
            placeholder="Description for search results (160 chars max)"
            maxLength={160}
          />
          {form.errors.metaDescription && form.touched.metaDescription && (
            <p className="mt-1 text-sm text-red-600">{form.errors.metaDescription}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {form.values.metaDescription?.length || 0}/160 characters
          </p>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            value={form.values.status}
            onChange={form.handleChange('status')}
            onBlur={form.handleBlur('status')}
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500"
            disabled={updateLoading}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t pt-6">
          <button
            type="submit"
            disabled={updateLoading || !form.isValid}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateLoading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Updating...
              </span>
            ) : (
              'Update Blog'
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push(ADMIN_ROUTES.BLOGS)}
            disabled={updateLoading}
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={form.resetForm}
            disabled={updateLoading}
            className="ml-auto rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
