// src/app/blog/[slug]/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogs, getBlogBySlug, getRecentBlogs } from "@/data/blogs";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = getBlogBySlug(params.slug);
  if (!blog) return { title: "Article Not Found" };
  
  return {
    title: blog.metaTitle,
    description: blog.metaDesc,
    openGraph: {
      title: blog.metaTitle,
      description: blog.metaDesc,
      type: "article",
      publishedTime: blog.date,
      authors: [blog.author],
    },
  };
}

export default function BlogDetailPage({ params }: Props) {
  const blog = getBlogBySlug(params.slug);
  
  if (!blog) {
    notFound();
  }

  const relatedBlogs = getRecentBlogs(3).filter(b => b.slug !== blog.slug).slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-slate-950 pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px]" />
        </div>
        <div className="container-main relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Articles
            </Link>
            
            <span className="badge-glass mb-4">{blog.category}</span>
            <h1 className="heading-lg text-white mb-6">{blog.title}</h1>
            
            <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
              <span>{blog.author}</span>
              <span>•</span>
              <span>{blog.date}</span>
              <span>•</span>
              <span>{blog.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="bg-white py-8">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                <span className="text-slate-500">Article Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section bg-white">
        <div className="container-main">
          <article className="max-w-3xl mx-auto">
            {/* Render markdown-like content */}
            <div className="prose prose-lg prose-slate max-w-none
              prose-headings:font-bold prose-headings:text-slate-900
              prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-slate-900
              prose-ul:my-4 prose-ul:pl-6
              prose-li:text-slate-600 prose-li:mb-2
              prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline
            ">
              {blog.content.split('\n').map((line, i) => {
                // Simple markdown parsing
                if (line.startsWith('# ')) {
                  return <h1 key={i}>{line.replace('# ', '')}</h1>;
                }
                if (line.startsWith('## ')) {
                  return <h2 key={i}>{line.replace('## ', '')}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={i}>{line.replace('### ', '')}</h3>;
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={i}><strong>{line.replace(/\*\*/g, '')}</strong></p>;
                }
                if (line.startsWith('- ')) {
                  return <li key={i}>{line.replace('- ', '')}</li>;
                }
                if (line.trim() === '') {
                  return null;
                }
                return <p key={i}>{line}</p>;
              })}
            </div>

            {/* Author & Share */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-slate-600">NF</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{blog.author}</p>
                    <p className="text-sm text-slate-500">NovaFusion</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 mr-2">Share:</span>
                  <a href={`https://wa.me/?text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                    💬
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-300 transition-colors">
                    𝕏
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://novafusion.in/blog/${blog.slug}`)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    in
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-slate-50">
        <div className="container-main">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="heading-md text-slate-900 mb-4">
              Need Help with Your Marketing?
            </h2>
            <p className="text-body mb-8">
              Let's discuss how we can help your real estate project succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Get Free Consultation
              </Link>
              <a href="https://wa.me/918153836923" target="_blank" rel="noopener noreferrer" className="btn-outline">
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="section-sm bg-white">
          <div className="container-main">
            <h2 className="heading-md text-slate-900 mb-8 text-center">Related Articles</h2>
            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {relatedBlogs.map((b) => (
                <Link key={b.slug} href={`/blog/${b.slug}`} className="group card-hover overflow-hidden">
                  <div className="aspect-video bg-slate-200">
                    <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-brand-600 uppercase">{b.category}</span>
                    <h3 className="font-semibold text-slate-900 mt-2 group-hover:text-brand-600 transition-colors line-clamp-2">{b.title}</h3>
                    <p className="text-sm text-slate-500 mt-2">{b.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.excerpt,
            "author": { "@type": "Organization", "name": "NovaFusion" },
            "datePublished": blog.date,
            "publisher": {
              "@type": "Organization",
              "name": "NovaFusion",
              "logo": { "@type": "ImageObject", "url": "https://novafusion.in/logo.png" }
            }
          })
        }}
      />
    </>
  );
}
