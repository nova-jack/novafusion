'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBlogPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [loading, setLoading] = useState(false);

  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/admin/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        slug: slug || generateSlug(title),
        content,
        metaTitle,
        metaDescription,
        status,
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/admin/blogs');
    } else {
      alert('Failed to create blog');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">Create New Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            rows={10}
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
            disabled={loading}
            className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            {loading ? 'Saving...' : 'Save Blog'}
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

