'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        const blog = data.blog;

        setTitle(blog.title);
        setSlug(blog.slug);
        setContent(blog.content);
        setMetaTitle(blog.metaTitle || '');
        setMetaDescription(blog.metaDescription || '');
        setStatus(blog.status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch('/api/admin/blogs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        title,
        slug,
        content,
        metaTitle,
        metaDescription,
        status,
      }),
    });

    setSaving(false);

    if (res.ok) {
      router.push('/admin/blogs');
    } else {
      alert('Failed to update blog');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">Edit Blog</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Title */}
        <div>
          <label className="font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(generateSlug(e.target.value));
            }}
            required
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="font-medium">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        {/* Content */}
        <div>
          <label className="font-medium">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        {/* Meta Title */}
        <div>
          <label className="font-medium">Meta Title</label>
          <input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="font-medium">Meta Description</label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        {/* Status */}
        <div>
          <label className="font-medium">Status</label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as 'draft' | 'published')
            }
            className="mt-1 w-full rounded border p-2"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            {saving ? 'Updating...' : 'Update Blog'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/blogs')}
            className="rounded border px-6 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

