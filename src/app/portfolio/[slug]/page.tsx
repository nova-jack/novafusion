// src/app/portfolio/[slug]/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/data/portfolio";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found" };
  
  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
  };
}

export default function PortfolioDetailPage({ params }: Props) {
  const project = getProjectBySlug(params.slug);
  
  if (!project) {
    notFound();
  }

  const relatedProjects = projects.filter(p => p.slug !== project.slug && p.category === project.category).slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-slate-950 pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px]" />
        </div>
        <div className="container-main relative z-10">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Projects
          </Link>
          
          <span className="badge-glass mb-4">{project.category}</span>
          <h1 className="heading-xl text-white mb-4">{project.title}</h1>
          <p className="text-lg text-slate-400 max-w-3xl">{project.description}</p>
          
          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-white/10">
            <div>
              <p className="text-sm text-slate-500 mb-1">Client</p>
              <p className="font-semibold text-white">{project.client}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Services</p>
              <p className="font-semibold text-white">{project.services.join(", ")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Image */}
      <section className="bg-white py-12">
        <div className="container-main">
          <div className="aspect-video bg-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
              <span className="text-slate-500 text-lg">Project Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge & Solution */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <span className="badge-brand mb-4">The Challenge</span>
              <h2 className="heading-md text-slate-900 mb-4">What They Needed</h2>
              <p className="text-body">{project.challenge}</p>
            </div>
            <div>
              <span className="badge-brand mb-4">Our Solution</span>
              <h2 className="heading-md text-slate-900 mb-4">What We Did</h2>
              <p className="text-body">{project.solution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section bg-slate-50">
        <div className="container-main">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="badge-brand mb-4">Results</span>
            <h2 className="heading-lg text-slate-900">The Impact</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {project.results.map((result, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-700 font-medium">{result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {project.testimonial && (
        <section className="section bg-white">
          <div className="container-main">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-5xl text-brand-200 mb-6">"</div>
              <blockquote className="text-xl sm:text-2xl text-slate-700 font-medium leading-relaxed mb-8">
                {project.testimonial.quote}
              </blockquote>
              <div>
                <p className="font-semibold text-slate-900">{project.testimonial.author}</p>
                <p className="text-slate-500">{project.testimonial.role}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="container-main relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="heading-lg text-white mb-4">
              Want Similar Results?
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Let's discuss how we can help your project succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-accent">
                Start Your Project
              </Link>
              <a href="https://wa.me/918153836923" target="_blank" rel="noopener noreferrer" className="btn bg-green-600 text-white rounded-full px-6 py-3 sm:px-8 sm:py-4 hover:bg-green-700">
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="section-sm bg-white">
          <div className="container-main">
            <h2 className="heading-md text-slate-900 mb-8 text-center">Related Projects</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedProjects.map((p) => (
                <Link key={p.slug} href={`/portfolio/${p.slug}`} className="group card-hover overflow-hidden">
                  <div className="aspect-video bg-slate-200">
                    <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400" />
                  </div>
                  <div className="p-6">
                    <span className="text-sm text-brand-600 font-medium">{p.category}</span>
                    <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-brand-600 transition-colors">{p.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{p.client}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
