// src/app/contact/page.tsx
"use client";
import { useState } from "react";
import { Metadata } from "next";

const services = [
  "Drone Videography",
  "Property Photography",
  "Video Production",
  "Digital Marketing",
  "Branding & Design",
  "Website Development",
  "Complete Package",
];

const budgets = [
  "Under ₹50,000",
  "₹50,000 - ₹1,00,000",
  "₹1,00,000 - ₹2,50,000",
  "₹2,50,000 - ₹5,00,000",
  "₹5,00,000+",
  "Not sure yet",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", service: "", budget: "", message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact-page" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      setForm({ name: "", email: "", phone: "", company: "", service: "", budget: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-slate-950 pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px]" />
        </div>
        <div className="container-main relative z-10 text-center">
          <span className="badge-glass mb-4">Contact Us</span>
          <h1 className="heading-xl text-white mb-4">
            Let's Work <span className="text-brand-400">Together</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Ready to transform your property marketing? Get in touch for a free consultation.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form - Takes 3 columns */}
            <div className="lg:col-span-3">
              <div className="card p-6 sm:p-8 lg:p-10">
                <h2 className="heading-md text-slate-900 mb-2">Send us a message</h2>
                <p className="text-slate-500 mb-8">Fill out the form and we'll get back to you within 24 hours.</p>

                {status === "success" ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h3>
                    <p className="text-green-700">Thank you for reaching out. We'll contact you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name & Email */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="input"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="input"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    {/* Phone & Company */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className="input"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Company / Project</label>
                        <input
                          type="text"
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          className="input"
                          placeholder="Your Company Name"
                        />
                      </div>
                    </div>

                    {/* Service & Budget */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Service Needed</label>
                        <select
                          name="service"
                          value={form.service}
                          onChange={handleChange}
                          className="input"
                        >
                          <option value="">Select a service</option>
                          {services.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Budget Range</label>
                        <select
                          name="budget"
                          value={form.budget}
                          onChange={handleChange}
                          className="input"
                        >
                          <option value="">Select budget</option>
                          {budgets.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Message *</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="input resize-none"
                        placeholder="Tell us about your project..."
                      />
                    </div>

                    {/* Error */}
                    {status === "error" && (
                      <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl">
                        {error}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="btn-primary w-full disabled:opacity-50"
                    >
                      {status === "loading" ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Contact */}
              <div className="card p-6 sm:p-8">
                <h3 className="heading-sm text-slate-900 mb-6">Quick Contact</h3>
                <div className="space-y-5">
                  <a href="tel:+918153836923" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl group-hover:bg-brand-100 transition-colors">
                      📞
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">+91 81538 36923</p>
                    </div>
                  </a>
                  <a href="mailto:hello@novafusion.in" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl group-hover:bg-brand-100 transition-colors">
                      ✉️
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">hello@novafusion.in</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl">
                      📍
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Location</p>
                      <p className="font-semibold text-slate-900">Ahmedabad, Gujarat</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="card p-6 sm:p-8 bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    💬
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Prefer WhatsApp?</h3>
                    <p className="text-green-100 text-sm">Get instant response</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/918153836923?text=Hi! I'm interested in your real estate marketing services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-white text-green-600 w-full hover:bg-green-50 font-semibold"
                >
                  Chat on WhatsApp
                </a>
              </div>

              {/* Working Hours */}
              <div className="card p-6 sm:p-8">
                <h3 className="heading-sm text-slate-900 mb-4">Working Hours</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monday - Friday</span>
                    <span className="font-medium text-slate-900">9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Saturday</span>
                    <span className="font-medium text-slate-900">10:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sunday</span>
                    <span className="font-medium text-slate-900">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-sm bg-slate-50">
        <div className="container-main">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-md text-slate-900 mb-4">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {[
                { q: "How long does a typical project take?", a: "Most projects are completed within 1-2 weeks, depending on the scope. Drone shoots and photography can be delivered within 3-5 days." },
                { q: "Do you work with projects outside Ahmedabad?", a: "Yes! While we're based in Ahmedabad, we serve clients across Gujarat including Surat, Vadodara, Rajkot, and Gandhinagar." },
                { q: "What's included in a complete marketing package?", a: "Our complete package includes drone videography, photography, video production, social media marketing, and lead generation campaigns." },
                { q: "Can I see samples of your work?", a: "Absolutely! Check out our Portfolio page or ask us to share relevant samples based on your project type." },
              ].map((faq, i) => (
                <details key={i} className="group card p-6 cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold text-slate-900 list-none">
                    {faq.q}
                    <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    </>
  );
}
