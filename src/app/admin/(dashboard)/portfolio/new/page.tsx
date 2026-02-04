'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewPortfolioPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    category: 'realestate',
    videoUrl: '',
    thumbnail: '',
    description: '',
    published: false,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/admin/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    router.push('/admin/portfolio');
  };

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold">Add Portfolio Project</h1>

      <form onSubmit={submit} className="space-y-3">
        <input
          placeholder="Title"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <select
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="realestate">Real Estate</option>
          <option value="events">Events</option>
          <option value="commercial">Commercial</option>
          <option value="products">Products</option>
          <option value="graphics">Graphics</option>
        </select>

        <input
          placeholder="YouTube Video URL"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
        />

        <input
          placeholder="Thumbnail URL"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          rows={4}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={(e) =>
              setForm({ ...form, published: e.target.checked })
            }
          />
          Publish
        </label>

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}

