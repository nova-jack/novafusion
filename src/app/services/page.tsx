// src/app/services/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Real Estate Marketing Services Ahmedabad",
  description: "Complete real estate marketing services in Ahmedabad - drone videography, photography, video production, digital marketing, branding, and web development for builders.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-slate-950 pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px]" />
        </div>
        <div className="container-main relative z-10 text-center">
          <span className="badge-glass mb-4">Our Services</span>
          <h1 className="heading-xl text-white mb-4">
            Complete Marketing <span className="text-brand-400">Solutions</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need to market and sell properties faster in Ahmedabad
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, i) => (
              <Link 
                key={service.slug} 
                href={`/services/${service.slug}`}
                className="group card-interactive p-6 sm:p-8"
              >
                {/* Icon */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-5 group-hover:bg-brand-50 group-hover:scale-110 transition-all duration-300">
                  {service.icon}
                </div>

                {/* Content */}
                <h2 className="heading-sm text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                  {service.shortTitle}
                </h2>
                <p className="text-body-sm mb-4">
                  {service.shortDesc}
                </p>

                {/* Features Preview */}
                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="flex items-center text-brand-600 font-semibold text-sm group-hover:gap-3 gap-1 transition-all">
                  Learn More
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-sm bg-slate-50">
        <div className="container-main">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-md text-slate-900 mb-4">
              Not Sure What You Need?
            </h2>
            <p className="text-body mb-8">
              Let's discuss your project and we'll recommend the best services for your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Get Free Consultation
              </Link>
              <a 
                href="https://wa.me/918153836923?text=Hi! I need help choosing the right marketing services for my property."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
