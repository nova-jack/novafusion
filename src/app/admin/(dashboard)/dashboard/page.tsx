// src/app/admin/(dashboard)/dashboard/page.tsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const stats = [
  { label: "Total Enquiries", value: "24", change: "+12%", icon: "📩", color: "bg-blue-500" },
  { label: "Blog Posts", value: "4", change: "+2", icon: "📝", color: "bg-green-500" },
  { label: "Portfolio Items", value: "6", change: "+1", icon: "🖼️", color: "bg-purple-500" },
  { label: "Page Views", value: "1.2k", change: "+18%", icon: "👁️", color: "bg-amber-500" },
];

const recentEnquiries = [
  { id: 1, name: "Rajesh Patel", email: "rajesh@example.com", service: "Drone Videography", date: "2 hours ago", status: "new" },
  { id: 2, name: "Amit Shah", email: "amit@safal.com", service: "Complete Package", date: "5 hours ago", status: "new" },
  { id: 3, name: "Priya Mehta", email: "priya@gokul.com", service: "Digital Marketing", date: "1 day ago", status: "contacted" },
  { id: 4, name: "Vikram Singh", email: "vikram@aryan.com", service: "Photography", date: "2 days ago", status: "contacted" },
];

const quickActions = [
  { label: "New Blog Post", href: "/admin/blogs/new", icon: "📝", color: "bg-green-100 text-green-700" },
  { label: "Add Portfolio", href: "/admin/portfolio/new", icon: "🖼️", color: "bg-purple-100 text-purple-700" },
  { label: "View Enquiries", href: "/admin/enquiries", icon: "📩", color: "bg-blue-100 text-blue-700" },
  { label: "Settings", href: "/admin/settings", icon: "⚙️", color: "bg-slate-100 text-slate-700" },
];

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{greeting}, Admin! 👋</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your website</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/blogs/new" className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
            + New Post
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className={`${action.color} p-4 rounded-xl text-center hover:opacity-80 transition-opacity`}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-sm font-medium">{action.label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Enquiries */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Enquiries</h2>
          <Link href="/admin/enquiries" className="text-sm text-brand-600 font-medium hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Name</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">Service</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Time</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentEnquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{enquiry.name}</div>
                    <div className="text-sm text-slate-500">{enquiry.email}</div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell text-slate-600">{enquiry.service}</td>
                  <td className="px-6 py-4 hidden md:table-cell text-slate-500 text-sm">{enquiry.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      enquiry.status === "new" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {enquiry.status === "new" ? "New" : "Contacted"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-brand-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Need Help?</h3>
            <p className="text-white/80 text-sm mt-1">Contact support or check documentation</p>
          </div>
          <a href="https://wa.me/918153836923" target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-white text-brand-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors inline-block text-center">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
