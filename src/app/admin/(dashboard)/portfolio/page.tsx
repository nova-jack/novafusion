'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  category: string;
  published: boolean;
  createdAt: string;
}

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/api/admin/portfolio')
      .then((res) => res.json())
      .then((data) => setProjects(data.projects));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <Link
          href="/admin/portfolio/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Project
        </Link>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-4">{p.title}</td>
                <td className="p-4 capitalize">{p.category}</td>
                <td className="p-4">
                  {p.published ? 'Published' : 'Draft'}
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/portfolio/edit/${p.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

