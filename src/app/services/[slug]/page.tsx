// src/app/services/[slug]/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getServiceBySlug, getAllServiceSlugs } from "@/data/services";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);
  if (!service) return { title: "Service Not Found" };
  
  return {
    title: service.metaTitle,
    description: service.metaDesc,
    openGraph: {
      title: service.metaTitle,
      description: service.metaDesc,
    },
  };
}

export default function ServicePage({ params }: Props) {
  const service = getServiceBySlug(params.slug);
  
  if (!service) {
    notFound();
  }

  const otherServices = services.filter(s => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-slate-950 pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px]" />
        </div>
        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <Link href="/services" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Services
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-4xl">
                {service.icon}
              </div>
            </div>
            <h1 className="heading-xl text-white mb-4">
              {service.title}
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              {service.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/contact" className="btn-accent">
                Get Quote
              </Link>
              <a href="tel:+918153836923" className="btn-outline-white">
                📞 Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="max-w-2xl mb-12">
            <span className="badge-brand mb-4">What's Included</span>
            <h2 className="heading-lg text-slate-900">Service Features</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {service.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section bg-slate-50">
        <div className="container-main">
          <div className="max-w-2xl mb-12">
            <span className="badge-brand mb-4">Benefits</span>
            <h2 className="heading-lg text-slate-900">Why Choose This Service</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {service.benefits.map((benefit, i) => (
              <div key={i} className="card p-6 sm:p-8">
                <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center text-xl font-bold text-brand-600 mb-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="heading-sm text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="max-w-2xl mb-12">
            <span className="badge-brand mb-4">Our Process</span>
            <h2 className="heading-lg text-slate-900">How We Work</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {service.process.map((step, i) => (
              <div key={i} className="relative">
                {/* Connector Line - Hidden on mobile */}
                {i < service.process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-slate-200 z-0" />
                )}
                <div className="relative z-10 text-center lg:text-left">
                  <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto lg:mx-0 mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-slate-50">
        <div className="container-main">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="badge-brand mb-4">FAQ</span>
              <h2 className="heading-lg text-slate-900">Common Questions</h2>
            </div>
            <div className="space-y-4">
              {service.faqs.map((faq, i) => (
                <details key={i} className="group card p-6 cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold text-slate-900 list-none">
                    {faq.q}
                    <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-slate-600 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
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
              Ready to Get Started?
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Let's discuss your project and create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-accent">
                Get Free Quote
              </Link>
              <a 
                href={`https://wa.me/918153836923?text=Hi! I'm interested in your ${service.shortTitle} services.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-green-600 text-white rounded-full px-6 py-3 sm:px-8 sm:py-4 hover:bg-green-700"
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="section-sm bg-white">
        <div className="container-main">
          <h2 className="heading-md text-slate-900 mb-8 text-center">Other Services</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {otherServices.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="card-hover p-6 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                  {s.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{s.shortTitle}</h3>
                <p className="text-sm text-slate-500">{s.shortDesc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": service.title,
            "description": service.description,
            "provider": {
              "@type": "LocalBusiness",
              "name": "NovaFusion",
              "address": { "@type": "PostalAddress", "addressLocality": "Ahmedabad", "addressRegion": "Gujarat" }
            },
            "areaServed": "Ahmedabad"
          })
        }}
      />
    </>
  );
}
