'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    shortDesc: '',
    description: '',
    metaTitle: '',
    metaDesc: '',
    published: false,
  });

  useEffect(() => {
    fetch(`/api/admin/services?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          title: data.service.title,
          slug: data.service.slug,
          shortDesc: data.service.shortDesc,
          description: data.service.description,
          metaTitle: data.service.metaTitle || '',
          metaDesc: data.service.metaDesc || '',
          published: data.service.published,
        });
        setLoading(false);
      });
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/admin/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...form }),
    });

    router.push('/admin/services');
  };

  if (loading) return null;

  return (
    <div className="max-w-4xl space-y-4">
      <h1 className="text-3xl font-bold">Edit Service</h1>

      <form onSubmit={submit} className="space-y-3">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="Title"
        />

        <input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="Slug"
        />

        <input
          value={form.shortDesc}
          onChange={(e) =>
            setForm({ ...form, shortDesc: e.target.value })
          }
          className="w-full border p-2 rounded"
          placeholder="Short Description"
        />

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          rows={10}
          className="w-full border p-2 rounded"
          placeholder="Full Service Description"
        />

        <input
          value={form.metaTitle}
          onChange={(e) =>
            setForm({ ...form, metaTitle: e.target.value })
          }
          className="w-full border p-2 rounded"
          placeholder="Meta Title"
        />

        <textarea
          value={form.metaDesc}
          onChange={(e) =>
            setForm({ ...form, metaDesc: e.target.value })
          }
          rows={3}
          className="w-full border p-2 rounded"
          placeholder="Meta Description"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) =>
              setForm({ ...form, published: e.target.checked })
            }
          />
          Published
        </label>

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Update Service
        </button>
      </form>
    </div>
  );
}

