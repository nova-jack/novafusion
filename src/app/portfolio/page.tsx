// src/app/portfolio/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { projects, categories } from "@/data/portfolio";

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-slate-950 pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px]" />
        </div>
        <div className="container-main relative z-10 text-center">
          <span className="badge-glass mb-4">Our Work</span>
          <h1 className="heading-xl text-white mb-4">
            Featured <span className="text-brand-400">Projects</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            See how we've helped Ahmedabad's top builders market their properties
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="section bg-white">
        <div className="container-main">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((category) => (
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

          {/* Projects Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProjects.map((project) => (
              <Link 
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className="group relative aspect-[4/3] bg-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden"
              >
                {/* Placeholder Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400" />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
                  <span className="text-xs sm:text-sm text-brand-400 font-medium mb-1">{project.category}</span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-sm text-white/70 line-clamp-2">{project.client}</p>
                  
                  {/* Services Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.services.slice(0, 2).map((service, i) => (
                      <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded-full text-white/80">
                        {service}
                      </span>
                    ))}
                    {project.services.length > 2 && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white/80">
                        +{project.services.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-sm bg-slate-50">
        <div className="container-main">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "200+", label: "Projects Completed" },
              { number: "50+", label: "Happy Clients" },
              { number: "5Cr+", label: "Property Value Marketed" },
              { number: "98%", label: "Client Satisfaction" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">{stat.number}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              Let's discuss your project and create a winning marketing strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-accent">
                Start Your Project
              </Link>
              <a href="tel:+918153836923" className="btn-outline-white">
                📞 Call Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
