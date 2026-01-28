// src/app/blog/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { blogs, blogCategories } from "@/data/blogs";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredBlogs = activeCategory === "All" 
    ? blogs 
    : blogs.filter(b => b.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-slate-950 pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px]" />
        </div>
        <div className="container-main relative z-10 text-center">
          <span className="badge-glass mb-4">Blog</span>
          <h1 className="heading-xl text-white mb-4">
            Marketing <span className="text-brand-400">Insights</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Tips, guides, and insights on real estate marketing in Ahmedabad
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section bg-white">
        <div className="container-main">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {blogCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {activeCategory === "All" && blogs.filter(b => b.featured)[0] && (
            <Link 
              href={`/blog/${blogs.filter(b => b.featured)[0].slug}`}
              className="block group mb-12"
            >
              <div className="grid lg:grid-cols-2 gap-8 items-center card-hover p-6 sm:p-8">
                <div className="aspect-video bg-slate-200 rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400" />
                </div>
                <div>
                  <span className="badge-brand mb-4">{blogs.filter(b => b.featured)[0].category}</span>
                  <h2 className="heading-md text-slate-900 mb-4 group-hover:text-brand-600 transition-colors">
                    {blogs.filter(b => b.featured)[0].title}
                  </h2>
                  <p className="text-body mb-6">
                    {blogs.filter(b => b.featured)[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>{blogs.filter(b => b.featured)[0].date}</span>
                    <span>•</span>
                    <span>{blogs.filter(b => b.featured)[0].readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Blog Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredBlogs.filter(b => activeCategory !== "All" || !b.featured).map((blog) => (
              <Link 
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="group card-hover overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-video bg-slate-200 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 group-hover:scale-105 transition-transform duration-300" />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <span className="text-xs font-medium text-brand-600 uppercase tracking-wider">
                    {blog.category}
                  </span>
                  <h3 className="heading-sm text-slate-900 mt-2 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-body-sm line-clamp-2 mb-4">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500">No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-sm bg-slate-50">
        <div className="container-main">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="heading-md text-slate-900 mb-4">
              Get Marketing Tips in Your Inbox
            </h2>
            <p className="text-body mb-8">
              Join 500+ real estate professionals getting weekly insights.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input flex-1"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
