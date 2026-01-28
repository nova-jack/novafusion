'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] =
    useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [selectedEnquiry, setSelectedEnquiry] =
    useState<Enquiry | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/admin/enquiries');
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    id: string,
    status: 'new' | 'read' | 'replied'
  ) => {
    await fetch('/api/admin/enquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchEnquiries();
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;

    await fetch('/api/admin/enquiries', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    setSelectedEnquiry(null);
    fetchEnquiries();
  };

  const filtered = enquiries.filter(
    (e) => filter === 'all' || e.status === filter
  );

  const statusBadge = (status: string) => {
    if (status === 'new') return 'bg-blue-100 text-blue-700';
    if (status === 'read') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Enquiries</h1>
        <span className="text-sm text-gray-500">
          Total: {enquiries.length}
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-3 border-b">
        {['all', 'new', 'read', 'replied'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`pb-2 capitalize ${
              filter === s
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-4">
          {filtered.map((e) => (
            <div
              key={e.id}
              onClick={() => {
                setSelectedEnquiry(e);
                if (e.status === 'new') updateStatus(e.id, 'read');
              }}
              className={`cursor-pointer rounded-lg border p-4 ${
                selectedEnquiry?.id === e.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'bg-white'
              }`}
            >
              <div className="flex justify-between mb-2">
                <div>
                  <p className="font-semibold">{e.name}</p>
                  <p className="text-sm text-gray-500">{e.email}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${statusBadge(
                    e.status
                  )}`}
                >
                  {e.status}
                </span>
              </div>
              <p className="text-sm line-clamp-2">{e.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {format(new Date(e.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="sticky top-6">
          {selectedEnquiry ? (
            <div className="rounded-lg border bg-white p-6 space-y-3">
              <h2 className="text-xl font-bold">Enquiry Details</h2>

              <p><strong>Name:</strong> {selectedEnquiry.name}</p>

              <p>
                <strong>Email:</strong>{' '}
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {selectedEnquiry.email}
                </a>
              </p>

              <p>
                <strong>Phone:</strong>{' '}
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {selectedEnquiry.phone}
                </a>
              </p>

              <p><strong>Service:</strong> {selectedEnquiry.service}</p>

              <p className="whitespace-pre-wrap">
                <strong>Message:</strong> {selectedEnquiry.message}
              </p>

              <div className="flex gap-2 pt-3">
                {['new', 'read', 'replied'].map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      updateStatus(selectedEnquiry.id, s as any)
                    }
                    className={`px-3 py-1 rounded ${
                      selectedEnquiry.status === s
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button
                onClick={() => deleteEnquiry(selectedEnquiry.id)}
                className="mt-4 w-full rounded bg-red-600 py-2 text-white"
              >
                Delete Enquiry
              </button>
            </div>
          ) : (
            <div className="rounded-lg border bg-gray-50 p-12 text-center">
              Select an enquiry
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

