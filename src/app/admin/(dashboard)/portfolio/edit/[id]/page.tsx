'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditPortfolioPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    shortDesc: '',
    description: '',
    coverImage: '',
    images: '',
    clientName: '',
    projectUrl: '',
    techStack: '',
    featured: false,
    published: false,
    metaTitle: '',
    metaDesc: '',
  });

  useEffect(() => {
    fetch(`/api/admin/portfolio?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const p = data.project;
        setForm({
          title: p.title,
          slug: p.slug,
          shortDesc: p.shortDesc,
          description: p.description,
          coverImage: p.coverImage,
          images: p.images.join(','),
          clientName: p.clientName || '',
          projectUrl: p.projectUrl || '',
          techStack: p.techStack.join(','),
          featured: p.featured,
          published: p.published,
          metaTitle: p.metaTitle || '',
          metaDesc: p.metaDesc || '',
        });
        setLoading(false);
      });
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/admin/portfolio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        ...form,
        images: form.images.split(',').map((i) => i.trim()),
        techStack: form.techStack.split(',').map((t) => t.trim()),
      }),
    });

    router.push('/admin/portfolio');
  };

  if (loading) return null;

  return (
    <div className="max-w-4xl space-y-4">
      <h1 className="text-3xl font-bold">Edit Portfolio</h1>

      <form onSubmit={submit} className="space-y-3">
        <input className="border p-2 w-full" value={form.title}
          onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="Title"/>

        <input className="border p-2 w-full" value={form.slug}
          onChange={(e)=>setForm({...form,slug:e.target.value})} placeholder="Slug"/>

        <input className="border p-2 w-full" value={form.shortDesc}
          onChange={(e)=>setForm({...form,shortDesc:e.target.value})} placeholder="Short Description"/>

        <textarea className="border p-2 w-full" rows={5} value={form.description}
          onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="Description"/>

        <input className="border p-2 w-full" value={form.coverImage}
          onChange={(e)=>setForm({...form,coverImage:e.target.value})} placeholder="Cover Image URL"/>

        <input className="border p-2 w-full" value={form.images}
          onChange={(e)=>setForm({...form,images:e.target.value})} placeholder="Images (comma separated)"/>

        <input className="border p-2 w-full" value={form.clientName}
          onChange={(e)=>setForm({...form,clientName:e.target.value})} placeholder="Client Name"/>

        <input className="border p-2 w-full" value={form.projectUrl}
          onChange={(e)=>setForm({...form,projectUrl:e.target.value})} placeholder="Project URL"/>

        <input className="border p-2 w-full" value={form.techStack}
          onChange={(e)=>setForm({...form,techStack:e.target.value})} placeholder="Tech Stack (comma separated)"/>

        <input className="border p-2 w-full" value={form.metaTitle}
          onChange={(e)=>setForm({...form,metaTitle:e.target.value})} placeholder="Meta Title"/>

        <textarea className="border p-2 w-full" rows={3} value={form.metaDesc}
          onChange={(e)=>setForm({...form,metaDesc:e.target.value})} placeholder="Meta Description"/>

        <label className="flex gap-2"><input type="checkbox" checked={form.featured}
          onChange={(e)=>setForm({...form,featured:e.target.checked})}/> Featured</label>

        <label className="flex gap-2"><input type="checkbox" checked={form.published}
          onChange={(e)=>setForm({...form,published:e.target.checked})}/> Published</label>

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Update Portfolio
        </button>
      </form>
    </div>
  );
}

