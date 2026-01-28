'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  slug: string;
  published: boolean;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch('/api/admin/services')
      .then((res) => res.json())
      .then((data) => setServices(data.services));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Services</h1>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-4">{s.title}</td>
                <td className="p-4 text-sm text-gray-500">{s.slug}</td>
                <td className="p-4">
                  {s.published ? 'Published' : 'Draft'}
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/services/edit/${s.id}`}
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

