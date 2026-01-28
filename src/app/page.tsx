// src/app/page.tsx
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NovaFusion | Real Estate Marketing Agency Ahmedabad",
  description: "Ahmedabad's leading real estate marketing agency. Drone videography, property photography, digital marketing for builders and developers.",
};

const services = [
  { icon: "🚁", title: "Drone Videography", desc: "Cinematic aerial shots that showcase properties from stunning angles.", href: "/services/drone-videography" },
  { icon: "📸", title: "Property Photography", desc: "Professional photography that captures every detail beautifully.", href: "/services/photography" },
  { icon: "🎬", title: "Video Production", desc: "Compelling walkthrough videos and virtual tours.", href: "/services/video-production" },
  { icon: "📱", title: "Digital Marketing", desc: "Data-driven campaigns that generate quality leads.", href: "/services/digital-marketing" },
  { icon: "🎨", title: "Branding & Design", desc: "Complete brand identity for real estate projects.", href: "/services/branding" },
  { icon: "🌐", title: "Web Development", desc: "High-converting websites for builders.", href: "/services/web-development" },
];

const stats = [
  { number: "200+", label: "Projects" },
  { number: "50+", label: "Clients" },
  { number: "98%", label: "Satisfaction" },
  { number: "5+", label: "Years" },
];

const works = [
  { title: "Shivalik Heights", category: "Drone + Video", image: "/images/work1.jpg" },
  { title: "Gokul Residency", category: "Photography", image: "/images/work2.jpg" },
  { title: "Safal Paradise", category: "Full Marketing", image: "/images/work3.jpg" },
];

export default function HomePage() {
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-center bg-slate-950 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="container-main relative z-10 pt-24 pb-16 sm:pt-32 sm:pb-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 badge-glass mb-6 sm:mb-8 animate-fade-down">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Real Estate Marketing Agency</span>
            </div>

            {/* Heading */}
            <h1 className="heading-xl text-white mb-6 animate-fade-up">
              We Help Builders
              <span className="block mt-2 text-gradient bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400">
                Sell Properties Faster
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 animate-fade-up delay-100 px-4">
              Stunning drone videos, professional photography & digital marketing 
              for real estate in Ahmedabad
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 animate-fade-up delay-200">
              <Link href="/contact" className="btn-accent">
                Get Free Consultation
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/portfolio" className="btn-white">
                View Our Work
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-16 sm:mt-20 pt-8 sm:pt-10 border-t border-white/10 animate-fade-up delay-300">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block animate-bounce">
          <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* ========== SERVICES ========== */}
      <section className="section bg-white">
        <div className="container-main">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
            <span className="badge-brand mb-4">Services</span>
            <h2 className="heading-lg text-slate-900 mb-4">
              Everything You Need to
              <span className="text-gradient"> Market Properties</span>
            </h2>
            <p className="text-body">
              Complete marketing solutions for real estate developers in Ahmedabad
            </p>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service, i) => (
              <Link key={i} href={service.href} className="group card-interactive p-6 sm:p-8">
                {/* Icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-5 group-hover:bg-brand-50 group-hover:scale-110 transition-all duration-300">
                  {service.icon}
                </div>
                
                {/* Content */}
                <h3 className="heading-sm text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-body-sm">{service.desc}</p>
                
                {/* Arrow */}
                <div className="mt-4 sm:mt-5 flex items-center text-brand-600 font-medium text-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ABOUT / WHY US ========== */}
      <section className="section bg-slate-50">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Content */}
            <div className="order-2 lg:order-1">
              <span className="badge-brand mb-4">Why NovaFusion</span>
              <h2 className="heading-lg text-slate-900 mb-6">
                Trusted by Ahmedabad's
                <span className="text-gradient"> Top Builders</span>
              </h2>
              <p className="text-body mb-8">
                We understand the local market. Our team combines deep real estate expertise with world-class production quality to deliver results.
              </p>

              {/* Features */}
              <div className="space-y-4 sm:space-y-5">
                {[
                  { icon: "🎯", title: "Local Expertise", desc: "Deep understanding of Ahmedabad's real estate market" },
                  { icon: "⚡", title: "Fast Delivery", desc: "Quick turnaround without compromising quality" },
                  { icon: "📈", title: "Proven Results", desc: "200+ successful projects with measurable ROI" },
                  { icon: "🤝", title: "End-to-End", desc: "Everything from shoots to campaigns under one roof" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Visual */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl" />
                
                {/* Video Placeholder */}
                <div className="relative aspect-video bg-slate-800/50 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 text-center">
                  <p className="text-white font-semibold">Watch Our Showreel</p>
                  <p className="text-slate-400 text-sm mt-1">See our work in action</p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-20 h-20 sm:w-28 sm:h-28 bg-brand-100 rounded-2xl -z-10" />
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-14 h-14 sm:w-20 sm:h-20 bg-amber-100 rounded-xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== PORTFOLIO PREVIEW ========== */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
            <div>
              <span className="badge-brand mb-4">Portfolio</span>
              <h2 className="heading-lg text-slate-900">
                Featured <span className="text-gradient">Projects</span>
              </h2>
            </div>
            <Link href="/portfolio" className="btn-ghost text-brand-600 -ml-4 sm:ml-0">
              View all projects
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Projects Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {works.map((work, i) => (
              <div key={i} className="group relative aspect-[4/3] bg-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer">
                {/* Placeholder Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400" />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
                  <span className="text-xs sm:text-sm text-white/70 mb-1">{work.category}</span>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">{work.title}</h3>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="section bg-slate-950 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="container-main relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-lg text-white mb-6">
              Ready to Sell Properties <span className="text-brand-400">Faster?</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 sm:mb-10 px-4">
              Get a free consultation and see how we can transform your property marketing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link href="/contact" className="btn-accent">
                Get Free Quote
              </Link>
              <a 
                href="https://wa.me/918153836923?text=Hi! I'm interested in your real estate marketing services."
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-green-600 text-white rounded-full px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base hover:bg-green-700 hover:-translate-y-0.5"
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SCHEMA ========== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "NovaFusion",
            "description": "Real Estate Marketing Agency in Ahmedabad",
            "url": "https://novafusion.in",
            "telephone": "+918153836923",
            "address": { "@type": "PostalAddress", "addressLocality": "Ahmedabad", "addressRegion": "Gujarat", "addressCountry": "IN" },
            "areaServed": "Ahmedabad",
          })
        }}
      />
    </>
  );
}
